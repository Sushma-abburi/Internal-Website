const express = require("express");
const router = express.Router();
const {
  createProfessionalHr,
  getAllProfessionalHr,
  updateProfessionalHr,
} = require("../controllers/professionalHrController");

// ➤ POST
router.post("/save", createProfessionalHr);

// ➤ GET
router.get("/", getAllProfessionalHr);

// ➤ PUT (for HR updates)
router.put("/:id", updateProfessionalHr);
router.get("/test", (req, res) => {
  res.send("✅ HR Route Working Properly");
});


module.exports = router;
