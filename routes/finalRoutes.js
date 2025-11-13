// const express = require("express");
// const router = express.Router();
// const { getEmployeeFullDetails } = require("../controllers/finalController");

// // Get all employees
// router.get("/details", getEmployeeFullDetails);

// // Get single employee by employeeId
// router.get("/details/:empId", getEmployeeFullDetails);

// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  getFullDetailsByEmail,
  getAllEmployeesFullDetails
} = require("../controllers/finalController");

// Get one employee full details
router.get("/:email", getFullDetailsByEmail);

// Get ALL employees full details
router.get("/", getAllEmployeesFullDetails);

module.exports = router;
