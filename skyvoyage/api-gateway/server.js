/**
 * SkyVoyage unified API gateway — MongoDB, JWT, proxies to Java (flight search/booking) and Python (airports, chat).
 */
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Joi = require('joi');
const compression = require('compression');
const cluster = require('cluster');
const os = require('os');
require('dotenv').config();

const User = require('./models/User');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const FlightCache = require('./models/FlightCache');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET = process.env.JWT_SECRET || 'skyvoyage_secret_change_me';
const JAVA_SERVICE_URL = process.env.JAVA_SERVICE_URL || 'http://localhost:8085';
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

const CACHE_TTL_MS = parseInt(process.env.FLIGHT_CACHE_TTL_MS || '900000', 10);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression()); // Add response compression
app.use(express.json({ limit: '10mb' }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Enhanced rate limiting with user-based limits
const createRateLimiter = (windowMs, max, skipSuccessfulRequests) => rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests,
  keyGenerator: (req) => {
    // Use user ID for authenticated requests, IP for anonymous
    return req.user?.id || req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: `Rate limit exceeded. Try again in ${Math.ceil(windowMs / 1000)} seconds.`,
      retryAfter: Math.ceil(windowMs / 1000)
    });
  }
});

// Different limits for different endpoints
app.use('/api/auth/', createRateLimiter(15 * 60 * 1000, 5, false)); // Auth: 5 per 15 min
app.use('/api/flights/search', createRateLimiter(1 * 60 * 1000, 30, true)); // Search: 30 per minute
app.use('/api/bookings', createRateLimiter(15 * 60 * 1000, 20, false)); // Bookings: 20 per 15 min
app.use('/api/', createRateLimiter(15 * 60 * 1000, 200, true)); // General: 200 per 15 min

const blacklist = new Set();

const verifyToken = (req, res, next) => {
  const raw = req.header('Authorization');
  const token = raw?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  if (blacklist.has(token)) return res.status(401).json({ error: 'Token has been invalidated.' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

function cacheKey(body) {
  const raw = JSON.stringify({
    origin: body.origin || body.from,
    destination: body.destination || body.to,
    departure_date: body.departure_date || body.date,
    return_date: body.return_date || body.returnDate,
    passengers: body.passengers || 1,
    cabin_class: body.cabin_class || body.cabinClass,
  });
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// --- Mongo ---
async function connectDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skyvoyage';
  await mongoose.connect(uri);
  console.log('MongoDB connected:', uri.replace(/\/\/.*@/, '//***@'));
}

// --- Auth ---
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().allow('').optional(),
});

const createBookingSchema = Joi.object({
  flightOffer: Joi.object().required(),
  passengers: Joi.array().min(1).required(),
  totalAmount: Joi.number().optional(),
  currency: Joi.string().max(4).optional(),
  seatMap: Joi.object().unknown(true).optional(),
  addons: Joi.object().unknown(true).optional(),
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password, phone } = value;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || '',
    });

    const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.status(201).json({
      message: 'Registered',
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(401).json({ error: 'Account deactivated' });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { name, phone } = req.body;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/logout', verifyToken, (req, res) => {
  const raw = req.header('Authorization');
  const token = raw?.replace(/^Bearer\s+/i, '');
  if (token) blacklist.add(token);
  res.json({ message: 'Logout successful' });
});

// --- Flight search (Java) + cache ---
app.post('/api/flights/search', async (req, res) => {
  try {
    const key = cacheKey(req.body);
    const cached = await FlightCache.findOne({ key, expiresAt: { $gt: new Date() } });
    if (cached) {
      return res.json({ ...cached.payload, cached: true });
    }

    const { data } = await axios.post(`${JAVA_SERVICE_URL}/v1/flights/search`, req.body, {
      timeout: 120000,
      validateStatus: () => true,
    });

    if (data.error && !data.flights) {
      return res.status(data.status || 502).json(data);
    }

    await FlightCache.findOneAndUpdate(
      { key },
      { key, payload: data, expiresAt: new Date(Date.now() + CACHE_TTL_MS) },
      { upsert: true }
    );

    res.json({ ...data, cached: false });
  } catch (err) {
    console.error('Flight search error:', err.message);
    const status = err.response?.status || 503;
    res.status(status).json({
      error: 'Flight search unavailable',
      detail: err.response?.data || err.message,
      flights: [],
    });
  }
});

