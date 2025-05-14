// cloudinaryMiddleware.js

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg"],
  params: {
    folder: "User",
    transformation: [
      {
        width: 350,
        height: 450,
        crop: "fill",
        gravity: "center",
        quality: "auto:best",
      },
    ],
  },
});

const uploadUserCloud = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = uploadUserCloud;
