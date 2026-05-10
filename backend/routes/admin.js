const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, updateUserStatus,
  getPendingItems, getAllBookings
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUserStatus);
router.get('/pending', getPendingItems);
router.get('/bookings', getAllBookings);

module.exports = router;
