const express = require("express");
const router = express.Router();
const {
  getFullDetailsByEmail,
  getAllEmployeesFullDetails,
} = require("../controllers/finalController");

// ✅ Get one employee by login email
router.get("/details/:email", getFullDetailsByEmail);

// ✅ Get all employees full details
router.get("/details", getAllEmployeesFullDetails);

module.exports = router;
