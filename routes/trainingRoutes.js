const express = require("express");
const router = express.Router();
const {
  createTraining,
  getAllTrainings,
  getTrainingById,
  deleteTraining,
  getMonthlyStats,
  getDepartmentStats,
  getTrainingStatusSummary,
} = require("../controllers/trainingController");

router.post("/", createTraining);
router.get("/", getAllTrainings);
router.get("/:id", getTrainingById);
router.delete("/:id", deleteTraining);

// Analytics
router.get("/analytics/monthly", getMonthlyStats);
router.get("/analytics/department", getDepartmentStats);
router.get("/analytics/status", getTrainingStatusSummary);

module.exports = router;
