/**
 * MongoDB Schema for Flights Collection
 * SkyVoyage Flight Booking System
 */

const { Schema } = require('mongoose');

const flightSchema = new Schema({
  // Flight Identification
  flightId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  flightNumber: {
    type: String,
    required: true,
    index: true
  },
  
  // Airline Information
  airline: {
    code: { type: String, required: true, index: true },
    name: { type: String, required: true },
    logo: { type: String },
    iataCode: { type: String, required: true }
  },
  
  // Route Information
  route: {
    origin: {
      code: { type: String, required: true, index: true },
      name: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      latitude: { type: Number },
      longitude: { type: Number },
      timezone: { type: String }
    },
    destination: {
      code: { type: String, required: true, index: true },
      name: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      latitude: { type: Number },
      longitude: { type: Number },
      timezone: { type: String }
    },
    distance: {
      type: Number, // in kilometers
      required: true
    }
  },
  
  // Schedule Information
  schedule: {
    departureTime: { type: Date, required: true, index: true },
    arrivalTime: { type: Date, required: true, index: true },
    duration: { type: String, required: true }, // "2h 30m"
    durationMinutes: { type: Number, required: true },
    timezone: { type: String, default: 'UTC' },
    daysOfWeek: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Seasonal'],
      default: 'Daily'
    },
    seasonal: {
      isSeasonal: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date }
    }
  },
  
  // Aircraft Information
  aircraft: {
    type: { type: String, required: true }, // "Boeing 737-800"
    registration: { type: String },
    configuration: {
      totalSeats: { type: Number, required: true },
      economySeats: { type: Number, required: true },
      businessSeats: { type: Number, required: true },
      firstSeats: { type: Number, required: true },
      cargoCapacity: { type: Number } // kg
    },
    age: { type: Number }, // aircraft age in years
    amenities: [{
      type: String,
      enum: ['WiFi', 'Power Outlets', 'USB Charging', 'Entertainment System', 'Meal Service', 'Bar Service']
    }]
  },
  
  // Pricing Information
  pricing: {
    baseFare: {
      economy: { type: Number, required: true, min: 0 },
      business: { type: Number, required: true, min: 0 },
      first: { type: Number, required: true, min: 0 }
    },
    taxes: {
      type: Map,
      of: Number,
      default: new Map([
        ['GST', 0],
        ['Service Tax', 0],
        ['Airport Tax', 0],
        ['Fuel Surcharge', 0],
        ['Other Fees', 0]
      ])
    },
    currency: {
      type: String,
      default: 'INR'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    dynamicPricing: {
      enabled: { type: Boolean, default: true },
      demandMultiplier: { type: Number, default: 1.0, min: 0.5, max: 3.0 },
      timeMultiplier: { type: Number, default: 1.0, min: 0.8, max: 2.0 }
    }
  },
  
  // Baggage Information
  baggage: {
    included: {
      economy: { type: Number, default: 20 }, // kg
      business: { type: Number, default: 30 }, // kg
      first: { type: Number, default: 40 } // kg
    },
    carryOn: {
      economy: { type: Number, default: 7 }, // kg
      business: { type: Number, default: 10 }, // kg
      first: { type: Number, default: 15 } // kg
    },
    extraBaggageFee: {
      perKg: { type: Number, default: 500 }, // per kg
      firstPiece: { type: Number, default: 1000 },
      additionalPiece: { type: Number, default: 1500 }
    }
  },
  
  // Seat Map Information
  seatMap: {
    layout: {
      economy: { type: String, required: true }, // "3-3"
      business: { type: String, required: true }, // "2-2"
      first: { type: String, required: true } // "1-1"
    },
    seats: [{
      seatNumber: { type: String, required: true },
      class: { type: String, enum: ['Economy', 'Business', 'First'], required: true },
      type: { type: String, enum: ['Window', 'Aisle', 'Middle'], required: true },
      isAvailable: { type: Boolean, default: true },
      isLocked: { type: Boolean, default: false },
      lockedBy: { type: String }, // booking ID
      lockedUntil: { type: Date },
      additionalCost: { type: Number, default: 0 },
      features: [{
        type: String,
        enum: ['Extra Legroom', 'Preferred Seat', 'Bulkhead', 'Exit Row', 'Quiet Zone']
      }]
    }]
  },
  
  // Flight Status
  status: {
    type: String,
    enum: ['Scheduled', 'Delayed', 'Cancelled', ' diverted', 'Landed', 'Departed', 'Boarding', 'Gate Closed'],
    default: 'Scheduled',
    index: true
  },
  realTimeInfo: {
    actualDepartureTime: { type: Date },
    actualArrivalTime: { type: Date },
    gateNumber: { type: String },
    terminal: { type: String },
    checkInCounter: { type: String },
    boardingTime: { type: Date },
    delayReason: { type: String },
    estimatedDeparture: { type: Date },
    estimatedArrival: { type: Date }
  },
  
  // Stops and Layovers
  stops: [{
    airport: {
      code: { type: String, required: true },
      name: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true }
    },
    arrivalTime: { type: Date, required: true },
    departureTime: { type: Date, required: true },
    duration: { type: String, required: true }, // layover duration
    aircraftChange: { type: Boolean, default: false }
  }],
  
  // Operational Information
  operational: {
    flightCrew: {
      pilot: { type: String },
      coPilot: { type: String },
      cabinCrew: [{ type: String }]
    },
    fuel: {
      required: { type: Number }, // liters
      uploaded: { type: Number },
      consumption: { type: Number } // per hour
    },
    maintenance: {
      lastCheck: { type: Date },
      nextCheck: { type: Date },
      status: { type: String, enum: ['Good', 'Due', 'Overdue'], default: 'Good' }
    },
    weather: {
      conditions: { type: String },
      visibility: { type: Number },
      windSpeed: { type: Number },
      temperature: { type: Number }
    }
  },
  
  // Load Factor and Statistics
  statistics: {
    totalBookings: { type: Number, default: 0 },
    currentLoad: { type: Number, default: 0 }, // percentage
    averageLoadFactor: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    onTimePerformance: { type: Number, default: 100 }, // percentage
    cancellationRate: { type: Number, default: 0 }
  },
  
  // Feed Information (for live data integration)
  feedInfo: {
    source: { type: String, enum: ['Amadeus', 'Sabre', 'Internal', 'Manual'], default: 'Manual' },
    lastSync: { type: Date, default: Date.now },
    syncStatus: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Success' },
    externalId: { type: String }, // ID from external system
    confidence: { type: Number, default: 1.0 } // data confidence score
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
  createdBy: {
    type: String, // User ID or 'System'
    required: true
  },
  lastModifiedBy: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
flightSchema.index({ flightId: 1 }, { unique: true });
flightSchema.index({ flightNumber: 1 });
flightSchema.index({ 'airline.code': 1 });
flightSchema.index({ 'route.origin.code': 1, 'route.destination.code': 1 });
flightSchema.index({ 'schedule.departureTime': 1 });
flightSchema.index({ 'schedule.arrivalTime': 1 });
flightSchema.index({ status: 1 });
flightSchema.index({ 'feedInfo.lastSync': -1 });
flightSchema.index({ createdAt: -1 });

// Compound indexes
flightSchema.index({ 
  'route.origin.code': 1, 
  'route.destination.code': 1, 
  'schedule.departureTime': 1 
});
flightSchema.index({ 
  flightNumber: 1, 
  'schedule.departureTime': 1 
});

// Virtual fields
flightSchema.virtual('isNonStop').get(function() {
  return !this.stops || this.stops.length === 0;
});

flightSchema.virtual('stopCount').get(function() {
  return this.stops ? this.stops.length : 0;
});

flightSchema.virtual('availableSeats').get(function() {
  return this.aircraft.configuration.totalSeats - this.statistics.currentLoad;
});

flightSchema.virtual('loadFactor').get(function() {
  return this.statistics.currentLoad;
});

flightSchema.virtual('isDelayed').get(function() {
  return this.status === 'Delayed';
});

flightSchema.virtual('isCancelled').get(function() {
  return this.status === 'Cancelled';
});

// Pre-save middleware
flightSchema.pre('save', function(next) {
  // Update duration in minutes if duration string is provided
  if (this.isModified('schedule.duration')) {
    const durationStr = this.schedule.duration;
    const hours = parseInt(durationStr.match(/(\d+)h/)?.[1] || 0);
    const minutes = parseInt(durationStr.match(/(\d+)m/)?.[1] || 0);
    this.schedule.durationMinutes = (hours * 60) + minutes;
  }
  
  // Update pricing timestamp
  if (this.isModified('pricing.baseFare')) {
    this.pricing.lastUpdated = new Date();
  }
  
  next();
});

// Instance methods
flightSchema.methods.updateStatus = function(newStatus, reason = '') {
  this.status = newStatus;
  if (reason) {
    this.realTimeInfo.delayReason = reason;
  }
  return this.save();
};

flightSchema.methods.lockSeat = function(seatNumber, bookingId, lockDuration = 15) {
  const seat = this.seatMap.seats.find(s => s.seatNumber === seatNumber);
  if (seat && seat.isAvailable) {
    seat.isLocked = true;
    seat.lockedBy = bookingId;
    seat.lockedUntil = new Date(Date.now() + lockDuration * 60 * 1000);
    return this.save();
  }
  return null;
};

flightSchema.methods.releaseSeat = function(seatNumber) {
  const seat = this.seatMap.seats.find(s => s.seatNumber === seatNumber);
  if (seat) {
    seat.isLocked = false;
    seat.lockedBy = null;
    seat.lockedUntil = null;
    return this.save();
  }
  return null;
};

flightSchema.methods.bookSeat = function(seatNumber) {
  const seat = this.seatMap.seats.find(s => s.seatNumber === seatNumber);
  if (seat && (seat.isAvailable || seat.isLocked)) {
    seat.isAvailable = false;
    seat.isLocked = false;
    seat.lockedBy = null;
    seat.lockedUntil = null;
    
    // Update load factor
    this.statistics.currentLoad = Math.round(
      ((this.aircraft.configuration.totalSeats - this.getAvailableSeats().length) / 
       this.aircraft.configuration.totalSeats) * 100
    );
    
    return this.save();
  }
  return null;
};

flightSchema.methods.getAvailableSeats = function(cabinClass = null) {
  return this.seatMap.seats.filter(seat => 
    seat.isAvailable && 
    (!cabinClass || seat.class === cabinClass)
  );
};

flightSchema.methods.calculatePrice = function(cabinClass, passengerCount = 1, additionalServices = {}) {
  let basePrice = this.pricing.baseFare[cabinClass.toLowerCase()];
  
  // Apply dynamic pricing
  if (this.pricing.dynamicPricing.enabled) {
    basePrice *= this.pricing.dynamicPricing.demandMultiplier;
    basePrice *= this.pricing.dynamicPricing.timeMultiplier;
  }
  
  // Add taxes
  const totalTaxes = Array.from(this.pricing.taxes.values()).reduce((sum, tax) => sum + tax, 0);
  
  // Add additional services
  let additionalCost = 0;
  if (additionalServices.seatSelection) additionalCost += additionalServices.seatSelection;
  if (additionalServices.extraBaggage) additionalCost += additionalServices.extraBaggage;
  if (additionalServices.mealPreference) additionalCost += additionalServices.mealPreference;
  
  const totalPerPassenger = basePrice + totalTaxes + additionalCost;
  const totalPrice = totalPerPassenger * passengerCount;
  
  return {
    basePrice,
    taxes: totalTaxes,
    additionalCost,
    totalPerPassenger,
    totalPrice,
    currency: this.pricing.currency
  };
};

// Static methods
flightSchema.statics.findByRoute = function(originCode, destinationCode, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    'route.origin.code': originCode.toUpperCase(),
    'route.destination.code': destinationCode.toUpperCase(),
    'schedule.departureTime': {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $in: ['Scheduled', 'Delayed'] }
  }).sort({ 'schedule.departureTime': 1 });
};

