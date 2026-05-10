const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  propertyType: {
    type: String,
    enum: ['hotel', 'guesthouse', 'cabin', 'resort', 'hostel', 'apartment'],
    required: [true, 'Property type is required']
  },
  images: [{
    url: { type: String, required: true },
    public_id: { type: String }
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    region: {
      type: String,
      enum: ['Hunza', 'Skardu', 'Ghizer', 'Astore', 'Ghanche', 'Diamer', 'Nagar', 'Gilgit'],
      required: true
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Heating', 'Hot Water', 'Meals', 'Guide', 'Parking', 'Generator', 'Kitchen', 'Laundry', 'TV', 'Mountain View', 'River View']
  }],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1
  },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availability: [{
    date: Date,
    isBooked: { type: Boolean, default: false }
  }],
  rules: [String],
  tags: [String]
}, { timestamps: true });

// Index for location-based queries
propertySchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
propertySchema.index({ 'location.region': 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ rating: -1 });

module.exports = mongoose.model('Property', propertySchema);
