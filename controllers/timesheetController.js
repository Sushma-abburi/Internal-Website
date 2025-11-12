// const TimeEntry = require("../models/TimeEntry");

// // Create or Update Entry
// exports.createOrUpdateEntry = async (req, res) => {
//   try {
//     const { date, category, projectName, projectCode, projectType, hours } = req.body;

//     if (!date || !category || !projectName || !projectCode || !projectType || hours === undefined) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingEntry = await TimeEntry.findOne({ date: new Date(date) });

//     if (existingEntry) {
//       existingEntry.category = category;
//       existingEntry.projectName = projectName;
//       existingEntry.projectCode = projectCode;
//       existingEntry.projectType = projectType;
//       existingEntry.hours = hours;
//       await existingEntry.save();

//       return res.json({ message: "Entry updated successfully", entry: existingEntry });
//     }

//     const newEntry = new TimeEntry({
//       date: new Date(date),
//       category,
//       projectName,
//       projectCode,
//       projectType,
//       hours,
//     });
//     await newEntry.save();

//     res.status(201).json({ message: "Entry saved successfully", entry: newEntry });
//   } catch (err) {
//     console.error("Error saving entry:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Fetch All Entries (optionally filtered by month/year)
// exports.getAllEntries = async (req, res) => {
//   try {
//     const { month, year } = req.query;
//     let filter = {};

//     if (month && year) {
//       const start = new Date(year, month - 1, 1);
//       const end = new Date(year, month, 0, 23, 59, 59);
//       filter.date = { $gte: start, $lte: end };
//     }

//     const entries = await TimeEntry.find(filter).sort({ date: 1 });
//     res.json(entries);
//   } catch (err) {
//     console.error("Error fetching entries:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get entry by date
// exports.getEntryByDate = async (req, res) => {
//   try {
//     const date = new Date(req.params.date);
//     const entry = await TimeEntry.findOne({ date });
//     if (!entry) return res.status(404).json({ message: "No entry for this date" });
//     res.json(entry);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Delete entry by date
// exports.deleteEntry = async (req, res) => {
//   try {
//     const date = new Date(req.params.date);
//     await TimeEntry.deleteOne({ date });
//     res.json({ message: "Entry deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
const TimeEntry = require("../models/TimeEntry");
const Employee = require("../models/Employee");

// ✅ Create a new timesheet entry for logged-in employee
exports.createTimeEntry = async (req, res) => {
  try {
    const employeeEmail = req.user.email; // 👈 Automatically taken from login token
    const { date, category, projectName, projectCode, projectType, hours } = req.body;

    if (!employeeEmail) {
      return res.status(400).json({ msg: "Unauthorized: Missing employee email" });
    }

    // Prevent duplicate entry for same date
    const existingEntry = await TimeEntry.findOne({ employeeEmail, date });
    if (existingEntry) {
      return res.status(400).json({ msg: "Timesheet already filled for this date." });
    }

    const timeEntry = await TimeEntry.create({
      employeeEmail,
      date,
      category,
      projectName,
      projectCode,
      projectType,
      hours,
    });

    res.status(201).json({
      msg: "✅ Timesheet entry created successfully",
      timeEntry,
    });
  } catch (error) {
    console.error("❌ Error creating time entry:", error);
    res.status(500).json({
      msg: "Error creating timesheet entry",
      error: error.message,
    });
  }
};

// ✅ Get all timesheets for logged-in employee
exports.getMyTimeEntries = async (req, res) => {
  try {
    const employeeEmail = req.user.email;

    const entries = await TimeEntry.find({ employeeEmail }).sort({ date: -1 });

    if (!entries.length) {
      return res.status(404).json({ msg: "No timesheet entries found." });
    }

    res.status(200).json({
      count: entries.length,
      entries,
    });
  } catch (error) {
    console.error("❌ Error fetching timesheet entries:", error);
    res.status(500).json({
      msg: "Error fetching timesheet entries",
      error: error.message,
    });
  }
};
