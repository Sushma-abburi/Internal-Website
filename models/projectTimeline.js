const mongoose = require("mongoose");

// ✅ Project Timeline Schema
const projectTimelineSchema = new mongoose.Schema(
  {
    // 🆔 Auto-generated unique Project ID
    projectId: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return "PROJ" + Date.now(); // Example: PROJ1731410258715
      },
    },

    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    // 🧩 Manager or person who assigned the project
    assignedBy: {
      type: String, // e.g., "MGR001"
      required: true,
      trim: true,
    },

    // 👥 One or more employees assigned to this project
    assignedTo: [
      {
        type: String, // e.g., "EMP001"
        required: true,
        trim: true,
      },
    ],

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // 🕒 Duration (auto-calculated in days)
    duration: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["Planning", "Ongoing", "Completed", "On Hold"],
      default: "Planning",
    },
  },
  { timestamps: true }
);

// ✅ Auto-calculate duration in days before save
projectTimelineSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    const diff = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
    this.duration = Math.ceil(diff);
  }
  next();
});

module.exports = mongoose.model("ProjectTimeline", projectTimelineSchema);
