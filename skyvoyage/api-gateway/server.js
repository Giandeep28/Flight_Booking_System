/**
 * SkyVoyage API Gateway - Node.js
 * Routes requests between Frontend ↔ Java Backend ↔ Python Layer
 * Port: 4000
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'skyvoyage_jwt_secret_2026_premium';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const JAVA_BACKEND = process.env.JAVA_BACKEND || 'http://127.0.0.1:8080';
const PYTHON_LAYER = process.env.PYTHON_LAYER || 'http://127.0.0.1:5000';

// ── MongoDB Connection ─────────────────────────────────────────
let db;
async function connectDB() {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db('skyvoyage_db');
        console.log('[Gateway] MongoDB connected to skyvoyage_db');
        
        // Create indexes
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('bookings').createIndex({ pnr: 1 }, { unique: true });
        await db.collection('bookings').createIndex({ userId: 1 });
        await db.collection('searchCache').createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 });
    } catch (err) {
        console.error('[Gateway] MongoDB connection failed:', err.message);
        console.log('[Gateway] Continuing without DB - some features will be limited');
    }
}

// ── Middleware ──────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('[:date[clf]] :method :url :status :response-time ms'));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rate limiters
const searchLimiter = rateLimit({ windowMs: 60000, max: 100, message: { success: false, message: 'Too many search requests' } });
const bookingLimiter = rateLimit({ windowMs: 60000, max: 20, message: { success: false, message: 'Too many booking requests' } });
const authLimiter = rateLimit({ windowMs: 900000, max: 15, message: { success: false, message: 'Too many auth attempts' } });

// ── Auth Middleware ─────────────────────────────────────────────
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

function optionalAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
        try { req.user = jwt.verify(token, JWT_SECRET); } catch (e) { /* ignore */ }
    }
    next();
}

// ── Helper: Proxy request to service ───────────────────────────
async function proxyRequest(targetUrl, method, body, timeout = 12000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
        };
        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }
        
        const resp = await fetch(targetUrl, options);
        clearTimeout(timer);
        
        const data = await resp.json();
        return { status: resp.status, data };
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

// ══════════════════════════════════════════════════════════════
//  HEALTH CHECK
// ══════════════════════════════════════════════════════════════
app.get('/api/health', async (req, res) => {
    const services = { gateway: 'ok', mongodb: 'unknown', python: 'unknown', java: 'unknown' };
    
    try { if (db) { await db.admin().ping(); services.mongodb = 'ok'; } } catch (e) { services.mongodb = 'down'; }
    try { const r = await fetch(`${PYTHON_LAYER}/health`); if (r.ok) services.python = 'ok'; } catch (e) { services.python = 'down'; }
    try { const r = await fetch(`${JAVA_BACKEND}/health`); if (r.ok) services.java = 'ok'; } catch (e) { services.java = 'down'; }
    
    res.json({ success: true, services, timestamp: new Date().toISOString() });
});

