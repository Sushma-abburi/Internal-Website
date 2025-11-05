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
// const ProfessionalDetails = require("../models/professionalDetails");
// const { blobServiceClient, containerName } = require("../config/azureBlob");
// const path = require("path");
// const fs = require("fs");

// // 🟢 Upload file to Azure Blob
// async function uploadToAzure(localFilePath) {
//   try {
//     if (!localFilePath || !fs.existsSync(localFilePath)) {
//       console.error("❌ File not found:", localFilePath);
//       return null;
//     }

//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     await containerClient.createIfNotExists({ access: "container" });

//     const blobName = path.basename(localFilePath);
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//     await blockBlobClient.uploadFile(localFilePath);
//     console.log("✅ Uploaded to Azure:", blockBlobClient.url);

//     // delete local file
//     fs.unlink(localFilePath, (err) => {
//       if (err) console.warn("⚠️ Could not delete local file:", err.message);
//     });

//     return blockBlobClient.url;
//   } catch (err) {
//     console.error("❌ Azure upload failed:", err.message);
//     return null;
//   }
// }

// // 🟢 Save / Update Professional Details
// exports.saveProfessionalDetails = async (req, res) => {
//   try {
//     const {
//       empId,
//       companyName,
//       companyLocation,
//       designation,
//       joiningDate,
//       leavingDate,
//       duration,
//       roles,
//       projects,
//       skills,
//       salary,
//       hrName,
//       hrEmail,
//       hrPhone,
//       managerName,
//       managerEmail,
//       managerPhone,
//     } = req.body;

//     if (!empId) {
//       return res.status(400).json({ msg: "Employee ID is required" });
//     }

//     console.log("📁 Uploaded Files:", req.files);

//     // Single file upload handler
//     const uploadFileField = async (fieldName) => {
//       const file = req.files?.[fieldName]?.[0];
//       if (file) {
//         const localPath = path.resolve(file.path);
//         const azureUrl = await uploadToAzure(localPath);
//         return {
//           filename: file.filename,
//           originalname: file.originalname,
//           mimetype: file.mimetype,
//           size: file.size,
//           path: file.path,
//           filePathUrl: azureUrl,
//         };
//       }
//       return null;
//     };

//     // Multiple file upload handler
//     const uploadMultipleFiles = async (fieldName) => {
//       const files = req.files?.[fieldName] || [];
//       const uploadedFiles = [];
//       for (const file of files) {
//         const localPath = path.resolve(file.path);
//         const azureUrl = await uploadToAzure(localPath);
//         uploadedFiles.push({
//           filename: file.filename,
//           originalname: file.originalname,
//           mimetype: file.mimetype,
//           size: file.size,
//           path: file.path,
//           filePathUrl: azureUrl,
//         });
//       }
//       return uploadedFiles;
//     };

//     const profilePicture = await uploadFileField("profilePicture");
//     const relievingLetter = await uploadFileField("relievingLetter");
//     const salarySlips = await uploadMultipleFiles("salarySlips");

//     const updatedDetails = await ProfessionalDetails.findOneAndUpdate(
//       { empId },
//       {
//         empId,
//         companyName,
//         companyLocation,
//         designation,
//         joiningDate,
//         leavingDate,
//         duration,
//         roles,
//         projects,
//         skills,
//         salary,
//         hrName,
//         hrEmail,
//         hrPhone,
//         managerName,
//         managerEmail,
//         managerPhone,
//         ...(profilePicture && { profilePicture }),
//         ...(relievingLetter && { relievingLetter }),
//         ...(salarySlips.length && { salarySlips }),
//       },
//       { new: true, upsert: true }
//     );

//     res.status(200).json({
//       msg: "✅ Professional details saved successfully",
//       data: updatedDetails,
//     });
//   } catch (error) {
//     console.error("❌ Error saving professional details:", error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };

// // 🟢 Get All Professional Details
// exports.getAllProfessionalDetails = async (req, res) => {
//   try {
//     const details = await ProfessionalDetails.find();
//     if (details.length === 0) {
//       return res.status(404).json({ msg: "No professional details found", data: [] });
//     }
//     res.status(200).json(details);
//   } catch (err) {
//     console.error("❌ Error fetching professional details:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// };

// // 🟢 Get Professional Details by Employee ID
// exports.getProfessionalDetailsByEmpId = async (req, res) => {
//   try {
//     const { empId } = req.params;
//     const details = await ProfessionalDetails.findOne({ empId });

//     if (!details) {
//       return res.status(404).json({ msg: "Professional details not found" });
//     }

//     res.status(200).json(details);
//   } catch (err) {
//     console.error("❌ Error fetching professional details:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// };
// const ProfessionalDetails = require("../models/professionalDetails");
// const { blobServiceClient, containerName } = require("../config/azureBlob");
// const path = require("path");
// const fs = require("fs");

// // 🔹 Upload file to Azure Blob Storage
// async function uploadToAzure(localFilePath) {
//   try {
//     if (!localFilePath || !fs.existsSync(localFilePath)) {
//       console.error("❌ File not found:", localFilePath);
//       return null;
//     }