flightSchema.statics.searchFlights = function(filters) {
  const query = {};
  
  if (filters.origin) query['route.origin.code'] = filters.origin.toUpperCase();
  if (filters.destination) query['route.destination.code'] = filters.destination.toUpperCase();
  if (filters.date) {
    const startOfDay = new Date(filters.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filters.date);
    endOfDay.setHours(23, 59, 59, 999);
    query['schedule.departureTime'] = { $gte: startOfDay, $lte: endOfDay };
  }
  if (filters.airline) query['airline.code'] = filters.airline;
  if (filters.cabinClass) query[`pricing.baseFare.${filters.cabinClass.toLowerCase()}`] = { $exists: true };
  if (filters.maxStops !== undefined) {
    if (filters.maxStops === 0) {
      query.stops = { $size: 0 };
    } else {
      query.stops = { $lte: filters.maxStops };
    }
  }
  
  query.status = { $in: ['Scheduled', 'Delayed'] };
  
  return this.find(query).sort({ 'schedule.departureTime': 1 });
};

flightSchema.statics.getFlightStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$airline.code',
        totalFlights: { $sum: 1 },
        averageLoadFactor: { $avg: '$statistics.currentLoad' },
        totalRevenue: { $sum: '$statistics.revenue' },
        onTimePerformance: { $avg: '$statistics.onTimePerformance' }
      }
    },
    { $sort: { totalFlights: -1 } }
  ]);
};

module.exports = flightSchema;
