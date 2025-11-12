const express = require("express");
const router = express.Router();
const {
  createCertification,
  getAllCertifications,
  getCertificationsByEmployee,
  getDepartmentCertStats,
  getTotalCertifications,
} = require("../controllers/certificationController");

router.post("/", createCertification);
router.get("/", getAllCertifications);
router.get("/employee/:employeeId", getCertificationsByEmployee);
router.get("/analytics/department", getDepartmentCertStats);
router.get("/analytics/total", getTotalCertifications);

module.exports = router;
