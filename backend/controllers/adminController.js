const User = require('../models/User');
const Property = require('../models/Property');
const Place = require('../models/Place');
const Experience = require('../models/Experience');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

exports.getDashboardStats = async (req, res) => {
  const [
    totalUsers, totalHosts, totalProperties, pendingProperties,
    totalPlaces, pendingPlaces, totalExperiences, pendingExperiences,
    totalBookings, totalRevenue
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'host' }),
    Property.countDocuments(),
    Property.countDocuments({ status: 'pending' }),
    Place.countDocuments(),
    Place.countDocuments({ status: 'pending' }),
    Experience.countDocuments(),
    Experience.countDocuments({ status: 'pending' }),
    Booking.countDocuments(),
    Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ])
  ]);

  const recentBookings = await Booking.find()
    .populate('user', 'name email')
    .populate('property', 'title')
    .sort({ createdAt: -1 })
    .limit(10);

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    success: true,
    stats: {
      users: { total: totalUsers, hosts: totalHosts },
      properties: { total: totalProperties, pending: pendingProperties },
      places: { total: totalPlaces, pending: pendingPlaces },
      experiences: { total: totalExperiences, pending: pendingExperiences },
      bookings: { total: totalBookings },
      revenue: totalRevenue[0]?.total || 0
    },
    recentBookings,
    recentUsers
  });
};

exports.getAllUsers = async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } }
  ];

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(query);
  const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

  res.json({ success: true, total, users });
};

exports.updateUserStatus = async (req, res) => {
  const { isActive, role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive, role }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user });
};

exports.getPendingItems = async (req, res) => {
  const [pendingProperties, pendingPlaces, pendingExperiences] = await Promise.all([
    Property.find({ status: 'pending' }).populate('host', 'name email').sort({ createdAt: -1 }),
    Place.find({ status: 'pending' }).populate('createdBy', 'name email').sort({ createdAt: -1 }),
    Experience.find({ status: 'pending' }).populate('host', 'name email').sort({ createdAt: -1 })
  ]);

  res.json({ success: true, pendingProperties, pendingPlaces, pendingExperiences });
};

exports.getAllBookings = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Booking.countDocuments(query);
  const bookings = await Booking.find(query)
    .populate('user', 'name email')
    .populate('property', 'title location')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, bookings });
};
