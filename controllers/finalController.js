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

exports.getAllEmployeesFullDetails = async (req, res) => {
  try {
    // Fetch all personals (base list of employees)
    const personals = await PersonalDetails.find();

    if (!personals.length) {
      return res.status(404).json({ msg: "No employees found" });
    }

    const results = [];

    for (const person of personals) {
      const officialEmail = person.officialEmail;

      const education = await Education.findOne({ officialEmail });
      const professional = await ProfessionalDetails.findOne({ officialEmail });

      results.push({
        officialEmail,
        personal: person,
        education,
        professional,
      });
    }

    res.status(200).json({
      msg: "All employees full details fetched successfully",
      count: results.length,
      data: results,
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
exports.getFullDetailsByEmail = async (req, res) => {
  try {
    const { email } = req.params; // official email from URL

    if (!email) {
      return res.status(400).json({ msg: "officialEmail is required" });
    }

    const personal = await PersonalDetails.findOne({ officialEmail: email });
    const education = await Education.findOne({ officialEmail: email });
    const professional = await ProfessionalDetails.findOne({ officialEmail: email });

    if (!personal && !education && !professional) {
      return res.status(404).json({ msg: "No details found for this employee" });
    }

    res.status(200).json({
      msg: "Employee full details fetched successfully",
      officialEmail: email,
      personal,
      education,
      professional,
    });

  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
