const mongoose = require("mongoose");

const professionalHrSchema = new mongoose.Schema({
    employeeId: {
      type: String, // or Number if you store 121 as number
      required: true,
      trim: true,
  },
  managerName: {
    type: String,
    required: true,
    trim: true,
  },
  projectAssigned: {
    type: String,
    required: true,
    trim: true,
  },
  assignedDate: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("ProfessionalHr", professionalHrSchema);
