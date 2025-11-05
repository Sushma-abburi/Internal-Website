const express = require("express");
const router = express.Router();
const {
  createOrUpdateEntry,
  getAllEntries,
  getEntryByDate,
  deleteEntry,
} = require("../controllers/timesheetController");

router.post("/save", createOrUpdateEntry);
router.get("/", getAllEntries);
router.get("/:date", getEntryByDate);
router.delete("/:date", deleteEntry);

module.exports = router;
