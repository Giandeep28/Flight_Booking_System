const mongoose = require('mongoose');

const flightCacheSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

flightCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.FlightCache || mongoose.model('FlightCache', flightCacheSchema);
