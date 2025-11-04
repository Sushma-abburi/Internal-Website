// const Leave = require("../models/leave");

// // 🟢 Create a new leave
// const createLeave = async (req, res) => {
//   try {
//     const {
//       employeeName,
//       employeeId,
//       fromDate,
//       toDate,
//       daysApplied,
//       leaveType,
//       customTypes,
//       reason,
//     } = req.body;

//     // File info (if uploaded)
//     const file = req.file
//       ? {
//           filename: req.file.filename,
//           originalname: req.file.originalname,
//           mimetype: req.file.mimetype,
//           size: req.file.size,
//           path: `uploads/leaves/${req.file.filename}`, // relative path
//         }
//       : null;

//     const leave = new Leave({
//       employeeName,
//       employeeId,
//       fromDate,
//       toDate,
//       daysApplied,
//       leaveType,
//       customTypes,
//       reason,
//       file,
//     });

//     await leave.save();
//     res.status(201).json({ msg: "Leave applied successfully", leave });
//   } catch (error) {
//     console.error("❌ Error saving leave:", error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };

// // 🟢 Get all leaves
// const getLeaves = async (req, res) => {
//   try {
//     const leaves = await Leave.find();
//     res.json(leaves);
//   } catch (error) {
//     res.status(500).json({ msg: "Error fetching leaves" });
//   }
// };

// // ✅ Export both functions (CommonJS style)
// module.exports = { createLeave, getLeaves };
const Leave = require("../models/leave");
const { blobServiceClient, containerName } = require("../config/azureBlob");
const fs = require("fs");
const path = require("path");

// ✅ Helper: Upload file to Azure Blob
async function uploadToAzure(localFilePath) {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("❌ File not found:", localFilePath);
      return null;
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: "container" });

    const blobName = path.basename(localFilePath);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadFile(localFilePath);
    console.log("✅ Uploaded to Azure:", blockBlobClient.url);

    // Delete local file after upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.warn("⚠️ Could not delete local file:", err.message);
    });

    return blockBlobClient.url;
  } catch (err) {
    console.error("❌ Azure upload failed:", err.message);
    return null;
  }
}

// 🟢 Create a new leave
exports.createLeave = async (req, res) => {
  try {
    const {
      employeeName,
      employeeId,
      fromDate,
      toDate,
      daysApplied,
      leaveType,
      customTypes,
      reason,
    } = req.body;

    // ✅ Handle file upload (if provided)
    let file = null;
    if (req.file) {
      const localPath = path.resolve(req.file.path);
      const azureUrl = await uploadToAzure(localPath);

      file = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: azureUrl, // store Azure URL here
      };
    }

    const leave = new Leave({
      employeeName,
      employeeId,
      fromDate,
      toDate,
      daysApplied,
      leaveType,
      customTypes,
      reason,
      file,
    });

    await leave.save();
    res.status(201).json({ msg: "✅ Leave applied successfully", leave });
  } catch (error) {
    console.error("❌ Error saving leave:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// 🟢 Get all leaves
exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching leaves" });
  }
};
