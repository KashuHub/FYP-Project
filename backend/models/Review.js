const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel'
  },
  targetModel: {
    type: String,
    enum: ['Property', 'Experience', 'Place'],
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{ type: String }],
  isVerifiedStay: { type: Boolean, default: false },
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Prevent duplicate reviews
reviewSchema.index({ user: 1, targetId: 1 }, { unique: true });

// Update average rating on parent after save
reviewSchema.post('save', async function () {
  const Review = this.constructor;
  const Model = mongoose.model(this.targetModel);
  const stats = await Review.aggregate([
    { $match: { targetId: this.targetId } },
    { $group: { _id: '$targetId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (stats.length > 0) {
    await Model.findByIdAndUpdate(this.targetId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