// --- Airports (Python) ---
app.get('/api/airports/meta', async (req, res) => {
  try {
    const { data } = await axios.get(`${PYTHON_SERVICE_URL}/airports/meta`, { timeout: 8000 });
    res.json(data);
  } catch (err) {
    res.status(503).json({ error: 'Airport meta unavailable', detail: err.message });
  }
});

app.get('/api/airports', async (req, res) => {
    try {
        const q = req.query.q || '';
        const region = req.query.region || '';
        const { data } = await axios.get(`${PYTHON_SERVICE_URL}/airports`, {
            params: { q, region },
            timeout: 30000,
        });
        res.json(data);
    } catch (err) {
        console.error('Airports proxy error:', err.message);
        res.status(503).json({ error: 'Airport service unavailable', airports: [] });
    }
});

// --- Price Verification (Java) ---
app.post('/api/flights/price', async (req, res) => {
    try {
        const { data } = await axios.post(`${JAVA_SERVICE_URL}/v1/flights/price`, req.body, { timeout: 60000 });
        res.json(data);
    } catch (err) {
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Pricing service error' });
    }
});

app.get('/api/airports/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const region = req.query.region || '';
    const { data } = await axios.get(`${PYTHON_SERVICE_URL}/airports`, {
      params: { q, region },
      timeout: 30000,
    });
    res.json(data);
  } catch (err) {
    res.status(503).json({ error: 'Airport service unavailable', airports: [] });
  }
});

// --- Chat (Python) ---
app.post('/api/chat', async (req, res) => {
  try {
    const { data } = await axios.post(`${PYTHON_SERVICE_URL}/chatbot`, req.body, { timeout: 60000 });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 503;
    res.status(status).json({
      reply: err.response?.data?.detail || 'Chat service unavailable.',
      error: true,
    });
  }
});

app.post('/api/chatbot/message', async (req, res) => {
  try {
    const text = req.body.message || req.body.text || '';
    const { data } = await axios.post(`${PYTHON_SERVICE_URL}/chatbot`, { text }, { timeout: 60000 });
    res.json(data);
  } catch (err) {
    res.status(503).json({ reply: 'Chat service unavailable.', error: true });
  }
});

// --- Bookings ---
app.post('/api/bookings', verifyToken, async (req, res) => {
  try {
    const { error, value } = createBookingSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { data } = await axios.post(
      `${JAVA_SERVICE_URL}/v1/bookings`,
      {
        ...value,
        userId: req.user.id,
      },
      { timeout: 120000, validateStatus: () => true }
    );

    if (data.error || !data.pnr) {
      return res.status(data.status || 500).json(data);
    }

    const payment = await Payment.create({
      userId: req.user.id,
      amount: req.body.totalAmount || data.totalAmount || 0,
      currency: req.body.currency || data.currency || 'INR',
      status: 'completed',
      method: 'simulated_card',
      transactionRef: `SIM-${Date.now()}`,
    });

    const booking = await Booking.create({
      userId: req.user.id,
      pnr: data.pnr,
      flightOffer: req.body.flightOffer || req.body.flight || {},
      passengers: req.body.passengers || [],
      seatMap: req.body.seatMap,
      addons: req.body.addons,
      status: 'confirmed',
      paymentId: payment._id,
      ticketPath: data.ticketPath,
    });

    payment.bookingId = booking._id;
    await payment.save();

    res.json({
      pnr: booking.pnr,
      booking,
      payment,
      ...data,
    });
  } catch (err) {
    console.error('Booking error:', err.message);
    res.status(500).json({ error: err.message || 'Booking failed' });
  }
});

