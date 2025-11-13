// const PersonalDetails = require("../models/personalDetails");
// const EducationDetails = require("../models/educationDetails");
// const ProfessionalDetails = require("../models/professionalDetails");

// // ✅ Get all or single employee full details
// exports.getEmployeeFullDetails = async (req, res) => {
//   try {
//     const { empId } = req.params;

//     let query = {};
//     if (empId) query.employeeId = empId;

//     // 1️⃣ Get professional details
//     const professionals = await ProfessionalDetails.find(query);

//     if (professionals.length === 0) {
//       return res.status(404).json({ msg: "No employees found" });
//     }

//     // 2️⃣ For each professional, find matching personal + education details
//     const fullDetails = await Promise.all(
//       professionals.map(async (prof) => {
//         const personal = await PersonalDetails.findOne({ employeeId: prof.employeeId });
//         const education = await EducationDetails.findOne({ employeeId: prof.employeeId });

//         return {
//           employeeId: prof.employeeId,
//           professional: prof,
//           personal: personal || {},
//           education: education || {},
//         };
//       })
//     );

//     res.status(200).json({
//       count: fullDetails.length,
//       data: fullDetails,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching employee details:", error);
//     res.status(500).json({ msg: "Server Error", error: error.message });
//   }
// };
const PersonalDetails = require("../models/personalDetails");
const Education = require("../models/educationDetails");
const ProfessionalDetails = require("../models/professionalDetails");

exports.getMyFullDetails = async (req, res) => {
  try {
    const emailFromToken = req.user.email;  // 👈 Logged-in employee email

    // Fetch all details
    const personal = await PersonalDetails.findOne({ email: emailFromToken });
    const education = await Education.findOne({ email: emailFromToken });
    const professional = await ProfessionalDetails.findOne({ email: emailFromToken });

    // If NO data found at least one
    if (!personal && !education && !professional) {
      return res.status(404).json({ msg: "No details found for this employee" });
    }

    res.status(200).json({
      msg: "✅ All employee details fetched successfully",
      email: emailFromToken,
      personal,
      education,
      professional,
    });

  } catch (error) {
    console.error("❌ Error fetching full details:", error);
    res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
};
exports.getFullDetailsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const personal = await PersonalDetails.findOne({ email });
    const education = await Education.findOne({ email });
    const professional = await ProfessionalDetails.findOne({ email });

    if (!personal && !education && !professional) {
      return res.status(404).json({ msg: "No details found for this email" });
    }

    res.status(200).json({
      msg: "✅ Employee full details fetched successfully",
      email,
      personal,
      education,
      professional
    });

  } catch (error) {
    console.error("❌ Error fetching details by email:", error);
    res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
};
