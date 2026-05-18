const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  res.status(statusCode).json({ success: true, token, user: userObj });
};

// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  // Only allow user/host roles from registration (admin must be set manually)
  const allowedRole = ['user', 'host'].includes(role) ? role : 'user';
  const user = await User.create({ name, email, password, role: allowedRole });
  sendTokenResponse(user, 201, res);
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(401).json({ success: false, message: 'Account has been deactivated. Contact support.' });
  }

  sendTokenResponse(user, 200, res);
};

// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('wishlist', 'title images price location rating reviewCount propertyType maxGuests bedrooms amenities');
  res.json({ success: true, user });
};

// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  const { name, phone, bio, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone, bio, avatar },
    { new: true, runValidators: true }
  )
    .populate('wishlist', 'title images price location rating reviewCount propertyType maxGuests bedrooms amenities');
  res.json({ success: true, user });
};

// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully' });
};

// @route   POST /api/auth/wishlist/:propertyId
exports.toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user.id);
  const propertyId = req.params.propertyId;

  // Compare as strings to handle ObjectId vs string mismatch
  const index = user.wishlist.findIndex(id => id.toString() === propertyId);

  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(propertyId);
  }

  await user.save();

  // Re-fetch with populated wishlist so frontend gets full property objects
  const updatedUser = await User.findById(req.user.id)
    .populate('wishlist', 'title images price location rating reviewCount propertyType maxGuests bedrooms amenities');

  res.json({
    success: true,
    wishlist: updatedUser.wishlist,
    isWishlisted: index === -1,
    count: updatedUser.wishlist.length,
  });
};
