// const ProfessionalDetails = require("../models/professionalDetails");
// const path = require("path");

// exports.saveProfessionalDetails = async (req, res) => {
//   try {
//     const { empId, companyName, designation, joiningDate, leavingDate } = req.body;

//     if (!empId) return res.status(400).json({ msg: "Employee ID is required" });

//     console.log("📁 Uploaded Files:", req.files);

//     const profilePicture = req.files?.profilePicture?.[0] && {
//       filename: req.files.profilePicture[0].filename,
//       originalname: req.files.profilePicture[0].originalname,
//       mimetype: req.files.profilePicture[0].mimetype,
//       size: req.files.profilePicture[0].size,
//       path: `uploads/professional/${req.files.profilePicture[0].filename}`,
//     };

//     const relievingLetter = req.files?.relievingLetter?.[0] && {
//       filename: req.files.relievingLetter[0].filename,
//       originalname: req.files.relievingLetter[0].originalname,
//       mimetype: req.files.relievingLetter[0].mimetype,
//       size: req.files.relievingLetter[0].size,
//       path: `uploads/professional/${req.files.relievingLetter[0].filename}`,
//     };

//     const salarySlips =
//       req.files?.salarySlips?.map((file) => ({
//         filename: file.filename,
//         originalname: file.originalname,
//         mimetype: file.mimetype,
//         size: file.size,
//         path: `uploads/professional/${file.filename}`,
//       })) || [];

//     const details = await ProfessionalDetails.findOneAndUpdate(
//       { empId },
//       {
//         empId,
//         companyName,
//         designation,
//         joiningDate,
//         leavingDate,
//         ...(profilePicture && { profilePicture }),
//         ...(relievingLetter && { relievingLetter }),
//         ...(salarySlips.length && { salarySlips }),
//       },
//       { new: true, upsert: true }
//     );

//     res.status(200).json({
//       msg: "Professional details saved successfully",
//       data: details,
//     });
//   } catch (error) {
//     console.error("❌ Error saving professional details:", error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };

// // Optional: your GET routes
// exports.getAllProfessionalDetails = async (req, res) => {
//   try {
//     const details = await ProfessionalDetails.find();
//     res.json(details);
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching professional details" });
//   }
// };

// exports.getProfessionalDetailsByEmpId = async (req, res) => {
//   try {
//     const details = await ProfessionalDetails.findOne({ empId: req.params.empId });
//     if (!details) return res.status(404).json({ msg: "Not found" });
//     res.json(details);
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching professional details" });
//   }
// };
const ProfessionalDetails = require("../models/professionalDetails");
const { blobServiceClient, containerName } = require("../config/azureBlob");
const path = require("path");
const fs = require("fs");

// Upload file to Azure Blob
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

    // delete local file after upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.warn("⚠️ Could not delete local file:", err.message);
    });

    return blockBlobClient.url;
  } catch (err) {
    console.error("❌ Azure upload failed:", err.message);
    return null;
  }
}

// Save / Update Professional Details
exports.saveProfessionalDetails = async (req, res) => {
  try {
    const { empId, companyName, designation, joiningDate, leavingDate } = req.body;
    if (!empId) return res.status(400).json({ msg: "Employee ID is required" });

    console.log("📁 Uploaded Files:", req.files);

    const uploadFileField = async (fieldName) => {
      const file = req.files?.[fieldName]?.[0];
      if (file) {
        const localPath = path.resolve(file.path);
        const azureUrl = await uploadToAzure(localPath);
        return {
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: azureUrl, // store Azure URL instead of local path
        };
      }
      return null;
    };

    const uploadMultipleFiles = async (fieldName) => {
      const files = req.files?.[fieldName] || [];
      const uploadedFiles = [];
      for (const file of files) {
        const localPath = path.resolve(file.path);
        const azureUrl = await uploadToAzure(localPath);
        uploadedFiles.push({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: azureUrl,
        });
      }
      return uploadedFiles;
    };

    const profilePicture = await uploadFileField("profilePicture");
    const relievingLetter = await uploadFileField("relievingLetter");
    const salarySlips = await uploadMultipleFiles("salarySlips");

    const details = await ProfessionalDetails.findOneAndUpdate(
      { empId },
      {
        empId,
        companyName,
        designation,
        joiningDate,
        leavingDate,
        ...(profilePicture && { profilePicture }),
        ...(relievingLetter && { relievingLetter }),
        ...(salarySlips.length && { salarySlips }),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      msg: "✅ Professional details saved successfully",
      data: details,
    });
  } catch (error) {
    console.error("❌ Error saving professional details:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// GET All
exports.getAllProfessionalDetails = async (req, res) => {
  try {
    const details = await ProfessionalDetails.find();
    res.json(details);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching professional details" });
  }
};

// GET by empId
exports.getProfessionalDetailsByEmpId = async (req, res) => {
  try {
    const details = await ProfessionalDetails.findOne({ empId: req.params.empId });
    if (!details) return res.status(404).json({ msg: "Not found" });
    res.json(details);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching professional details" });
  }
};
