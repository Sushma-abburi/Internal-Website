const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  saveProfessionalDetails,
  getAllProfessionalDetails,
  getProfessionalDetailsByEmpId,
} = require("../controllers/professionalController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/professional/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Define routes
router.post(
  "/save",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "relievingLetter", maxCount: 1 },
    { name: "salarySlips", maxCount: 10 },
  ]),
  saveProfessionalDetails
);

router.get("/", getAllProfessionalDetails);
router.get("/:empId", getProfessionalDetailsByEmpId);

module.exports = router;
