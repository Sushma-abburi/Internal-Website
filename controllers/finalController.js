const Employee = require("../models/Employee");
const PersonalDetails = require("../models/personalDetails");
const Education = require("../models/educationDetails");
const ProfessionalDetails = require("../models/professionalDetails");

exports.getFullDetailsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log("📩 Fetching details for:", email);

    const employee = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (!employee) {
      return res.status(404).json({ msg: "Employee not found." });
    }

    console.log("✅ Employee found:");
    console.log(employee);

    // Extract both possible IDs
    const employeeId = employee.employeeId;
    const empId = employee.empId;

    console.log("🆔 employeeId:", employeeId);
    console.log("🆔 empId:", empId);

    // 🔍 Print what exists in other collections
    const personalDocs = await PersonalDetails.find({});
    const educationDocs = await Education.find({});
    const professionalDocs = await ProfessionalDetails.find({});

    console.log("📚 Personal Details employeeIds:", personalDocs.map(p => p.employeeId));
    console.log("🎓 Education employeeIds:", educationDocs.map(e => e.employeeId));
    console.log("💼 Professional employeeIds:", professionalDocs.map(p => p.employeeId));

    // Try to match
    const matchIds = [employeeId, empId, employeeId?.replace("EMP", "EMP-"), employeeId?.replace("EMP-", "EMP")].filter(Boolean);
    console.log("🔎 Trying matchIds:", matchIds);

    const [personal, education, professional] = await Promise.all([
      PersonalDetails.findOne({ employeeId: { $in: matchIds } }),
      Education.findOne({ employeeId: { $in: matchIds } }),
      ProfessionalDetails.findOne({ employeeId: { $in: matchIds } }),
    ]);

    console.log("✅ Matched Personal:", personal);
    console.log("✅ Matched Education:", education);
    console.log("✅ Matched Professional:", professional);

    res.status(200).json({
      msg: "✅ Full employee details fetched successfully.",
      data: {
        employee,
        personalDetails: personal || {},
        educationDetails: education || {},
        professionalDetails: professional || {},
      },
    });
  } catch (error) {
    console.error("❌ Error fetching full employee details:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// 🧾 Get full details for ALL employees
exports.getAllEmployeesFullDetails = async (req, res) => {
  try {
    console.log("📦 Fetching all employee details...");

    // 1️⃣ Get all employees
    const employees = await Employee.find();

    // 2️⃣ Fetch related data for each employee
    const allDetails = await Promise.all(
      employees.map(async (emp) => {
        const empId = emp.employeeId;

        const [personal, education, professional] = await Promise.all([
          PersonalDetails.findOne({ employeeId: empId }),
          Education.findOne({ employeeId: empId }),
          ProfessionalDetails.findOne({ employeeId: empId }),
        ]);

        return {
          employee: emp,
          personalDetails: personal || {},
          educationDetails: education || {},
          professionalDetails: professional || {},
        };
      })
    );

    // 3️⃣ Respond
    res.status(200).json({
      msg: "✅ All employee full details fetched successfully.",
      count: allDetails.length,
      data: allDetails,
    });
  } catch (error) {
    console.error("❌ Error fetching all employee details:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
