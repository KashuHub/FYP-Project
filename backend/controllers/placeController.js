const Place = require('../models/Place');

// @route   GET /api/places
exports.getPlaces = async (req, res) => {
  const { region, category, isHiddenGem, isFeatured, page = 1, limit = 12, search } = req.query;

  const query = { status: 'approved' };

  if (region) query['location.region'] = region;
  if (category) query.category = category;
  if (isHiddenGem === 'true') query.isHiddenGem = true;
  if (isFeatured === 'true') query.isFeatured = true;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Place.countDocuments(query);
  const places = await Place.find(query)
    .populate('createdBy', 'name avatar')
    .sort({ isFeatured: -1, rating: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, count: places.length, total, pages: Math.ceil(total / limit), places });
};

// @route   GET /api/places/:id
exports.getPlace = async (req, res) => {
  const place = await Place.findById(req.params.id).populate('createdBy', 'name avatar');
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
  res.json({ success: true, place });
};

// @route   POST /api/places
exports.createPlace = async (req, res) => {
  req.body.createdBy = req.user.id;
  const place = await Place.create(req.body);
  res.status(201).json({ success: true, place });
};

// @route   PUT /api/places/:id
exports.updatePlace = async (req, res) => {
  let place = await Place.findById(req.params.id);
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });

  if (place.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (req.user.role !== 'admin') req.body.status = 'pending';

  place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, place });
};

// @route   DELETE /api/places/:id
exports.deletePlace = async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });

  if (place.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await place.deleteOne();
  res.json({ success: true, message: 'Place deleted' });
};

// @route   PATCH /api/places/:id/approve
exports.approvePlace = async (req, res) => {
  const { status, isFeatured, isHiddenGem } = req.body;
  const place = await Place.findByIdAndUpdate(
    req.params.id,
    { status, isFeatured, isHiddenGem },
    { new: true }
  );
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
  res.json({ success: true, place });
};

// @route   GET /api/places/map
exports.getMapPlaces = async (req, res) => {
  const places = await Place.find({ status: 'approved' })
    .select('name location category rating images')
    .limit(200);
  res.json({ success: true, places });
};
