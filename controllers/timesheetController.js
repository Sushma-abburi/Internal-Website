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
const Leave = require("../models/leave");

// --------------------------------------------------------
// CREATE Timesheet Entry
// --------------------------------------------------------
exports.createTimeEntry = async (req, res) => {
  try {
    const employeeEmail = req.user.email;
    const { date, category, projectName, projectCode, projectType, hours } = req.body;

    if (!date) return res.status(400).json({ msg: "Date is required" });

    // 1️⃣ Block entry if leave exists for this date
    const leaveExists = await Leave.findOne({
      officialEmail: employeeEmail,
      status: "Approved",
      fromDate: { $lte: date },
      toDate: { $gte: date }
    });

    if (leaveExists) {
      return res.status(400).json({
        msg: `❌ Cannot create timesheet for ${date}. Approved leave exists.`
      });
    }

    // 2️⃣ Block duplicate entry
    const existingEntry = await TimeEntry.findOne({ employeeEmail, date });
    if (existingEntry) {
      return res.status(400).json({ msg: "Timesheet already filled for this date." });
    }

    // 3️⃣ Insert timesheet
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
      msg: "Timesheet created successfully",
      timeEntry,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error creating timesheet", error: error.message });
  }
};

// --------------------------------------------------------
// GET Logged-in Employee Timesheets
// --------------------------------------------------------
exports.getMyTimeEntries = async (req, res) => {
  try {
    const employeeEmail = req.user.email;

    const entries = await TimeEntry.find({ employeeEmail }).sort({ date: -1 });

    if (!entries.length) {
      return res.status(404).json({ msg: "No timesheet entries found." });
    }

    res.status(200).json({ count: entries.length, entries });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching entries", error: error.message });
  }
};

// --------------------------------------------------------
// UPDATE (PUT) Timesheet
// --------------------------------------------------------
exports.updateTimeEntryByEmail = async (req, res) => {
  try {
    const employeeEmail = req.user.email;
    const { date } = req.body;

    if (!date) return res.status(400).json({ msg: "Date is required" });

    // 1️⃣ Block if leave approved
    const leaveExists = await Leave.findOne({
      officialEmail: employeeEmail,
      status: "Approved",
      fromDate: { $lte: date },
      toDate: { $gte: date }
    });

    if (leaveExists) {
      return res.status(400).json({
        msg: `❌ Timesheet cannot be updated. Leave approved for ${date}.`
      });
    }

    // 2️⃣ Update
    const updatedEntry = await TimeEntry.findOneAndUpdate(
      { employeeEmail, date },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ msg: "No timesheet found for this date." });
    }

    res.status(200).json({ msg: "Timesheet updated", updatedEntry });
  } catch (error) {
    res.status(500).json({ msg: "Error updating timesheet", error: error.message });
  }
};

// --------------------------------------------------------
// PARTIAL UPDATE (PATCH)
// --------------------------------------------------------
exports.patchTimeEntryByEmail = async (req, res) => {
  try {
    const employeeEmail = req.user.email;
    const { date } = req.body;

    if (!date) return res.status(400).json({ msg: "Date is required" });

    // 1️⃣ Block if approved leave
    const leaveExists = await Leave.findOne({
      officialEmail: employeeEmail,
      status: "Approved",
      fromDate: { $lte: date },
      toDate: { $gte: date }
    });

    if (leaveExists) {
      return res.status(400).json({
        msg: `❌ Cannot update timesheet. Leave approved for ${date}.`
      });
    }

    const updatedEntry = await TimeEntry.findOneAndUpdate(
      { employeeEmail, date },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ msg: "Timesheet entry not found." });
    }

    res.status(200).json({ msg: "Timesheet partially updated", updatedEntry });
  } catch (error) {
    res.status(500).json({ msg: "Error patching timesheet", error: error.message });
  }
};
