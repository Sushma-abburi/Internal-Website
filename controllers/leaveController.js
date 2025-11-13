const Leave = require("../models/leave");
const ProfessionalDetails = require("../models/professionalDetails");
const { blobServiceClient, containerName } = require("../config/azureBlob");

// ✅ Helper: Upload file buffer directly to Azure Blob
async function uploadToAzure(fileBuffer, originalname) {
  if (!fileBuffer) return null;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists({ access: "container" });
  const blobName = Date.now() + "-" + originalname;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(fileBuffer);
  return blockBlobClient.url;
}

// 🟢 CREATE LEAVE — auto-calculate daysApplied safely
exports.createLeave = async (req, res) => {
  try {
    const {
      employeeName,
      employeeId,
      fromDate,
      toDate,
      leaveType,
      customTypes,
      reason,
    } = req.body;

    if (!employeeId || !fromDate || !toDate || !leaveType) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    // ✅ Calculate leave duration
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // ✅ Get current available casual leaves
    const leaveBalance = await calculateAvailableCasualLeaves(employeeId);
    const { earnedLeaves, usedLeaves, remainingLeaves } = leaveBalance;

    if (leaveType === "Casual" && remainingLeaves < diffDays) {
      return res.status(400).json({
        msg: `❌ Not enough casual leaves. Available: ${remainingLeaves}, Requested: ${diffDays}`,
      });
    }

    // ✅ Upload file if provided
    let file = null;
    if (req.file) {
      const containerClient = blobServiceClient.getContainerClient(containerName);
      await containerClient.createIfNotExists({ access: "container" });
      const blobName = Date.now() + "-" + req.file.originalname;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(req.file.buffer);
      file = {
        filename: req.file.originalname,
        path: blockBlobClient.url,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }

    // ✅ Create Leave Record
    const leave = new Leave({
      employeeName,
      employeeId,
      fromDate: start,
      toDate: end,
      daysApplied: diffDays,
      leaveType,
      customTypes,
      reason,
      file,
      status: "Sent",
    });

    await leave.save();

    res.status(201).json({
      msg: "✅ Leave applied successfully (Pending HR approval)",
      leave,
      leaveBalance,
    });
  } catch (error) {
    console.error("❌ Error saving leave:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
// 🟢 HR APPROVE OR REJECT LEAVE
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    const leave = await Leave.findById(leaveId);
    if (!leave) return res.status(404).json({ msg: "Leave not found" });

    leave.status = status;
    await leave.save();

    // After approval, recalculate updated balance
    const leaveBalance = await calculateAvailableCasualLeaves(leave.employeeId);

    res.status(200).json({
      msg: `✅ Leave ${status} successfully`,
      leave,
      leaveBalance,
    });
  } catch (error) {
    console.error("❌ Error updating leave:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
// 🟢 Get Leave Summary from Joining Date
exports.getLeaveSummary = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const professional = await ProfessionalDetails.findOne({ employeeId });
    if (!professional)
      return res.status(404).json({ msg: "Professional details not found for this employee." });

    const joiningDate = new Date(professional.dateOfJoining);
    const today = new Date();
    const yearsWorked = Math.floor((today - joiningDate) / (1000 * 60 * 60 * 24 * 365));
    const allowedLeaves = (yearsWorked + 1) * 10;

    const approvedLeaves = await Leave.find({
      employeeId,
      status: "Approved",
      fromDate: { $gte: joiningDate },
    });

    const usedLeaves = approvedLeaves.reduce((sum, l) => sum + (l.daysApplied || 0), 0);

    res.status(200).json({
      msg: "✅ Leave summary fetched successfully",
      joiningDate,
      allowedLeaves,
      usedLeaves,
      remainingLeaves: allowedLeaves - usedLeaves,
    });
  } catch (error) {
    console.error("❌ Error fetching leave summary:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
