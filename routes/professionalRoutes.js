// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const {
//   saveProfessionalDetails,
//   getAllProfessionalDetails,
//   getProfessionalDetailsByEmpId,
// } = require("../controllers/professionalController");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Define routes
// // router.post(
// //   "/save",
// //   upload.fields([
// //     { name: "profilePicture", maxCount: 1 },
// //     { name: "relievingLetter", maxCount: 1 },
// //     { name: "salarySlips", maxCount: 10 },
// //   ]),
// //   saveProfessionalDetails
// // );

// // Routes
// router.post(
//   "/save",
//   upload.any(), // accept any fields (since experience fields are nested)
//   saveProfessionalDetails
// );

// router.get("/", getAllProfessionalDetails);
// router.get("/:empId", getProfessionalDetailsByEmpId);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const {
//   saveProfessionalDetails,
//   getAllProfessionalDetails,
//   getProfessionalDetailsByEmpId,
// } = require("../controllers/professionalController");

// // ✅ 1. Ensure "uploads/professional" folder exists before using multer
// const uploadDir = path.join(__dirname, "../uploads/professional");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log("📂 Created uploads folder:", uploadDir);
// } else {
//   console.log("📂 Upload folder already exists:", uploadDir);
// }

// // ✅ 2. Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir); // absolute path ensures correctness
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // ✅ 3. Routes Definition
// router.post(
//   "/save",
//   upload.fields([
//     { name: "relivingLetter", maxCount: 1 },
//     { name: "salarySlips", maxCount: 1 },
//   ]),
//   saveProfessionalDetails
// );

// router.get("/", getAllProfessionalDetails);
// router.get("/:employeeId", getProfessionalDetailsByEmpId);

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const professionalController = require("../controllers/professionalController");

// // temporary storage folder
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/professional");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
//     );
//   },
// });

// const upload = multer({ storage });

// // allow any relivingLetter_X or salarySlips_X fields
// const dynamicUpload = upload.any();

// router.post(
//   "/save",
//   dynamicUpload,
//   professionalController.saveProfessionalDetails
// );

// router.get("/", professionalController.getAllProfessionalDetails);
// router.get("/:employeeId", professionalController.getProfessionalDetailsByEmpId);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  saveProfessionalDetails,
  getAllProfessionalDetails,
  getProfessionalDetailsByEmpId,
} = require("../controllers/professionalController");

// 📂 Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/professional/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ⚙️ Configure Multer Fields
const upload = multer({ storage }).fields([
  // Main (if you add profile picture later)
  { name: "profilePicture", maxCount: 1 },

  // Experience Files — using array-like notation
  { name: "experiences[0][relivingLetter]", maxCount: 1 },
  { name: "experiences[0][salarySlips]", maxCount: 5 },
  { name: "experiences[1][relivingLetter]", maxCount: 1 },
  { name: "experiences[1][salarySlips]", maxCount: 5 },
]);

// 🧾 Routes
router.post("/save", upload, saveProfessionalDetails);
router.get("/", getAllProfessionalDetails);
router.get("/:empId", getProfessionalDetailsByEmpId);

module.exports = router;
