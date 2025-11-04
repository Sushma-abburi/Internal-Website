// routes/personalDetails.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { savePersonalDetails } = require("../controllers/personalDetailsController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/personal");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/save",
  upload.fields([
    { name: "adharFile", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "marriageCertificate", maxCount: 1 },
    { name: "empPhoto", maxCount: 1 },
  ]),
  savePersonalDetails
);

module.exports = router;