//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     await containerClient.createIfNotExists({ access: "container" });

//     const blobName = path.basename(localFilePath);
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     await blockBlobClient.uploadFile(localFilePath);

//     console.log("✅ Uploaded to Azure:", blockBlobClient.url);

//     // Remove local file after upload
//     fs.unlink(localFilePath, (err) => {
//       if (err) console.warn("⚠️ Could not delete local file:", err.message);
//     });

//     return blockBlobClient.url;
//   } catch (err) {
//     console.error("❌ Azure upload failed:", err.message);
//     return null;
//   }
// }

// // 🔹 Save Professional Details (with experiences + file upload)
// exports.saveProfessionalDetails = async (req, res) => {
//   try {
//     console.log("📥 Incoming body:", req.body);
//     console.log("📎 Uploaded files:", req.files);

//     const {
//       employeeId,
//       dateOfJoining,
//       role,
//       department,
//       salary,
//       hasExperience,
//       experiences,
//     } = req.body;

//     if (!employeeId || !dateOfJoining || !role || !department || !salary) {
//       return res.status(400).json({ msg: "All mandatory fields are required" });
//     }

//     let experienceArray = [];

//     // If experiences exist, parse and attach file URLs
//     if (experiences) {
//       const parsed = JSON.parse(experiences); // because form-data sends JSON as string
//       experienceArray = await Promise.all(
//         parsed.map(async (exp, index) => {
//           const relivingLetterFile = req.files?.[`experiences[${index}][relivingLetter]`]?.[0];
//           const salarySlipsFile = req.files?.[`experiences[${index}][salarySlips]`]?.[0];

//           const relivingLetterUrl = relivingLetterFile
//             ? await uploadToAzure(path.resolve(relivingLetterFile.path))
//             : null;
//           const salarySlipsUrl = salarySlipsFile
//             ? await uploadToAzure(path.resolve(salarySlipsFile.path))
//             : null;

//           return {
//             ...exp,
//             relivingLetter: relivingLetterUrl,
//             salarySlips: salarySlipsUrl,
//           };
//         })
//       );
//     }

//     const professionalData = {
//       employeeId,
//       dateOfJoining,
//       role,
//       department,
//       salary,
//       hasExperience: hasExperience === "true" || hasExperience === true,
//       experiences: experienceArray,
//     };

//     const saved = await ProfessionalDetails.findOneAndUpdate(
//       { employeeId },
//       professionalData,
//       { upsert: true, new: true }
//     );

//     res.status(200).json({
//       msg: "✅ Professional details saved successfully",
//       data: saved,
//     });
//   } catch (err) {
//     console.error("❌ Error saving professional details:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// };

// // 🔹 Get All
// exports.getAllProfessionalDetails = async (req, res) => {
//   try {
//     const details = await ProfessionalDetails.find();
//     res.status(200).json(details);
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// };

// // 🔹 Get by Employee ID
// exports.getProfessionalDetailsByEmpId = async (req, res) => {
//   try {
//     const { empId } = req.params;
//     const details = await ProfessionalDetails.findOne({ employeeId: empId });
//     if (!details) return res.status(404).json({ msg: "No details found" });
//     res.status(200).json(details);
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// };
// const ProfessionalDetails = require("../models/professionalDetails");
// const { blobServiceClient, containerName } = require("../config/azureBlob");
// const path = require("path");
// const fs = require("fs");

// // 🔹 Upload a single file to Azure Blob Storage
// async function uploadToAzure(localFilePath) {
//   try {
//     if (!localFilePath || !fs.existsSync(localFilePath)) {
//       console.error("❌ File not found:", localFilePath);
//       return null;
//     }

//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     await containerClient.createIfNotExists({ access: "container" });

//     const blobName = path.basename(localFilePath);
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//     await blockBlobClient.uploadFile(localFilePath);
//     console.log("✅ Uploaded to Azure:", blockBlobClient.url);

//     // delete local file after upload
//     fs.unlink(localFilePath, (err) => {
//       if (err) console.warn("⚠️ Could not delete local file:", err.message);
//     });

//     return blockBlobClient.url;
//   } catch (err) {
//     console.error("❌ Azure upload failed:", err.message);
//     return null;
//   }
// }

// // 🔹 Save or Update Professional Details
// exports.saveProfessionalDetails = async (req, res) => {
//   try {
//     console.log("📥 Incoming body:", req.body);
//     console.log("📎 Uploaded files summary:", req.files);

//     const {
//       employeeId,
//       dateOfJoining,
//       role,
//       department,
//       salary,
//       hasExperience,
//     } = req.body;

//     if (!employeeId) {
//       return res.status(400).json({ msg: "❌ Employee ID is required." });
//     }

//     // 🔸 Convert JSON string back to object if sent as text (Postman/FormData)
//     let experiences = [];
//     if (req.body.experiences) {
//       try {
//         experiences =
//           typeof req.body.experiences === "string"
//             ? JSON.parse(req.body.experiences)
//             : req.body.experiences;
//       } catch (err) {
//         console.error("❌ Error parsing experiences JSON:", err.message);
//       }
//     }

