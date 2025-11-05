const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");



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



// 🧩 Unified Password Handler (Auto Detect)
exports.handlePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword, confirmPassword, token } = req.body;

    // -------------------- CASE 1: FORGOT PASSWORD --------------------
    if (email && !currentPassword && !newPassword && !confirmPassword && !token) {
      const employee = await Employee.findOne({ email });
      if (!employee) return res.status(404).json({ msg: "User not found" });

      const resetToken = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      await sendEmail({
        to: employee.email,
        subject: "Password Reset Request",
        html: `
          <h3>Hello ${employee.firstName},</h3>
          <p>You requested to reset your password. Click below:</p>
          <a href="${resetLink}" target="_blank">${resetLink}</a>
          <p>This link expires in 15 minutes.</p>
        `,
      });

      return res.status(200).json({ msg: "Password reset link sent to email" });
    }

    // -------------------- CASE 2: RESET PASSWORD --------------------
    if (token && newPassword && confirmPassword && !currentPassword) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const employee = await Employee.findById(decoded.id).select("+password");
      if (!employee) return res.status(404).json({ msg: "User not found" });

      if (newPassword !== confirmPassword)
        return res.status(400).json({ msg: "Passwords do not match" });

      employee.password = newPassword;
      employee.confirmPassword = confirmPassword;
      await employee.save();

      await sendEmail({
        to: employee.email,
        subject: "Password Reset Successful",
        html: `
          <h3>Hello ${employee.firstName},</h3>
          <p>Your password was successfully reset.</p>
          <p>If this wasn’t you, contact support immediately.</p>
        `,
      });

      return res.status(200).json({ msg: "Password reset successful" });
    }

    // -------------------- CASE 3: CHANGE PASSWORD --------------------
    if (email && currentPassword && newPassword && confirmPassword && !token) {
      const employee = await Employee.findOne({ email }).select("+password");
      if (!employee) return res.status(404).json({ msg: "User not found" });

      const isMatch = await employee.comparePassword(currentPassword);
      if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

      if (newPassword !== confirmPassword)
        return res.status(400).json({ msg: "Passwords do not match" });

      employee.password = newPassword;
      employee.confirmPassword = confirmPassword;
      await employee.save();

      await sendEmail({
        to: employee.email,
        subject: "Password Changed Successfully",
        html: `
          <h3>Hello ${employee.firstName},</h3>
          <p>Your password has been changed successfully.</p>
          <p>If you didn’t perform this action, contact support immediately.</p>
        `,
      });

      return res.status(200).json({ msg: "Password changed successfully" });
    }

    // -------------------- DEFAULT --------------------
    return res.status(400).json({
      msg: "Invalid or incomplete request. Please provide required fields.",
      example: {
        forgot: { email: "user@example.com" },
        change: {
          email: "user@example.com",
          currentPassword: "Old@123",
          newPassword: "New@123",
          confirmPassword: "New@123",
        },
        reset: {
          token: "<token_from_email>",
          newPassword: "New@123",
          confirmPassword: "New@123",
        },
      },
    });
  } catch (err) {
    console.error("❌ Password Handler Error:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