// ══════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ══════════════════════════════════════════════════════════════
app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }
        
        if (!db) return res.status(503).json({ success: false, message: 'Database unavailable' });
        
        const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });
        
        const passwordHash = await bcrypt.hash(password, 12);
        const user = {
            name, email: email.toLowerCase(), passwordHash, phone: phone || '',
            loyaltyPoints: 0, tier: 'Silver', createdAt: new Date(), isActive: true,
        };
        
        const result = await db.collection('users').insertOne(user);
        const token = jwt.sign({ userId: result.insertedId, email: user.email, name }, JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({
            success: true, message: 'Registration successful',
            token, user: { id: result.insertedId, name, email: user.email, loyaltyPoints: 0, tier: 'Silver' },
        });
    } catch (err) {
        console.error('[Auth] Register error:', err);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
        if (!db) return res.status(503).json({ success: false, message: 'Database unavailable' });
        
        const user = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        
        const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            success: true, message: 'Login successful', token,
            user: { id: user._id, name: user.name, email: user.email, loyaltyPoints: user.loyaltyPoints || 0, tier: user.tier || 'Silver' },
        });
    } catch (err) {
        console.error('[Auth] Login error:', err);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// ══════════════════════════════════════════════════════════════
//  FLIGHT SEARCH - Proxy to Python layer (primary) + Java fallback
// ══════════════════════════════════════════════════════════════
app.post('/api/searchFlights', searchLimiter, optionalAuth, async (req, res) => {
    try {
        const { from, to, date, passengers } = req.body;
        
        if (!from || !to || !date) {
            return res.status(400).json({ success: false, message: 'from, to, and date are required' });
        }
        
        // Try Python layer first (has Amadeus + mock aggregator)
        let result;
        try {
            const pyResp = await proxyRequest(`${PYTHON_LAYER}/flights/search`, 'POST', {
                origin: from, destination: to, date, passengers: passengers || 1
            });
            result = pyResp.data;
        } catch (pyErr) {
            console.log('[Search] Python unavailable, trying Java backend');
            try {
                const javaResp = await proxyRequest(`${JAVA_BACKEND}/api/flights/search`, 'POST', {
                    from, to, date, passengers: passengers || 1
                });
                result = javaResp.data;
            } catch (javaErr) {
                console.error('[Search] Both backends unavailable');
                return res.status(503).json({ success: false, message: 'Flight search services temporarily unavailable' });
            }
        }
        
        // Cache search in MongoDB
        if (db && result?.flights) {
            try {
                await db.collection('searchCache').insertOne({
                    query: { from, to, date, passengers },
                    resultsCount: result.flights?.length || 0,
                    userId: req.user?.userId || 'anonymous',
                    createdAt: new Date(),
                });
            } catch (e) { /* cache write failure is non-critical */ }
        }
        
        res.json(result);
    } catch (err) {
        console.error('[Search] Error:', err);
        res.status(500).json({ success: false, message: 'Search failed' });
    }
});

// ══════════════════════════════════════════════════════════════
//  FLIGHT DETAILS
// ══════════════════════════════════════════════════════════════
app.get('/api/getFlightDetails/:flightId', async (req, res) => {
    try {
        const { flightId } = req.params;
        const { origin, destination, date } = req.query;
        
        const pyResp = await proxyRequest(
            `${PYTHON_LAYER}/flights/revalidate?flight_id=${flightId}&origin=${origin}&destination=${destination}&date=${date}`,
            'POST', {}
        );
        res.json(pyResp.data);
    } catch (err) {
        res.status(503).json({ success: false, message: 'Flight details unavailable' });
    }
});

// ══════════════════════════════════════════════════════════════
//  PRICE REVALIDATION
// ══════════════════════════════════════════════════════════════
app.post('/api/revalidatePrice', async (req, res) => {
    try {
        const { flightId, origin, destination, date } = req.body;
        
        const pyResp = await proxyRequest(
            `${PYTHON_LAYER}/flights/revalidate?flight_id=${flightId}&origin=${origin}&destination=${destination}&date=${date}`,
            'POST', {}
        );
        res.json(pyResp.data);
    } catch (err) {
        res.status(503).json({ success: false, message: 'Price revalidation unavailable' });
    }
});

// ══════════════════════════════════════════════════════════════
//  BOOKING
// ══════════════════════════════════════════════════════════════
app.post('/api/bookFlight', bookingLimiter, async (req, res) => {
    try {
        const { flight, passenger, userId } = req.body;
        
        if (!flight || !passenger) {
            return res.status(400).json({ success: false, message: 'Flight and passenger details required' });
        }
        
        if (!db) return res.status(503).json({ success: false, message: 'Database unavailable for booking' });
        
        // Generate PNR
        const pnr = 'SV' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const bookingId = new ObjectId().toString();
        
        // Check for duplicate booking
        const duplicate = await db.collection('bookings').findOne({
            'flight.id': flight.id,
            'passenger.email': passenger.email,
            'flight.date': flight.date,
            status: { $in: ['Confirmed', 'Pending'] },
        });
        
        if (duplicate) {
            return res.status(409).json({ success: false, message: 'Duplicate booking detected', existingPNR: duplicate.pnr });
        }
        
        const booking = {
            bookingId,
            pnr,
            userId: userId || req.user?.userId || 'guest',
            flight: {
                id: flight.id,
                airline: flight.airline,
                airlineCode: flight.airlineCode,
                flightNumber: flight.flightNumber,
                departure: flight.departure,
                arrival: flight.arrival,
                duration: flight.duration,
                aircraft: flight.aircraft || 'Unknown',
                date: flight.date || new Date().toISOString().split('T')[0],
            },
            passenger: {
                name: passenger.name,
                email: passenger.email,
                phone: passenger.phone || '',
                age: passenger.age || null,
                gender: passenger.gender || null,
            },
            pricing: {
                baseFare: flight.baseFare || flight.price,
                taxes: flight.taxes || Math.round((flight.price || 0) * 0.18),
                total: flight.price || (flight.baseFare + (flight.taxes || 0)),
                currency: 'INR',
            },
            services: {
                seatSelection: passenger.seatPreference || 'auto',
                meal: passenger.meal || 'none',
                extraBaggage: passenger.extraBaggage || 0,
            },
            status: 'Confirmed',
            paymentStatus: 'Completed',
            eticketNumber: `ET${Date.now().toString(36).toUpperCase()}`,
            loyaltyPointsEarned: Math.floor((flight.price || 0) / 100),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        await db.collection('bookings').insertOne(booking);
        
        // Update user loyalty points
        if (booking.userId !== 'guest') {
            try {
                await db.collection('users').updateOne(
                    { _id: new ObjectId(booking.userId) },
                    { $inc: { loyaltyPoints: booking.loyaltyPointsEarned } }
                );
            } catch (e) { /* non-critical */ }
        }
        
        // Log to flights collection
        try {
            await db.collection('flights').insertOne({
                flightId: flight.id,
                bookingId,
                pnr,
                route: `${flight.departure?.airport}-${flight.arrival?.airport}`,
                date: flight.date,
                loggedAt: new Date(),
            });
        } catch (e) { /* non-critical */ }
        
        console.log(`[Booking] ✅ PNR ${pnr} created for ${passenger.name}`);
        
        res.status(201).json({
            success: true,
            message: 'Booking confirmed!',
            booking: {
                pnr: booking.pnr,
                bookingId: booking.bookingId,
                status: booking.status,
                flight: booking.flight,
                passenger: booking.passenger,
                pricing: booking.pricing,
                eticketNumber: booking.eticketNumber,
                loyaltyPointsEarned: booking.loyaltyPointsEarned,
                createdAt: booking.createdAt,
            },
        });
    } catch (err) {
        console.error('[Booking] Error:', err);
        res.status(500).json({ success: false, message: 'Booking failed' });
    }
});

// ══════════════════════════════════════════════════════════════
//  BOOKING HISTORY
// ══════════════════════════════════════════════════════════════
app.get('/api/getBookingHistory/:userId', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ success: false, message: 'Database unavailable' });
        
        const bookings = await db.collection('bookings')
            .find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();
        
        res.json({ success: true, count: bookings.length, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch history' });
    }
});

