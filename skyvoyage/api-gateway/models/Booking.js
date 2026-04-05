const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pnr: { type: String, required: true, unique: true, uppercase: true },
    flightOffer: { type: mongoose.Schema.Types.Mixed, required: true },
    passengers: [{ type: mongoose.Schema.Types.Mixed }],
    seatMap: { type: mongoose.Schema.Types.Mixed },
    addons: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, default: 'confirmed' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    ticketPath: { type: String },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ pnr: 1 }, { unique: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
