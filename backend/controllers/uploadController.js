const { deleteImage } = require('../config/cloudinary');

/**
 * POST /api/upload/property   → uploads up to 10 property images
 * POST /api/upload/place      → uploads up to 8 place images
 * POST /api/upload/experience → uploads up to 6 experience images
 * POST /api/upload/avatar     → uploads single avatar
 *
 * All multer parsing happens via route-level middleware,
 * so by the time these handlers run, req.files / req.file is ready.
 */

// Generic handler for multi-image uploads
const uploadImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const images = req.files.map(file => ({
      url: file.path,          // Cloudinary HTTPS URL
      public_id: file.filename, // Cloudinary public ID (for deletion later)
    }));

    return res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Single avatar upload
const uploadAvatarHandler = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    return res.status(200).json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/upload/:publicId  — remove a Cloudinary image
const removeImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'No public_id provided' });
    }

    // Reconstruct full public_id (router passes it URL-encoded)
    const decodedId = decodeURIComponent(publicId);
    await deleteImage(decodedId);

    return res.json({ success: true, message: 'Image removed from Cloudinary' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { uploadImages, uploadAvatarHandler, removeImage };
