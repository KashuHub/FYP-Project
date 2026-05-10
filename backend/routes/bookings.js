const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, getBooking, cancelBooking, getHostBookings, confirmBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/host', protect, authorize('host', 'admin'), getHostBookings);
router.get('/:id', protect, getBooking);
router.patch('/:id/cancel', protect, cancelBooking);
router.patch('/:id/confirm', protect, authorize('host', 'admin'), confirmBooking);

module.exports = router;
