const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "varoza/posters",
    resource_type: "image",

    // 🚫 NO COMPRESSION
    // 🚫 NO RESIZE
    // 🚫 NO FORMAT CONVERSION
    transformation: [],

    format: undefined, // keep original format
  },
});

const uploadPoster = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max (posters are big)
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files allowed"), false);
    }
    cb(null, true);
  },
});

module.exports = uploadPoster;
