const express = require('express');
const router = express.Router();
const {
  getPlaces, getPlace, createPlace, updatePlace, deletePlace, approvePlace, getMapPlaces
} = require('../controllers/placeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getPlaces);
router.get('/map', getMapPlaces);
router.get('/:id', getPlace);
router.post('/', protect, authorize('host', 'admin'), createPlace);
router.put('/:id', protect, authorize('host', 'admin'), updatePlace);
router.delete('/:id', protect, authorize('host', 'admin'), deletePlace);
router.patch('/:id/approve', protect, authorize('admin'), approvePlace);

module.exports = router;
