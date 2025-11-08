const express = require("express");
const router = express.Router();
const {
  createProfessionalHr,
  getAllProfessionalHr,
  updateProfessionalHr,
} = require("../controllers/professionalHrController");

// ➤ POST
router.post("/", createProfessionalHr);

// ➤ GET
router.get("/", getAllProfessionalHr);

// ➤ PUT (for HR updates)
router.put("/:id", updateProfessionalHr);

module.exports = router;
