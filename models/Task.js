const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  authorId: { type: String, required: true },      // employeeId or user id
  authorName: { type: String, required: true },
  role: { type: String, enum: ["Employee", "Manager", "HR"], default: "Employee" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // client-side id or uuid
  employeeId: { type: String, required: true },       // which employee this task belongs to
  fy: { type: String, required: true },               // FY-25 etc
  text: { type: String, required: true },             // task text/summary
  assigned: { type: String },                         // assigned by whom
  assignedDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  score: { type: Number, min: 0, max: 5, default: 0 },
  status: { type: String, enum: ["Open", "In Progress", "Completed"], default: "Open" },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TaskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Task", TaskSchema);