const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    loyaltyPoints: { type: Number, default: 0 },
    tier: { type: String, default: 'ECONOMY' },
    preferences: { type: mongoose.Schema.Types.Mixed, default: {} },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