// PNR Lookup
app.post('/api/lookupPNR', async (req, res) => {
    try {
        const { pnr, lastName } = req.body;
        if (!pnr) return res.status(400).json({ success: false, message: 'PNR is required' });
        if (!db) return res.status(503).json({ success: false, message: 'Database unavailable' });
        
        const booking = await db.collection('bookings').findOne({ pnr: pnr.toUpperCase() });
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        
        res.json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lookup failed' });
    }
});

// Cancel booking
app.post('/api/cancelBooking', async (req, res) => {
    try {
        const { pnr } = req.body;
        if (!pnr || !db) return res.status(400).json({ success: false, message: 'PNR required' });
        
        const booking = await db.collection('bookings').findOne({ pnr: pnr.toUpperCase() });
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        if (booking.status === 'Cancelled') return res.status(400).json({ success: false, message: 'Already cancelled' });
        
        // Refund calculation
        const flightDate = new Date(booking.flight.date);
        const hoursUntil = (flightDate - new Date()) / (1000 * 60 * 60);
        let refundPercent = 0;
        if (hoursUntil > 72) refundPercent = 100;
        else if (hoursUntil > 24) refundPercent = 50;
        
        const refundAmount = Math.round(booking.pricing.total * refundPercent / 100);
        
        await db.collection('bookings').updateOne(
            { pnr: pnr.toUpperCase() },
            { $set: { status: 'Cancelled', refundAmount, refundPercent, cancelledAt: new Date(), updatedAt: new Date() } }
        );
        
        res.json({
            success: true,
            message: `Booking cancelled. ${refundPercent}% refund (₹${refundAmount.toLocaleString()}) will be processed in 7-10 business days.`,
            refundAmount, refundPercent,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Cancellation failed' });
    }
});

// ══════════════════════════════════════════════════════════════
//  AIRPORT SEARCH - Proxy to Python
// ══════════════════════════════════════════════════════════════
app.get('/api/airports/search', async (req, res) => {
    try {
        const q = req.query.q || '';
        const pyResp = await proxyRequest(`${PYTHON_LAYER}/airports/search?q=${encodeURIComponent(q)}&limit=25`, 'GET');
        res.json(pyResp.data);
    } catch (err) {
        // Fallback: return empty
        res.json({ success: true, count: 0, airports: [] });
    }
});

// ══════════════════════════════════════════════════════════════
//  CHATBOT - Claude AI Proxy
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
//  AI CHATBOT - Multi-Model Resilience (Claude + Gemini Fallback)
// ══════════════════════════════════════════════════════════════
app.post('/api/chatbot/message', async (req, res) => {
    const { message, messages, system, model } = req.body;
    const conversation = messages || [{ role: 'user', content: message }];
    
    // Attempt 1: Claude (Anthropic)
    try {
        const claudeResp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': process.env.ANTHROPIC_API_KEY || 'antigravity-proxy-authorized'
            },
            body: JSON.stringify({
                model: model || "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                system: system,
                messages: conversation
            })
        });

        if (claudeResp.ok) {
            const data = await claudeResp.json();
            return res.json(data);
        }
        console.warn(`[AI-Gateway] Claude failed (${claudeResp.status}), pivoting to Gemini...`);
    } catch (err) {
        console.error('[AI-Gateway] Claude connectivity failure, pivoting to Gemini...');
    }

    // Attempt 2: Gemini (Google AI) - Fallback
    try {
        const geminiKey = process.env.GEMINI_API_KEY || 'antigravity-proxy-authorized';
        
        // Convert Claude/Anthropic format to Gemini Format
        const geminiMessages = conversation.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const geminiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: geminiMessages,
                system_instruction: { parts: [{ text: system || "You are SkyBot travel assistant." }] }
            })
        });

        const gData = await geminiResp.json();
        const aiText = gData.candidates?.[0]?.content?.parts?.[0]?.text || "I am currently available via Gemini. How can I assist?";

        // Mock a Claude-style response so frontend remains compatible
        return res.json({
            content: [{ type: 'text', text: aiText }],
            model: "gemini-1.5-flash"
        });

    } catch (gErr) {
        console.error('[AI-Gateway] All AI models failed:', gErr.message);
        res.status(502).json({ success: false, message: 'All AI services are currently unavailable.' });
    }
});


