const Training = require("../models/Training");

// ✅ Create a new training assignment
exports.createTraining = async (req, res) => {
  try {
    const {
      trainingTitle,
      level,
      department,
      trainerOrManager,
      fromDate,
      toDate,
      employees,
    } = req.body;

    if (
      !trainingTitle ||
      !level ||
      !department ||
      !trainerOrManager ||
      !fromDate ||
      !toDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!employees || !employees.length) {
      return res.status(400).json({ message: "At least one employee required" });
    }

    const training = new Training({
      trainingTitle,
      level,
      department,
      trainerOrManager,
      fromDate,
      toDate,
      employees,
    });

    const saved = await training.save();
    res.status(201).json({ message: "✅ Training assigned successfully", data: saved });
  } catch (error) {
    console.error("Error creating training:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all trainings
exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find().sort({ createdAt: -1 });
    res.status(200).json(trainings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get training by ID
exports.getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: "Training not found" });
    res.status(200).json(training);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete training
exports.deleteTraining = async (req, res) => {
  try {
    const deleted = await Training.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Training not found" });
    res.status(200).json({ message: "Training deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Monthly training summary
exports.getMonthlyStats = async (req, res) => {
  try {
    const stats = await Training.aggregate([
      {
        $group: {
          _id: { $month: "$fromDate" },
          month: { $first: { $month: "$fromDate" } },
          totalTrainings: { $sum: 1 },
          totalEmployees: { $sum: { $size: "$employees" } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const formatted = monthNames.map((m, i) => {
      const match = stats.find((s) => s._id === i + 1);
      return {
        month: m,
        totalTrainings: match ? match.totalTrainings : 0,
        totalEmployees: match ? match.totalEmployees : 0,
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Department-wise training share
exports.getDepartmentStats = async (req, res) => {
  try {
    const stats = await Training.aggregate([
      {
        $group: {
          _id: "$department",
          totalTrainings: { $sum: 1 },
          totalEmployees: { $sum: { $size: "$employees" } },
        },
      },
      {
        $project: {
          name: "$_id",
          value: "$totalEmployees",
          _id: 0,
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Training status summary (ongoing, completed, upcoming)
exports.getTrainingStatusSummary = async (req, res) => {
  try {
    const today = new Date();

    const [ongoing, completed, upcoming] = await Promise.all([
      Training.countDocuments({ fromDate: { $lte: today }, toDate: { $gte: today } }),
      Training.countDocuments({ toDate: { $lt: today } }),
      Training.countDocuments({ fromDate: { $gt: today } }),
    ]);

    res.status(200).json({ ongoing, completed, upcoming });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
