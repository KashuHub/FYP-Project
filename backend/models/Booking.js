const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: function () { return !this.experience; }
  },
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: function () { return !this.property; }
  },
  bookingType: {
    type: String,
    enum: ['property', 'experience'],
    required: true
  },
  checkIn: {
    type: Date,
    required: function () { return this.bookingType === 'property'; }
  },
  checkOut: {
    type: Date,
    required: function () { return this.bookingType === 'property'; }
  },
  experienceDate: {
    type: Date,
    required: function () { return this.bookingType === 'experience'; }
  },
  guests: {
    adults: { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0 },
    total: { type: Number, default: 1 }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  cancellationReason: { type: String },
  confirmedAt: { type: Date },
  cancelledAt: { type: Date }
}, { timestamps: true });

bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ property: 1 });
bookingSchema.index({ experience: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
