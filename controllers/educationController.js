// const EducationDetails = require("../models/educationDetails");
// const path = require("path");

// exports.saveEducationDetails = async (req, res) => {
//   try {
//     const { employee } = req.body;
//     if (!employee) {
//       return res.status(400).json({ msg: "Employee ID is required" });
//     }

//     // Debug logs to verify Multer input
//     console.log("📦 Uploaded files =>", req.files);
//     console.log("📩 Body fields =>", req.body);

//     // Safely get file path helper
//     const getFilePath = (fieldName) => {
//       return req.files && req.files[fieldName] && req.files[fieldName][0]
//         ? req.files[fieldName][0].path.replace(/\\/g, "/") // normalize for Windows
//         : null;
//     };

//     // Build full education data object
//     const educationData = {
//       employee,
//       tenth: {
//         schoolName: req.body.tenthSchoolName || "",
//         yearOfPassing: req.body.tenthYearOfPassing || "",
//         percentage: req.body.tenthPercentage || "",
//         certificate: getFilePath("tenthCertificate"),
//       },
//       intermediate: {
//         collegeName: req.body.intermediateCollegeName || "",
//         yearOfPassing: req.body.intermediateYearOfPassing || "",
//         percentage: req.body.intermediatePercentage || "",
//         certificate: getFilePath("intermediateCertificate"),
//       },
//       degree: {
//         collegeName: req.body.degreeCollegeName || "",
//         yearOfPassing: req.body.degreeYearOfPassing || "",
//         cgpa: req.body.degreeCgpa || "",
//         certificate: getFilePath("degreeCertificate"),
//       },
//       mtech: {
//         collegeName: req.body.mtechCollegeName || "",
//         yearOfPassing: req.body.mtechYearOfPassing || "",
//         cgpa: req.body.mtechCgpa || "",
//         certificate: getFilePath("mtechCertificate"),
//       },
//     };

//     // Save or update (upsert)
//     const updated = await EducationDetails.findOneAndUpdate(
//       { employee },
//       educationData,
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     return res.status(200).json({
//       msg: "✅ Education details saved successfully",
//       data: updated,
//     });
//   } catch (err) {
//     console.error("❌ Error saving education details:", err);
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };
const EducationDetails = require("../models/educationDetails");
const path = require("path");
const fs = require("fs");
const { blobServiceClient, containerName } = require("../config/azureBlob");

// ✅ Azure upload helper
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

// ✅ Save or update education details
exports.saveEducationDetails = async (req, res) => {
  try {
    const { employee } = req.body;
    if (!employee) return res.status(400).json({ msg: "Employee ID is required" });

    // Debug logs
    console.log("📦 Uploaded files =>", req.files);
    console.log("📩 Body fields =>", req.body);

    // Helper to get file path from multer
    const getFilePath = (fieldName) => {
      const file = req.files?.[fieldName]?.[0];
      return file ? path.resolve(file.path) : null;
    };

    // Upload each file to Azure (if exists)
    const tenthCertificateUrl = await uploadToAzure(getFilePath("tenthCertificate"));
    const interCertificateUrl = await uploadToAzure(getFilePath("intermediateCertificate"));
    const degreeCertificateUrl = await uploadToAzure(getFilePath("degreeCertificate"));
    const mtechCertificateUrl = await uploadToAzure(getFilePath("mtechCertificate"));

    const educationData = {
      employee,
      tenth: {
        schoolName: req.body.tenthSchoolName || "",
        yearOfPassing: req.body.tenthYearOfPassing || "",
        percentage: req.body.tenthPercentage || "",
        certificate: tenthCertificateUrl || "",
      },
      intermediate: {
        collegeName: req.body.intermediateCollegeName || "",
        yearOfPassing: req.body.intermediateYearOfPassing || "",
        percentage: req.body.intermediatePercentage || "",
        certificate: interCertificateUrl || "",
      },
      degree: {
        collegeName: req.body.degreeCollegeName || "",
        yearOfPassing: req.body.degreeYearOfPassing || "",
        cgpa: req.body.degreeCgpa || "",
        certificate: degreeCertificateUrl || "",
      },
      mtech: {
        collegeName: req.body.mtechCollegeName || "",
        yearOfPassing: req.body.mtechYearOfPassing || "",
        cgpa: req.body.mtechCgpa || "",
        certificate: mtechCertificateUrl || "",
      },
    };

    const updated = await EducationDetails.findOneAndUpdate(
      { employee },
      educationData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ msg: "✅ Education details saved successfully", data: updated });
  } catch (err) {
    console.error("❌ Error saving education details:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
