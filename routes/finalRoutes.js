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

const { verifyToken } = require("../middleware/authMiddleware");
const { getMyFullDetails,getFullDetailsByEmail } = require("../controllers/finalController");

// GET all employee details
router.get("/me", verifyToken, getMyFullDetails);
router.get("/:email", verifyToken, getFullDetailsByEmail);


module.exports = router;
