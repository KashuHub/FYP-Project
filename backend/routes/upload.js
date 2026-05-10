const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  uploadProperty,
  uploadPlace,
  uploadExperience,
  uploadAvatar,
} = require('../config/cloudinary');
const {
  uploadImages,
  uploadAvatarHandler,
  removeImage,
} = require('../controllers/uploadController');

// Multer error handler wrapper
const withMulter = (multerMiddleware, field, maxCount) => (req, res, next) => {
  const handler = maxCount > 1
    ? multerMiddleware.array(field, maxCount)
    : multerMiddleware.single(field);

  handler(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.code === 'LIMIT_FILE_SIZE'
          ? 'File too large — max 8 MB per image'
          : err.message || 'Upload failed',
      });
    }
    next();
  });
};

// POST /api/upload/property   (up to 10 images)
router.post(
  '/property',
  protect,
  withMulter(uploadProperty, 'images', 10),
  uploadImages
);

// POST /api/upload/place   (up to 8 images)
router.post(
  '/place',
  protect,
  withMulter(uploadPlace, 'images', 8),
  uploadImages
);

// POST /api/upload/experience   (up to 6 images)
router.post(
  '/experience',
  protect,
  withMulter(uploadExperience, 'images', 6),
  uploadImages
);

// POST /api/upload/avatar   (single image)
router.post(
  '/avatar',
  protect,
  withMulter(uploadAvatar, 'avatar', 1),
  uploadAvatarHandler
);

// DELETE /api/upload/:publicId
router.delete('/:publicId(*)', protect, removeImage);

module.exports = router;
