// // routes/personalDetails.js
// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const { savePersonalDetails,getPersonalDetails,getAllPersonalDetails } = require("../controllers/personalDetailsController");

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, "../uploads/personal");
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// router.post(
//   "/save",
//   upload.fields([
//     { name: "adharFile", maxCount: 1 },
//     { name: "panFile", maxCount: 1 },
//     { name: "marriageCertificate", maxCount: 1 },
//     { name: "empPhoto", maxCount: 1 },
//   ]),
//   savePersonalDetails
// );
// router.get("/", getAllPersonalDetails);

// router.get("/:employeeId", getPersonalDetails);

// // ✅ NEW: Get all employees' personal details


// module.exports = router;
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  savePersonalDetails,
  getPersonalDetails,
  getAllPersonalDetails,
} = require("../controllers/personalDetailsController");

const router = express.Router();

// 🔹 Multer setup for local temp upload
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

// 🔹 Save or Update
router.post(
  "/save",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadharUpload", maxCount: 1 },
    { name: "panUpload", maxCount: 1 },
    { name: "marriageCertificate", maxCount: 1 },
  ]),
  savePersonalDetails
);

// 🔹 Fetch all
router.get("/", getAllPersonalDetails);

// 🔹 Fetch by email
router.get("/:email", getPersonalDetails);

module.exports = router;
