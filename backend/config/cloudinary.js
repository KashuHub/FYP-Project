const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const makeStorage = (folder, w, h) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `tourista/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: w, height: h, crop: 'limit', quality: 'auto:good' }],
      public_id: (req, file) =>
        `${folder}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    },
  });

const fileFilter = (req, file, cb) =>
  file.mimetype.startsWith('image/')
    ? cb(null, true)
    : cb(new Error('Only image files allowed'), false);

const limits = { fileSize: 8 * 1024 * 1024 };

const uploadProperty   = multer({ storage: makeStorage('properties',  1200, 900),  fileFilter, limits });
const uploadPlace      = multer({ storage: makeStorage('places',      1400, 900),  fileFilter, limits });
const uploadExperience = multer({ storage: makeStorage('experiences', 1200, 800),  fileFilter, limits });
const uploadAvatar     = multer({ storage: makeStorage('avatars',     400,  400),  fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

const deleteImage = async (publicId) => {
  try { if (publicId) await cloudinary.uploader.destroy(publicId); }
  catch (err) { console.error('Cloudinary delete error:', err.message); }
};

module.exports = { cloudinary, uploadProperty, uploadPlace, uploadExperience, uploadAvatar, deleteImage };
