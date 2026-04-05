/**
 * MongoDB Schema for Bookings Collection
 * SkyVoyage Flight Booking System
 */

const { Schema } = require('mongoose');

const bookingSchema = new Schema({
  // Booking Identification
  pnr: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User',
    index: true
  },
  
  // Flight Information
  flightId: {
    type: String,
    required: true,
    index: true
  },
  flightNumber: {
    type: String,
    required: true
  },
  airlineCode: {
    type: String,
    required: true
  },
  airlineName: {
    type: String,
    required: true
  },
  
  // Route Information
  departureAirport: {
    code: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  arrivalAirport: {
    code: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  
  // Schedule
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Booking Details
  passengers: [{
    title: { type: String, enum: ['Mr', 'Mrs', 'Ms', 'Dr'] },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    nationality: { type: String, required: true },
    passportNumber: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, enum: ['Adult', 'Child', 'Infant'], required: true }
  }],
  
  // Seat Information
  seatAssignments: [{
    passengerId: { type: String },
    seatNumber: { type: String, required: true },
    cabinClass: { type: String, enum: ['Economy', 'Business', 'First'], required: true },
    seatType: { type: String, enum: ['Window', 'Aisle', 'Middle'] },
    additionalCost: { type: Number, default: 0 }
  }],
  
  // Pricing
  baseFare: {
    type: Number,
    required: true,
    min: 0
  },
  taxesAndFees: {
    type: Number,
    required: true,
    min: 0
  },
  additionalServices: {
    seatSelection: { type: Number, default: 0 },
    extraBaggage: { type: Number, default: 0 },
    mealPreference: { type: Number, default: 0 },
    travelInsurance: { type: Number, default: 0 },
    priorityCheckin: { type: Number, default: 0 }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'],
    required: true
  },
  paymentId: {
    type: String
  },
  transactionId: {
    type: String
  },
  paidAt: {
    type: Date
  },
  
  // Booking Status
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'No-Show'],
    default: 'Pending'
  },
  confirmationCode: {
    type: String,
    required: true,
    unique: true
  },
  
  // Special Requests
  specialRequests: {
    mealPreference: { type: String },
    wheelchairAssistance: { type: Boolean, default: false },
    medicalEquipment: { type: Boolean, default: false },
    unaccompaniedMinor: { type: Boolean, default: false },
    petTravel: { type: Boolean, default: false },
    notes: { type: String }
  },
  
  // Baggage
  baggageInfo: {
    checkedBaggage: { type: Number, default: 20 }, // kg
    carryOnBaggage: { type: Number, default: 7 }, // kg
    extraBaggage: { type: Number, default: 0 }, // kg
    extraBaggageCost: { type: Number, default: 0 }
  },
  
  // Check-in Information
  checkInStatus: {
    type: String,
    enum: ['Not Available', 'Open', 'Completed'],
    default: 'Not Available'
  },
  checkInTime: {
    type: Date
  },
  boardingPassIssued: {
    type: Boolean,
    default: false
  },
  
  // E-ticket
  eticketNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  eticketPath: {
    type: String
  },
  eticketIssued: {
    type: Boolean,
    default: false
  },
  eticketIssuedAt: {
    type: Date
  },
  
  // Modifications
  modifications: [{
    type: { type: String, enum: ['Cancellation', 'Reschedule', 'Seat Change', 'Name Change'] },
    timestamp: { type: Date, default: Date.now },
    reason: { type: String },
    processedBy: { type: String }, // User ID or System
    details: { type: Schema.Types.Mixed }
  }],
  
  // Loyalty Points
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  loyaltyPointsRedeemed: {
    type: Number,
    default: 0
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
  bookedBy: {
    type: String, // User ID or 'System'
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
bookingSchema.index({ pnr: 1 }, { unique: true });
bookingSchema.index({ bookingId: 1 }, { unique: true });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ flightId: 1 });
bookingSchema.index({ departureTime: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'departureAirport.code': 1, 'arrivalAirport.code': 1 });
bookingSchema.index({ confirmationCode: 1 }, { unique: true });

// Virtual fields
bookingSchema.virtual('isUpcoming').get(function() {
  return this.departureTime > new Date() && this.status === 'Confirmed';
});

bookingSchema.virtual('isPast').get(function() {
  return this.departureTime <= new Date();
});

bookingSchema.virtual('canCheckIn').get(function() {
  const now = new Date();
  const checkInOpen = new Date(this.departureTime.getTime() - 48 * 60 * 60 * 1000); // 48 hours before
  const checkInClose = new Date(this.departureTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
  return now >= checkInOpen && now <= checkInClose && this.status === 'Confirmed';
});

bookingSchema.virtual('passengerCount').get(function() {
  return this.passengers.length;
});

bookingSchema.virtual('totalPassengers').get(function() {
  return this.passengers.length;
});

// Pre-save middleware
bookingSchema.pre('save', function(next) {
  // Calculate total amount if not set
  if (this.isModified('baseFare') || this.isModified('taxesAndFees') || this.isModified('additionalServices')) {
    this.totalAmount = this.baseFare + this.taxesAndFees + 
      Object.values(this.additionalServices).reduce((sum, cost) => sum + cost, 0);
  }
  
  // Generate confirmation code if not set
  if (!this.confirmationCode) {
    this.confirmationCode = this.generateConfirmationCode();
  }
  
  // Generate e-ticket number if confirmed and not set
  if (this.status === 'Confirmed' && !this.eticketNumber) {
    this.eticketNumber = this.generateEticketNumber();
  }
  
  next();
});

// Instance methods
bookingSchema.methods.generateConfirmationCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

bookingSchema.methods.generateEticketNumber = function() {
  const prefix = this.airlineCode;
  const digits = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}${digits}`;
};

bookingSchema.methods.cancel = function(reason) {
  this.status = 'Cancelled';
  this.modifications.push({
    type: 'Cancellation',
    timestamp: new Date(),
    reason: reason || 'Customer request',
    processedBy: 'System'
  });
  return this.save();
};

bookingSchema.methods.updateCheckInStatus = function(status) {
  this.checkInStatus = status;
  if (status === 'Completed') {
    this.checkInTime = new Date();
    this.boardingPassIssued = true;
  }
  return this.save();
};

// Static methods
bookingSchema.statics.findByPNR = function(pnr) {
  return this.findOne({ pnr: pnr.toUpperCase() });
};

bookingSchema.statics.findByUserId = function(userId, options = {}) {
  const query = { userId: userId };
  if (options.status) {
    query.status = options.status;
  }
  if (options.upcoming) {
    query.departureTime = { $gt: new Date() };
  }
  if (options.past) {
    query.departureTime = { $lte: new Date() };
  }
  return this.find(query).sort({ departureTime: -1 });
};

bookingSchema.statics.getBookingStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);
};

bookingSchema.statics.getFlightLoad = function(flightId) {
  return this.aggregate([
    { $match: { flightId: flightId, status: 'Confirmed' } },
    {
      $group: {
        _id: '$flightId',
        totalBookings: { $sum: '$passengerCount' },
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);
};

module.exports = bookingSchema;