app.post('/api/chatbot/claude', async (req, res) => {
    // Keep this for backward compatibility with the auto-discovery script
    try {
        const { messages, system, model } = req.body;
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': 'antigravity-proxy-authorized'
            },
            body: JSON.stringify({
                model: model || "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                system: system,
                messages: messages
            })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (e) {
        res.status(500).json({ success: false });
    }
});



// ── Fallback: Serve frontend ───────────────────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'skyvoyage-complete.html'));
});

// ── Start Server ───────────────────────────────────────────────
async function start() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`
╔══════════════════════════════════════════════════════════╗
║         SKYVOYAGE API GATEWAY — PORT ${PORT}              ║
║══════════════════════════════════════════════════════════║
║  Frontend:  http://localhost:${PORT}                       ║
║  API Base:  http://localhost:${PORT}/api                   ║
║  Health:    http://localhost:${PORT}/api/health             ║
╠══════════════════════════════════════════════════════════╣
║  Upstream Services:                                      ║
║  • Python Layer: ${PYTHON_LAYER.padEnd(38)}║
║  • Java Backend: ${JAVA_BACKEND.padEnd(38)}║
║  • MongoDB:      ${MONGO_URI.padEnd(38)}║
╚══════════════════════════════════════════════════════════╝
        `);
    });
}

start().catch(console.error);
