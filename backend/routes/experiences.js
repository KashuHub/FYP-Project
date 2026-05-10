const express = require('express');
const router = express.Router();
const {
  getExperiences, getExperience, createExperience, updateExperience,
  deleteExperience, approveExperience, getMyExperiences
} = require('../controllers/experienceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getExperiences);
router.get('/host/my', protect, authorize('host', 'admin'), getMyExperiences);
router.get('/:id', getExperience);
router.post('/', protect, authorize('host', 'admin'), createExperience);
router.put('/:id', protect, authorize('host', 'admin'), updateExperience);
router.delete('/:id', protect, authorize('host', 'admin'), deleteExperience);
router.patch('/:id/approve', protect, authorize('admin'), approveExperience);

module.exports = router;
