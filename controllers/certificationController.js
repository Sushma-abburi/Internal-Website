const Certification = require("../models/Certification");

// ✅ Create a new certification
exports.createCertification = async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      department,
      trainingTitle,
      certificateName,
      certificateURL,
      issueDate,
    } = req.body;

    if (!employeeId || !employeeName || !trainingTitle || !certificateName) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const cert = await Certification.create({
      employeeId,
      employeeName,
      department,
      trainingTitle,
      certificateName,
      certificateURL,
      issueDate,
    });

    res.status(201).json({ message: "✅ Certification added successfully", data: cert });
  } catch (error) {
    console.error("Error adding certification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all certifications
exports.getAllCertifications = async (req, res) => {
  try {
    const certs = await Certification.find().sort({ createdAt: -1 });
    res.status(200).json(certs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get certifications by employee
exports.getCertificationsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const certs = await Certification.find({ employeeId });
    res.status(200).json(certs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Department-wise certification stats
exports.getDepartmentCertStats = async (req, res) => {
  try {
    const stats = await Certification.aggregate([
      { $group: { _id: "$department", totalCertifications: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$totalCertifications", _id: 0 } },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Total certifications
exports.getTotalCertifications = async (req, res) => {
  try {
    const total = await Certification.countDocuments();
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
