const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get user public profile
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('name avatar bio role createdAt');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user });
});

module.exports = router;
