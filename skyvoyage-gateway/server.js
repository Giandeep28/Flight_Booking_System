/**
 * SkyVoyage API Gateway
 * Handles authentication, routing, and rate limiting
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// In-memory user database (replace with MongoDB in production)
const users = new Map();
const blacklistedTokens = new Set();

// Backend service URLs
const FLIGHT_SERVICE_URL = process.env.FLIGHT_SERVICE_URL || 'http://localhost:8000';
const JAVA_BOOKING_URL = process.env.JAVA_BOOKING_URL || 'http://localhost:8080';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'skyvoyage_super_secret_key_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
  phone: Joi.string().pattern(new RegExp('^[+]?[0-9]{10,15}$')).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Utility functions
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ error: 'Token has been invalidated.' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Proxy requests to backend services
const proxyRequest = async (req, res, serviceUrl, path) => {
  try {
    const url = `${serviceUrl}${path}`;
    const method = req.method.toLowerCase();
    
    const config = {
      method,
      url,
      headers: {
        ...req.headers,
        host: new URL(serviceUrl).host
      },
      params: req.query,
      data: req.body
    };
    
    // Remove problematic headers
    delete config.headers.host;
    delete config.headers['content-length'];
    
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Proxy error to ${serviceUrl}:`, error.message);
    
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Service unavailable' });
    }
  }
};

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details[0].message 
      });
    }
    
    const { name, email, password, phone } = value;
    
    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      phone,
      createdAt: new Date(),
      isActive: true,
      loyaltyPoints: 0,
      tier: 'ECONOMY'
    };
    
    users.set(email, user);
    
    // Generate token
    const token = generateToken(user);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details[0].message 
      });
    }
    
    const { email, password } = value;
    
    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Update last login
    user.lastLogin = new Date();
    users.set(email, user);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', verifyToken, (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    blacklistedTokens.add(token);
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/profile', verifyToken, (req, res) => {
  try {
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { name, phone, preferences } = req.body;
    
    // Update user data
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    user.updatedAt = new Date();
    users.set(req.user.email, user);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }
    
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Validate new password
    const { error } = Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).validate(newPassword);
    if (error) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character' 
      });
    }
    
    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    user.updatedAt = new Date();
    
    users.set(req.user.email, user);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Flight Service Proxy Routes
app.use('/api/flights', (req, res) => {
  proxyRequest(req, res, FLIGHT_SERVICE_URL, req.originalUrl);
});

app.use('/api/airports', (req, res) => {
  proxyRequest(req, res, FLIGHT_SERVICE_URL, req.originalUrl);
});

app.use('/api/airlines', (req, res) => {
  proxyRequest(req, res, FLIGHT_SERVICE_URL, req.originalUrl);
});

app.use('/api/bookings', (req, res) => {
  proxyRequest(req, res, FLIGHT_SERVICE_URL, req.originalUrl);
});

// AI Chatbot Intelligence - Multi-Model Resilience (Claude + Gemini)
app.post('/api/chatbot/message', async (req, res) => {
    const { message, messages, system, model } = req.body;
    const conversation = messages || [{ role: 'user', content: message }];

    try {
        // Step 1: Try Claude
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: model || "claude-3-5-sonnet-20240620",
            max_tokens: 1024,
            system: system || "You are SkyBot, the official travel assistant for SkyVoyage.",
            messages: conversation
        }, {
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': process.env.ANTHROPIC_API_KEY || 'antigravity-proxy-authorized'
            }
        });
        return res.json(response.data);
    } catch (e) {
        console.warn('[AI-Gateway] Claude unavailable, falling back to Gemini...');
    }

    try {
        // Step 2: Try Gemini
        const geminiKey = process.env.GEMINI_API_KEY || 'antigravity-proxy-authorized';
        const geminiMessages = conversation.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const gResp = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
            contents: geminiMessages,
            system_instruction: { parts: [{ text: system || "You are SkyBot." }] }
        });

        const aiText = gResp.data.candidates?.[0]?.content?.parts?.[0]?.text || "I am your SkyBot.";
        
        // Return Claude-compatible format
        res.json({
            content: [{ type: 'text', text: aiText }],
            model: "gemini-1.5-flash"
        });
    } catch (err) {
        console.error('[AI-Gateway] All AI systems failed:', err.message);
        res.status(502).json({ success: false, message: 'AI services temporarily offline.' });
    }
});


app.post('/api/chatbot/claude', async (req, res) => {
    // Legacy support for auto-discovery
    try {
        const { messages, system, model } = req.body;
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: model || "claude-3-5-sonnet-20240620",
            max_tokens: 1024,
            system: system,
            messages: messages
        }, {
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': process.env.ANTHROPIC_API_KEY || 'antigravity-proxy-authorized'
            }
        });
        res.json(response.data);
    } catch (e) { res.status(500).json({ success: false }); }
});

app.use('/api/chatbot', (req, res) => {
  proxyRequest(req, res, FLIGHT_SERVICE_URL, req.originalUrl);
});



// Java Booking Engine Proxy
app.post('/api/booking-engine/lock-seat', verifyToken, async (req, res) => {
  try {
    const response = await axios.post(`${JAVA_BOOKING_URL}/api/seats/lock`, {
      ...req.body,
      userId: req.user.id
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Seat lock error:', error);
    res.status(500).json({ error: 'Failed to lock seat' });
  }
});

app.post('/api/booking_engine/process-booking', verifyToken, async (req, res) => {
  try {
    const response = await axios.post(`${JAVA_BOOKING_URL}/api/bookings/process`, {
      ...req.body,
      userId: req.user.id
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Booking processing error:', error);
    res.status(500).json({ error: 'Failed to process booking' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// API Statistics
app.get('/api/stats', verifyToken, (req, res) => {
  const stats = {
    totalUsers: users.size,
    activeUsers: Array.from(users.values()).filter(u => u.isActive).length,
    blacklistedTokens: blacklistedTokens.size,
    services: {
      flightService: FLIGHT_SERVICE_URL,
      javaBooking: JAVA_BOOKING_URL
    }
  };
  
  res.json(stats);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 SkyVoyage API Gateway is running!
📍 Port: ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Flight Service: ${FLIGHT_SERVICE_URL}
☕ Java Booking: ${JAVA_BOOKING_URL}
📝 Logs: Enabled
  `);
});

// Create default admin user for testing
const createDefaultUser = async () => {
  const defaultEmail = 'admin@skyvoyage.com';
  if (!users.has(defaultEmail)) {
    const hashedPassword = await hashPassword('Admin@123456');
    const adminUser = {
      id: '1',
      name: 'SkyVoyage Admin',
      email: defaultEmail,
      password: hashedPassword,
      phone: '+1234567890',
      createdAt: new Date(),
      isActive: true,
      loyaltyPoints: 10000,
      tier: 'PLATINUM'
    };
    
    users.set(defaultEmail, adminUser);
    console.log('Default admin user created: admin@skyvoyage.com / Admin@123456');
  }
};

// Initialize
createDefaultUser();
