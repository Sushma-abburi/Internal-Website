// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const { saveEducationDetails,getAllEducationDetails,getEducationDetailsByEmployeeId } = require("../controllers/educationController");

// // ✅ Configure multer for local storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// });

// const upload = multer({ storage });

// // ✅ Field names MUST match frontend form names
// const uploadFields = upload.fields([
//   { name: "tenthCertificate", maxCount: 1 },
//   { name: "intermediateCertificate", maxCount: 1 },
//   { name: "degreeCertificate", maxCount: 1 },
//   { name: "mtechCertificate", maxCount: 1 },
// ]);

// // ✅ Route
// router.post("/save", uploadFields, saveEducationDetails);
// router.get("/", getAllEducationDetails);

// // ✅ GET Route — Fetch Education Details by Employee ID
// router.get("/:employeeId", getEducationDetailsByEmployeeId);


// module.exports = router;
const express = require("express");
const multer = require("multer");
const {
  saveEducationDetails,
  getAllEducationDetails,
  getEducationDetailsById,
} = require("../controllers/educationController");

const router = express.Router();

//  Multer setup (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

//  Define upload fields (match frontend input names)
const uploadFields = upload.fields([
  { name: "certificate10", maxCount: 1 },
  { name: "certificate12", maxCount: 1 },
  { name: "certificateUG", maxCount: 1 },
  { name: "certificateMTech", maxCount: 1 },
]);

//  POST: Save Education Details (with Azure Upload)
router.post("/save", uploadFields, saveEducationDetails);

//  GET: Fetch all education details
router.get("/", getAllEducationDetails);

//  GET: Fetch education details by MongoDB _id
router.get("/id/:id", getEducationDetailsById);

module.exports = router;
