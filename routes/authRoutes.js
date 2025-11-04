const express = require("express");
const router = express.Router();
const {
  registerEmployee,
  loginEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees
} = require("../controllers/employeeController");

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.get("/employees", getAllEmployees);

// 🔹 Get single employee by ID
router.get("/:id", getEmployeeById);

// 🔹 Search employees (optional)
router.get("/search/query", searchEmployees);


module.exports = router;
/////////////////////////////////routes/personaldetailsRoutes


