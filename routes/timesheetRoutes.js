// const express = require("express");
// const router = express.Router();
// const {
//   createOrUpdateEntry,
//   getAllEntries,
//   getEntryByDate,
//   deleteEntry,
// } = require("../controllers/timesheetController");

// router.post("/save", createOrUpdateEntry);
// router.get("/", getAllEntries);
// router.get("/:date", getEntryByDate);
// router.delete("/:date", deleteEntry);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {
  createTimeEntry,
  getMyTimeEntries,
} = require("../controllers/timesheetController");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Employee fills timesheet (requires login)
router.post("/", verifyToken, createTimeEntry);

// ✅ Get logged-in employee’s timesheet entries
router.get("/", verifyToken, getMyTimeEntries);

module.exports = router;
