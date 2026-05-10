const express = require('express');
const router = express.Router();
const {
  getProperties, getProperty, createProperty, updateProperty,
  deleteProperty, approveProperty, getMyProperties, getMapProperties
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProperties);
router.get('/map', getMapProperties);
router.get('/host/my', protect, authorize('host', 'admin'), getMyProperties);
router.get('/:id', getProperty);
router.post('/', protect, authorize('host', 'admin'), createProperty);
router.put('/:id', protect, authorize('host', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('host', 'admin'), deleteProperty);
router.patch('/:id/approve', protect, authorize('admin'), approveProperty);

module.exports = router;
