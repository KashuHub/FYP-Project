const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['trekking', 'cultural', 'jeep-safari', 'camping', 'photography', 'fishing', 'rock-climbing'],
    required: true
  },
  images: [{
    url: { type: String, required: true },
    public_id: { type: String }
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['hours', 'days'], default: 'hours' }
  },
  maxGroupSize: {
    type: Number,
    required: true,
    min: 1
  },
  location: {
    name: { type: String },
    region: {
      type: String,
      enum: ['Hunza', 'Skardu', 'Ghizer', 'Astore', 'Ghanche', 'Diamer', 'Nagar', 'Gilgit'],
      required: true
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  includes: [String],
  requirements: [String],
  difficultyLevel: {
    type: String,
    enum: ['Easy', 'Moderate', 'Difficult', 'Expert'],
    default: 'Moderate'
  },
  languages: [{ type: String, default: 'English' }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isFeatured: { type: Boolean, default: false },
  availability: [{
    date: Date,
    spotsLeft: Number
  }]
}, { timestamps: true });

experienceSchema.index({ type: 1, status: 1 });
experienceSchema.index({ 'location.region': 1 });

module.exports = mongoose.model('Experience', experienceSchema);
