const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Experience = require('../models/Experience');

// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  const { propertyId, experienceId, checkIn, checkOut, experienceDate, guests, specialRequests } = req.body;

  let totalPrice = 0;
  let bookingData = { user: req.user.id, guests, specialRequests };

  if (propertyId) {
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    if (property.status !== 'approved') return res.status(400).json({ success: false, message: 'Property not available' });

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (nights < 1) return res.status(400).json({ success: false, message: 'Invalid dates' });

    totalPrice = property.price * nights;
    bookingData = { ...bookingData, property: propertyId, bookingType: 'property', checkIn, checkOut, totalPrice };
  } else if (experienceId) {
    const experience = await Experience.findById(experienceId);
    if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });
    if (experience.status !== 'approved') return res.status(400).json({ success: false, message: 'Experience not available' });

    totalPrice = experience.price * (guests?.total || 1);
    bookingData = { ...bookingData, experience: experienceId, bookingType: 'experience', experienceDate, totalPrice };
  } else {
    return res.status(400).json({ success: false, message: 'Please provide property or experience ID' });
  }

  const booking = await Booking.create(bookingData);
  await booking.populate([
    { path: 'property', select: 'title images location price' },
    { path: 'experience', select: 'title images location price' }
  ]);

  res.status(201).json({ success: true, booking });
};

// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate('property', 'title images location price host')
    .populate('experience', 'title images location price host')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, bookings });
};

// @route   GET /api/bookings/:id
exports.getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property', 'title images location price amenities host')
    .populate('experience', 'title images location price host')
    .populate('user', 'name email phone');

  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  res.json({ success: true, booking });
};

// @route   PATCH /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (['completed', 'cancelled'].includes(booking.status)) {
    return res.status(400).json({ success: false, message: `Booking is already ${booking.status}` });
  }

  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || 'Cancelled by user';
  booking.cancelledAt = new Date();
  await booking.save();

  res.json({ success: true, booking });
};

// @route   GET /api/bookings/host/all  (for host to see bookings on their listings)
exports.getHostBookings = async (req, res) => {
  const properties = await Property.find({ host: req.user.id }).select('_id');
  const propertyIds = properties.map(p => p._id);

  const bookings = await Booking.find({ property: { $in: propertyIds } })
    .populate('user', 'name email phone')
    .populate('property', 'title images')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bookings.length, bookings });
};

// @route   PATCH /api/bookings/:id/confirm  (host confirms)
exports.confirmBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('property');
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  if (booking.property?.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  booking.status = 'confirmed';
  booking.confirmedAt = new Date();
  await booking.save();

  res.json({ success: true, booking });
};
