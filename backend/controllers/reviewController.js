const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { targetId, targetModel, rating, comment, images } = req.body;

  const existing = await Review.findOne({ user: req.user.id, targetId });
  if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this' });

  const review = await Review.create({
    user: req.user.id, targetId, targetModel, rating, comment, images
  });

  await review.populate('user', 'name avatar');
  res.status(201).json({ success: true, review });
};

exports.getReviews = async (req, res) => {
  const { targetId } = req.params;
  const reviews = await Review.find({ targetId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, reviews });
};

exports.updateReview = async (req, res) => {
  let review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

  if (review.user.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('user', 'name avatar');
  res.json({ success: true, review });
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await review.deleteOne();
  res.json({ success: true, message: 'Review deleted' });
};
