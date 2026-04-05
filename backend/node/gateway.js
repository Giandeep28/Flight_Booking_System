const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

/**
 * SkyVoyage API Gateway
 * Centralized Entry Point for All Microservices
 */
const app = express();
const PORT = 5001;
const SECRET_KEY = "SKYVOYAGE_SECRET_TOKEN_2026";
const PYTHON_SERVICE_URL = "http://localhost:8000/api";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock User Database (Replace with MongoDB/Mongoose in production)
const USERS = [
    { id: 'usr_1', email: 'demo@skyvoyage.com', password: 'password', name: 'John Doe' }
];

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = USERS.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, tier: 'SkyPriority', points: 12500 } });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// --- GATEWAY PROXY ROUTES ---
// Flights Search Proxy (Proxies to Python FastAPI)
app.get('/api/flights', async (req, res) => {
    try {
        console.log(`Gateway: Routing search request to ${PYTHON_SERVICE_URL}/flights`);
        const response = await axios.get(`${PYTHON_SERVICE_URL}/flights`, { 
            params: req.query 
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Python Backend Unreachable" });
    }
});

// Chatbot Proxy (Proxies to Python FastAPI)
app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/chat`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "AI Chatbot Service Offline" });
    }
});

// Booking Proxy (Requires Auth)
app.post('/api/bookings', authenticateToken, async (req, res) => {
    try {
        console.log(`Gateway: User ${req.user.email} is booking a seat...`);
        // Forwarding to Python for Java execution bridge
        const response = await axios.post(`${PYTHON_SERVICE_URL}/booking/lock`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Booking Engine Connection Error" });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: "Gateway Online", services: { python: "active", java: "active" } });
});

app.listen(PORT, () => {
    console.log(`SkyVoyage API Gateway running on http://localhost:${PORT}`);
});
