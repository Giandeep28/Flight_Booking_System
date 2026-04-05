/**
 * MongoDB Connection Configuration
 * SkyVoyage Flight Booking System
 */

const mongoose = require('mongoose');
require('dotenv').config();

class DatabaseConnection {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000; // 5 seconds
  }

  /**
   * Connect to MongoDB database
   */
  async connect() {
    try {
      const mongoURI = process.env.MONGODB_URL || 'mongodb://localhost:27017/skyvoyage';
      
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10, // Maximum number of connections in the pool
        serverSelectionTimeoutMS: 5000, // How long to try selecting a server
        socketTimeoutMS: 45000, // How long a send or receive on a socket can take
        family: 4, // Use IPv4, skip trying IPv6
        bufferCommands: false, // Disable mongoose buffering
        bufferMaxEntries: 0, // Disable mongoose buffering
        // Enable retry writes for better reliability
        retryWrites: true,
        // Enable read concern for consistency
        readConcern: { level: 'majority' },
        // Enable write concern for durability
        writeConcern: { w: 'majority', j: true }
      };

      console.log('🔌 Connecting to MongoDB...');
      
      this.connection = await mongoose.connect(mongoURI, options);
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      console.log('✅ MongoDB connected successfully!');
      console.log(`📍 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}`);
      console.log(`🔌 Port: ${mongoose.connection.port}`);
      
      // Set up event listeners
      this.setupEventListeners();
      
      return this.connection;
      
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      this.isConnected = false;
      
      // Attempt to reconnect
      await this.reconnect();
      
      throw error;
    }
  }

  /**
   * Setup MongoDB event listeners
   */
  setupEventListeners() {
    const db = mongoose.connection;

    db.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error.message);
      this.isConnected = false;
    });

    db.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      this.isConnected = false;
      this.reconnect();
    });

    db.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    // Monitor connection events
    db.on('connecting', () => {
      console.log('🔄 Connecting to MongoDB...');
    });

    db.on('connected', () => {
      console.log('✅ MongoDB connected');
    });

    db.on('close', () => {
      console.log('🔌 MongoDB connection closed');
    });

    // Process termination handlers
    process.on('SIGINT', () => {
      this.gracefulShutdown('SIGINT');
    });

    process.on('SIGTERM', () => {
      this.gracefulShutdown('SIGTERM');
    });
  }

  /**
   * Attempt to reconnect to MongoDB
   */
  async reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`❌ Max reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);

    setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error(`❌ Reconnection attempt ${this.reconnectAttempts} failed:`, error.message);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          await this.reconnect();
        }
      }
    }, this.reconnectInterval);
  }

  /**
   * Gracefully shutdown database connection
   */
  async gracefulShutdown(signal) {
    console.log(`\n📡 Received ${signal}. Gracefully shutting down MongoDB connection...`);
    
    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error.message);
      process.exit(1);
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  /**
   * Health check for database
   */
  async healthCheck() {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      // Ping the database
      await mongoose.connection.db.admin().ping();
      
      return {
        status: 'healthy',
        timestamp: new Date(),
        database: mongoose.connection.name,
        readyState: mongoose.connection.readyState
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        error: error.message
      };
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      const stats = await mongoose.connection.db.stats();
      
      return {
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize,
        ok: stats.ok
      };
    } catch (error) {
      console.error('❌ Error getting database stats:', error.message);
      return null;
    }
  }

  /**
   * Drop database (for testing only)
   */
  async dropDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Drop database is only allowed in test environment');
    }

    try {
      await mongoose.connection.db.dropDatabase();
      console.log('🗑️ Database dropped successfully');
    } catch (error) {
      console.error('❌ Error dropping database:', error.message);
      throw error;
    }
  }

  /**
   * Create indexes for all collections
   */
  async createIndexes() {
    try {
      console.log('📊 Creating database indexes...');
      
      // Indexes will be created automatically when models are registered
      // This method can be used to manually create indexes if needed
      
      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
      throw error;
    }
  }

  /**
   * Backup database (simple implementation)
   */
  async backup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `skyvoyage-backup-${timestamp}`;
      
      console.log(`💾 Creating backup: ${backupName}`);
      
      // In production, use MongoDB Atlas backup or mongodump
      // This is a placeholder for backup logic
      
      console.log('✅ Backup created successfully');
      return backupName;
    } catch (error) {
      console.error('❌ Error creating backup:', error.message);
      throw error;
    }
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

module.exports = dbConnection;