app.get('/api/bookings/user', verifyToken, async (req, res) => {
  try {
    const list = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json({ bookings: list });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/bookings/:pnr', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      pnr: req.params.pnr.toUpperCase(),
      userId: req.user.id,
    }).lean();
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/bookings/:pnr/eticket', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      pnr: req.params.pnr.toUpperCase(),
      userId: req.user.id,
    }).lean();
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    const text = JSON.stringify(
      { pnr: booking.pnr, flightOffer: booking.flightOffer, passengers: booking.passengers },
      null,
      2
    );
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="eticket-${booking.pnr}.json"`);
    res.send(Buffer.from(text, 'utf8'));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/users/bookings', verifyToken, async (req, res) => {
  try {
    const list = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    const totalSpent = list.reduce((s, b) => {
      const p = b.flightOffer?.price;
      return s + (typeof p === 'number' ? p : 0);
    }, 0);
    res.json({
      bookings: list,
      totalBookings: list.length,
      totalFlights: list.length,
      totalSpent,
      favoriteDestination: '',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/users/loyalty', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    res.json({ points: user?.loyaltyPoints ?? 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Payments (simulated) ---
app.post('/api/payments/initiate', verifyToken, async (req, res) => {
  try {
    const payment = await Payment.create({
      userId: req.user.id,
      amount: req.body.amount,
      currency: req.body.currency || 'INR',
      status: 'pending',
      method: req.body.method || 'simulated_card',
    });
    res.json({ paymentId: payment._id, status: 'pending' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/payments/:paymentId/verify', verifyToken, async (req, res) => {
  const p = await Payment.findOne({ _id: req.params.paymentId, userId: req.user.id });
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json({ status: p.status, payment: p });
});

// --- OpenSky flight status ---
app.get('/api/flight-status', async (req, res) => {
  try {
    const { callsign, icao24 } = req.query;
    if (!callsign && !icao24) {
      return res.status(400).json({ error: 'Provide callsign or icao24' });
    }

    if (callsign) {
      const { data } = await axios.get('https://opensky-network.org/api/flights/all', {
        params: { callsign: String(callsign).trim().toUpperCase() },
        timeout: 15000,
      });
      return res.json({ source: 'opensky', ...data });
    }

    const { data } = await axios.get('https://opensky-network.org/api/states/all', {
      params: { icao24: String(icao24).toLowerCase() },
      timeout: 15000,
    });
    return res.json({ source: 'opensky', ...data });
  } catch (err) {
    console.error('OpenSky error:', err.message);
    res.status(503).json({
      error: 'Live flight data unavailable',
      detail: err.response?.data || err.message,
    });
  }
});

app.get('/api/integrations/status', async (req, res) => {
  const out = {
    mongodb: mongoose.connection.readyState === 1,
    gateway: true,
    java: false,
    python: false,
    java_detail: null,
    python_detail: null,
  };
  try {
    const j = await axios.get(`${JAVA_SERVICE_URL}/health`, { timeout: 8000, validateStatus: () => true });
    out.java = j.status === 200;
    out.java_detail = j.data;
  } catch (e) {
    out.java_error = e.message;
  }
  try {
    const p = await axios.get(`${PYTHON_SERVICE_URL}/`, { timeout: 8000, validateStatus: () => true });
    out.python = p.status === 200;
    out.python_detail = p.data;
  } catch (e) {
    out.python_error = e.message;
  }
  res.json(out);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'skyvoyage-gateway', ts: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SkyVoyage gateway http://localhost:${PORT}`);
      console.log(`Java: ${JAVA_SERVICE_URL} | Python: ${PYTHON_SERVICE_URL}`);
    });
  })
  .catch((e) => {
    console.error('MongoDB connection failed:', e.message);
    process.exit(1);
  });
