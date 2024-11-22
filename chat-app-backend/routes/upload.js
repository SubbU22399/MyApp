const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Image upload endpoint
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
