const TimeEntry = require("../models/TimeEntry");

// Create or Update Entry
exports.createOrUpdateEntry = async (req, res) => {
  try {
    const { date, category, projectName, projectCode, projectType, hours } = req.body;

    if (!date || !category || !projectName || !projectCode || !projectType || hours === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEntry = await TimeEntry.findOne({ date: new Date(date) });

    if (existingEntry) {
      existingEntry.category = category;
      existingEntry.projectName = projectName;
      existingEntry.projectCode = projectCode;
      existingEntry.projectType = projectType;
      existingEntry.hours = hours;
      await existingEntry.save();

      return res.json({ message: "Entry updated successfully", entry: existingEntry });
    }

    const newEntry = new TimeEntry({
      date: new Date(date),
      category,
      projectName,
      projectCode,
      projectType,
      hours,
    });
    await newEntry.save();

    res.status(201).json({ message: "Entry saved successfully", entry: newEntry });
  } catch (err) {
    console.error("Error saving entry:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch All Entries (optionally filtered by month/year)
exports.getAllEntries = async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }

    const entries = await TimeEntry.find(filter).sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get entry by date
exports.getEntryByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const entry = await TimeEntry.findOne({ date });
    if (!entry) return res.status(404).json({ message: "No entry for this date" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete entry by date
exports.deleteEntry = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    await TimeEntry.deleteOne({ date });
    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
