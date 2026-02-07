const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "varoza/posters",
    resource_type: "image",

    // ✅ NO compression
    // ✅ NO quality loss
    // ✅ Only protects Cloudinary from insane dimensions
    transformation: [
      {
        width: 8000,
        height: 8000,
        crop: "limit",
      },
    ],

    format: undefined, // keep original format
  },
});

const uploadPoster = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // ✅ 20MB hard limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"), false);
    }
    cb(null, true);
  },
});

module.exports = uploadPoster;
