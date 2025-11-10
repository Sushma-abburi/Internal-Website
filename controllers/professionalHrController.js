// const ProfessionalHr = require("../models/ProfessionalHr");

// // ➤ Add HR Professional Data
// exports.createProfessionalHr = async (req, res) => {
//   try {
//     const { employeeId, managerName, projectAssigned, assignedDate } = req.body;

//     const newData = new ProfessionalHr({
//       employeeId,
//       managerName,
//       projectAssigned,
//       assignedDate,
//     });

//     await newData.save();
//     res.status(201).json({ message: "HR Professional data added successfully", data: newData });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding HR data", error: error.message });
//   }
// };

// // ➤ Get All HR Professional Data
// exports.getAllProfessionalHr = async (req, res) => {
//   try {
//     const data = await ProfessionalHr.find().populate("employeeId");
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching data", error: error.message });
//   }
// };

// // ➤ Update HR Professional Data
// exports.updateProfessionalHr = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = await ProfessionalHr.findByIdAndUpdate(id, req.body, { new: true });
//     res.status(200).json({ message: "HR Professional data updated successfully", data: updatedData });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating data", error: error.message });
//   }
// };
const ProfessionalHr = require("../models/ProfessionalHr");

// ➤ Add HR Professional Data
exports.createProfessionalHr = async (req, res) => {
  try {
    const { employeeId, managerName, projectAssigned, assignedDate } = req.body;

    const newData = new ProfessionalHr({
      employeeId,
      managerName,
      projectAssigned,
      assignedDate,
    });

    await newData.save();
    res.status(201).json({
      message: "HR Professional data added successfully",
      data: newData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding HR data", error: error.message });
  }
};

// ➤ Get All HR Professional Data
exports.getAllProfessionalHr = async (req, res) => {
  try {
    // ✅ NO .populate() HERE
    const data = await ProfessionalHr.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching data",
      error: error.message,
    });
  }
};

// ➤ Update HR Professional Data
exports.updateProfessionalHr = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await ProfessionalHr.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      message: "HR Professional data updated successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating data", error: error.message });
  }
};
