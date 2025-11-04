const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { saveEducationDetails } = require("../controllers/educationController");

// ✅ Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// ✅ Field names MUST match frontend form names
const uploadFields = upload.fields([
  { name: "tenthCertificate", maxCount: 1 },
  { name: "intermediateCertificate", maxCount: 1 },
  { name: "degreeCertificate", maxCount: 1 },
  { name: "mtechCertificate", maxCount: 1 },
]);

// ✅ Route
router.post("/save", uploadFields, saveEducationDetails);

module.exports = router;
