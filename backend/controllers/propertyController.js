const Property = require('../models/Property');

// @route   GET /api/properties
exports.getProperties = async (req, res) => {
  const { region, type, minPrice, maxPrice, amenities, sort, page = 1, limit = 12, search } = req.query;

  const query = { status: 'approved', isActive: true };

  if (region) query['location.region'] = region;
  if (type) query.propertyType = type;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (amenities) {
    const amenityList = amenities.split(',');
    query.amenities = { $all: amenityList };
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'location.address': { $regex: search, $options: 'i' } }
    ];
  }

  let sortObj = {};
  if (sort === 'price_asc') sortObj = { price: 1 };
  else if (sort === 'price_desc') sortObj = { price: -1 };
  else if (sort === 'rating') sortObj = { rating: -1 };
  else sortObj = { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Property.countDocuments(query);
  const properties = await Property.find(query)
    .populate('host', 'name avatar')
    .sort(sortObj)
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    count: properties.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
    properties
  });
};

// @route   GET /api/properties/:id
exports.getProperty = async (req, res) => {
  const property = await Property.findById(req.params.id).populate('host', 'name avatar bio phone createdAt');
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
  res.json({ success: true, property });
};

// @route   POST /api/properties
exports.createProperty = async (req, res) => {
  req.body.host = req.user.id;
  const property = await Property.create(req.body);
  res.status(201).json({ success: true, property });
};

// @route   PUT /api/properties/:id
exports.updateProperty = async (req, res) => {
  let property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

  if (property.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
  }

  // Reset to pending if non-admin updates
  if (req.user.role !== 'admin') req.body.status = 'pending';

  property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, property });
};

// @route   DELETE /api/properties/:id
exports.deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

  if (property.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await property.deleteOne();
  res.json({ success: true, message: 'Property deleted' });
};

// @route   PATCH /api/properties/:id/approve
exports.approveProperty = async (req, res) => {
  const { status } = req.body;
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
  res.json({ success: true, property });
};

// @route   GET /api/properties/host/my
exports.getMyProperties = async (req, res) => {
  const properties = await Property.find({ host: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, count: properties.length, properties });
};

// @route   GET /api/properties/map
exports.getMapProperties = async (req, res) => {
  const properties = await Property.find({ status: 'approved', isActive: true })
    .select('title price location propertyType rating images')
    .limit(200);
  res.json({ success: true, properties });
};
