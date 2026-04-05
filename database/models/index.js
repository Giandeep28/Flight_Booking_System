/**
 * MongoDB Models Index
 * SkyVoyage Flight Booking System
 */

const mongoose = require('mongoose');
const dbConnection = require('../connection');

// Import schemas
const userSchema = require('../schemas/users');
const bookingSchema = require('../schemas/bookings');
const flightSchema = require('../schemas/flights');

/**
 * Initialize all database models
 */
const initializeModels = () => {
  // Create models from schemas
  const User = mongoose.model('User', userSchema);
  const Booking = mongoose.model('Booking', bookingSchema);
  const Flight = mongoose.model('Flight', flightSchema);

  return {
    User,
    Booking,
    Flight
  };
};

/**
 * Initialize database connection and models
 */
const initializeDatabase = async () => {
  try {
    // Connect to database
    await dbConnection.connect();
    
    // Initialize models
    const models = initializeModels();
    
    // Create indexes
    await dbConnection.createIndexes();
    
    console.log('🗄️ Database initialized successfully');
    
    return models;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Export models and utilities
module.exports = {
  initializeDatabase,
  initializeModels,
  dbConnection,
  mongoose
};
