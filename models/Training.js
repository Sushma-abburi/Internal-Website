const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
  {
    trainingTitle: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Senior", "Advanced"],
      required: true,
    },
    department: { type: String, required: true },
    trainerOrManager: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    employees: [
      {
        employeeId: String,
        employeeName: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Training", trainingSchema);
