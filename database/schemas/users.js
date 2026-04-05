/**
 * MongoDB Schema for Users Collection
 * SkyVoyage Flight Booking System
 */

const { Schema } = require('mongoose');

const userSchema = new Schema({
  // Basic Information
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  
  // Profile Information
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  nationality: {
    type: String,
    default: 'Indian'
  },
  passportNumber: {
    type: String,
    sparse: true
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  
  // Loyalty Program
  loyaltyTier: {
    type: String,
    enum: ['ECONOMY', 'SILVER', 'GOLD', 'PLATINUM'],
    default: 'ECONOMY'
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  totalMiles: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Preferences
  preferences: {
    preferredCabinClass: {
      type: String,
      enum: ['Economy', 'Business', 'First'],
      default: 'Economy'
    },
    mealPreference: {
      type: String,
      enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Halal', 'Kosher', 'None']
    },
    seatPreference: {
      type: String,
      enum: ['Window', 'Aisle', 'Middle']
    },
    specialAssistance: {
      wheelchair: { type: Boolean, default: false },
      medicalEquipment: { type: Boolean, default: false },
      companion: { type: Boolean, default: false }
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      promotional: { type: Boolean, default: false }
    }
  },
  
  // Statistics
  stats: {
    totalBookings: { type: Number, default: 0 },
    totalFlights: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    favoriteDestination: { type: String },
    lastBookingDate: { type: Date }
  },
  
  // Security
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  emailVerificationToken: {
    type: String
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.emailVerificationToken;
      delete ret.loginAttempts;
      delete ret.lockUntil;
      return ret;
    }
  }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ userId: 1 });
userSchema.index({ loyaltyTier: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastActivityAt: -1 });

// Virtual fields
userSchema.virtual('bookingCount').get(function() {
  return this.stats.totalBookings;
});

userSchema.virtual('isPremium').get(function() {
  return ['GOLD', 'PLATINUM'].includes(this.loyaltyTier);
});

// Instance methods
userSchema.methods.addLoyaltyPoints = function(points) {
  this.loyaltyPoints += points;
  this.totalMiles += points;
  
  // Upgrade tier if needed
  if (this.loyaltyPoints >= 10000 && this.loyaltyTier === 'ECONOMY') {
    this.loyaltyTier = 'SILVER';
  } else if (this.loyaltyPoints >= 25000 && this.loyaltyTier === 'SILVER') {
    this.loyaltyTier = 'GOLD';
  } else if (this.loyaltyPoints >= 50000 && this.loyaltyTier === 'GOLD') {
    this.loyaltyTier = 'PLATINUM';
  }
  
  return this.save();
};

userSchema.methods.updateStats = function(bookingAmount, destination) {
  this.stats.totalBookings += 1;
  this.stats.totalFlights += 1;
  this.stats.totalSpent += bookingAmount;
  this.stats.lastBookingDate = new Date();
  
  // Update favorite destination (simple frequency-based)
  this.stats.favoriteDestination = destination;
  
  return this.save();
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

userSchema.statics.getLoyaltyStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$loyaltyTier',
        count: { $sum: 1 },
        avgPoints: { $avg: '$loyaltyPoints' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = userSchema;
