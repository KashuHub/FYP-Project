const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  images: [{
    url: { type: String, required: true },
    public_id: { type: String }
  }],
  location: {
    address: { type: String },
    region: {
      type: String,
      enum: ['Hunza', 'Skardu', 'Ghizer', 'Astore', 'Ghanche', 'Diamer', 'Nagar', 'Gilgit'],
      required: true
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  category: {
    type: String,
    enum: ['valley', 'lake', 'meadow', 'glacier', 'fort', 'peak', 'village', 'plateau', 'waterfall'],
    required: true
  },
  bestTimeToVisit: {
    from: { type: String },
    to: { type: String },
    notes: { type: String }
  },
  activities: [String],
  entryFee: {
    type: Number,
    default: 0
  },
  altitude: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Difficult', 'Expert'],
    default: 'Moderate'
  },
  isHiddenGem: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  tips: [String],
  tags: [String]
}, { timestamps: true });

placeSchema.index({ 'location.region': 1 });
placeSchema.index({ status: 1 });
placeSchema.index({ isFeatured: 1 });
placeSchema.index({ isHiddenGem: 1 });

module.exports = mongoose.model('Place', placeSchema);
