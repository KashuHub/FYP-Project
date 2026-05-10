const Experience = require('../models/Experience');

exports.getExperiences = async (req, res) => {
  const { type, region, maxPrice, page = 1, limit = 12, search } = req.query;
  const query = { status: 'approved' };

  if (type) query.type = type;
  if (region) query['location.region'] = region;
  if (maxPrice) query.price = { $lte: Number(maxPrice) };
  if (search) query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Experience.countDocuments(query);
  const experiences = await Experience.find(query)
    .populate('host', 'name avatar')
    .sort({ isFeatured: -1, rating: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, count: experiences.length, total, pages: Math.ceil(total / limit), experiences });
};

exports.getExperience = async (req, res) => {
  const experience = await Experience.findById(req.params.id).populate('host', 'name avatar bio');
  if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });
  res.json({ success: true, experience });
};

exports.createExperience = async (req, res) => {
  req.body.host = req.user.id;
  const experience = await Experience.create(req.body);
  res.status(201).json({ success: true, experience });
};

exports.updateExperience = async (req, res) => {
  let experience = await Experience.findById(req.params.id);
  if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });

  if (experience.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (req.user.role !== 'admin') req.body.status = 'pending';

  experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, experience });
};

exports.deleteExperience = async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });

  if (experience.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await experience.deleteOne();
  res.json({ success: true, message: 'Experience deleted' });
};

exports.approveExperience = async (req, res) => {
  const { status, isFeatured } = req.body;
  const experience = await Experience.findByIdAndUpdate(req.params.id, { status, isFeatured }, { new: true });
  if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });
  res.json({ success: true, experience });
};

exports.getMyExperiences = async (req, res) => {
  const experiences = await Experience.find({ host: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, experiences });
};