//     // 🔹 Map files to their respective experiences
//     if (experiences.length > 0 && req.files) {
//       for (let i = 0; i < experiences.length; i++) {
//         // For relivingLetter (single file)
//         const relivingLetterFile = req.files[`relivingLetter_${i}`]?.[0];
//         if (relivingLetterFile) {
//           const relivingLetterPath = path.resolve(relivingLetterFile.path);
//           const azureUrl = await uploadToAzure(relivingLetterPath);
//           experiences[i].relivingLetter = azureUrl;
//         }

//         // For salarySlips (multiple possible)
//         const salarySlipFile = req.files[`salarySlips_${i}`]?.[0];
//         if (salarySlipFile) {
//           const salarySlipPath = path.resolve(salarySlipFile.path);
//           const azureUrl = await uploadToAzure(salarySlipPath);
//           experiences[i].salarySlips = azureUrl;
//         }
//       }
//     }

//     // 🔹 Save or update ProfessionalDetails
//     const updated = await ProfessionalDetails.findOneAndUpdate(
//       { employeeId },
//       {
//         employeeId,
//         dateOfJoining,
//         role,
//         department,
//         salary,
//         hasExperience,
//         experiences,
//       },
//       { new: true, upsert: true }
//     );

//     res.status(200).json({
//       msg: "✅ Professional details saved successfully",
//       data: updated,
//     });
//   } catch (error) {
//     console.error("❌ Error saving professional details:", error);
//     res.status(500).json({ msg: "Server Error", error: error.message });
//   }
// };

// // 🔹 Get All Professional Details
// exports.getAllProfessionalDetails = async (req, res) => {
//   try {
//     const details = await ProfessionalDetails.find();
//     if (!details.length) {
//       return res.status(404).json({ msg: "No professional details found." });
//     }
//     res.status(200).json(details);
//   } catch (err) {
//     console.error("❌ Error fetching professional details:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// };

// // 🔹 Get Details by Employee ID
// exports.getProfessionalDetailsByEmpId = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const details = await ProfessionalDetails.findOne({ employeeId });

//     if (!details) {
//       return res.status(404).json({ msg: "Professional details not found." });
//     }

//     res.status(200).json(details);
//   } catch (err) {
//     console.error("❌ Error fetching details by empId:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// };
const ProfessionalDetails = require("../models/professionalDetails");
const { blobServiceClient, containerName } = require("../config/azureBlob");
const path = require("path");
const fs = require("fs");

// 🔹 Upload a single file to Azure Blob Storage
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

// 🔹 Save or Update Professional Details
exports.saveProfessionalDetails = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);
    console.log("📎 Uploaded files summary:", Object.keys(req.files || {}));

    const { employeeId, dateOfJoining, role, department, salary, hasExperience } = req.body;

    if (!employeeId) {
      return res.status(400).json({ msg: "❌ Employee ID is required." });
    }

    // Parse experiences properly
    let experiences = [];
    if (req.body.experiences) {
      try {
        experiences =
          typeof req.body.experiences === "string"
            ? JSON.parse(req.body.experiences)
            : req.body.experiences;
      } catch (err) {
        console.error("❌ Error parsing experiences JSON:", err.message);
      }
    }

    // 🔹 Match files for each experience
    if (req.files && experiences.length > 0) {
      for (let i = 0; i < experiences.length; i++) {
        // Handle relivingLetter
        const relivingLetterFile = req.files[`experiences[${i}][relivingLetter]`]?.[0];
        if (relivingLetterFile) {
          const azureUrl = await uploadToAzure(relivingLetterFile.path);
          experiences[i].relivingLetter = azureUrl;
        }

        // Handle salarySlips
        const salarySlipFile = req.files[`experiences[${i}][salarySlips]`]?.[0];
        if (salarySlipFile) {
          const azureUrl = await uploadToAzure(salarySlipFile.path);
          experiences[i].salarySlips = azureUrl;
        }
      }
    }

    // 🔹 Save or update record
    const updated = await ProfessionalDetails.findOneAndUpdate(
      { employeeId },
      {
        employeeId,
        dateOfJoining,
        role,
        department,
        salary,
        hasExperience,
        experiences,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      msg: "✅ Professional details saved successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error saving professional details:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// 🔹 Get All Professional Details
exports.getAllProfessionalDetails = async (req, res) => {
  try {
    const details = await ProfessionalDetails.find();
    if (!details.length) {
      return res.status(404).json({ msg: "No professional details found." });
    }
    res.status(200).json(details);
  } catch (err) {
    console.error("❌ Error fetching professional details:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// 🔹 Get Details by Employee ID
exports.getProfessionalDetailsByEmpId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const details = await ProfessionalDetails.findOne({ employeeId });

    if (!details) {
      return res.status(404).json({ msg: "Professional details not found." });
    }

    res.status(200).json(details);
  } catch (err) {
    console.error("❌ Error fetching details by empId:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
