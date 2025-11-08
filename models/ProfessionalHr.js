const mongoose = require("mongoose");

const professionalHrSchema = new mongoose.Schema({
  employeeId: {
    type: Number,
    ref: "ProfessionalDetails", // Assuming Personal schema holds employee personal details
    required: true,
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
