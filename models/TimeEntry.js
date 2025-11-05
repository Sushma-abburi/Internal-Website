const mongoose = require("mongoose");

const timeEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    category: { type: String, required: true },
    projectName: { type: String, required: true },
    projectCode: { type: String, required: true },
    projectType: { type: String, required: true },
    hours: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimeEntry", timeEntrySchema);
