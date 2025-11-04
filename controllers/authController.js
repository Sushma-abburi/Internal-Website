const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");

// 🧩 Login Employee
exports.loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔎 Find user by email and include password
    const employee = await Employee.findOne({ email }).select("+password");
    if (!employee) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 🔑 Check password
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 🧠 Check if admin login
    if (email === "admin@example.com") {
      employee.role = "admin";
      await employee.save(); // ✅ Persist the admin role in DB (optional)
    }

    // 🎫 Generate JWT Token
    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      msg: "Login successful",
      employee: {
        id: employee._id,
        email: employee.email,
        role: employee.role,
        name: `${employee.firstName} ${employee.lastName}`,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
