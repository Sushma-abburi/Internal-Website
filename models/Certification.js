const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    department: { type: String, required: true },
    trainingTitle: { type: String, required: true },
    certificateName: { type: String, required: true },
    certificateURL: { type: String },
    issueDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certificationSchema);
