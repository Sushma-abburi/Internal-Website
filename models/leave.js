const mongoose = require("mongoose");
const { Schema } = mongoose;

// Optional: define a sub-schema for file info
const fileSub = new Schema({
  filename: String,
  path: String,
  mimetype: String,
  size: Number,
});

const leaveSchema = new Schema(
  {
    employeeName: { type: String, required: true },
    employeeId: { type: String },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    daysApplied: { type: Number, required: true },
    leaveType: { type: String, required: true },
    customTypes: { type: [String], default: [] },
    reason: { type: String },
    file: { type: fileSub, default: null },
    status: { type: String, default: "Sent" },
  },
  { timestamps: true }
);

// ✅ CommonJS export
module.exports = mongoose.models.Leave || mongoose.model("Leave", leaveSchema);
