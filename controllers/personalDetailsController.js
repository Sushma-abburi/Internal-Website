// const PersonalDetails = require("../models/personalDetails");

// /**
//  * 📝 Save or Update Personal Details
//  */
// exports.savePersonalDetails = async (req, res) => {
//   try {
//     const {
//       employee,
//       fatherName,
//       motherName,
//       gender,
//       bloodGroup,
//       currentAddress,
//       permanentAddress,
//       landmark,
//       pincode,
//       village,
//       state,
//       emergencyContactNumber,
//       nominee1,
//       nominee2,
//       adharNumber,
//       panNumber,
//     } = req.body;

//     if (!employee) {
//       return res.status(400).json({ msg: "Employee ID is required" });
//     }

//     // Extract file paths from multer uploads
//     const adharFile = req.files["adharFile"]
//       ? req.files["adharFile"][0].path
//       : null;
//     const panFile = req.files["panFile"]
//       ? req.files["panFile"][0].path
//       : null;
//     const marriageCertificate = req.files["marriageCertificate"]
//       ? req.files["marriageCertificate"][0].path
//       : null;
//     const empPhoto = req.files["empPhoto"]
//       ? req.files["empPhoto"][0].path
//       : null;

//     // Check if personal details exist already for this employee
//     const existing = await PersonalDetails.findOne({ employee });

//     if (existing) {
//       // Update existing record
//       const updated = await PersonalDetails.findOneAndUpdate(
//         { employee },
//         {
//           fatherName,
//           motherName,
//           gender,
//           bloodGroup,
//           currentAddress,
//           permanentAddress,
//           landmark,
//           pincode,
//           village,
//           state,
//           emergencyContactNumber,
//           nominee1,
//           nominee2,
//           adharNumber,
//           adharFile: adharFile || existing.adharFile,
//           panNumber,
//           panFile: panFile || existing.panFile,
//           marriageCertificate: marriageCertificate || existing.marriageCertificate,
//           empPhoto: empPhoto || existing.empPhoto,
//         },
//         { new: true }
//       );

//       return res.status(200).json({
//         msg: "✅ Personal details updated successfully",
//         data: updated,
//       });
//     }

//     // Create new record
//     const personalDetails = new PersonalDetails({
//       employee,
//       fatherName,
//       motherName,
//       gender,
//       bloodGroup,
//       currentAddress,
//       permanentAddress,
//       landmark,
//       pincode,
//       village,
//       state,
//       emergencyContactNumber,
//       nominee1,
//       nominee2,
//       adharNumber,
//       adharFile,
//       panNumber,
//       panFile,
//       marriageCertificate,
//       empPhoto,
//     });

//     await personalDetails.save();
//     console.log("✅ Saved to DB:", personalDetails);


//     res.status(201).json({
//       msg: "✅ Personal details saved successfully",
//       data: personalDetails,
//     });
//   } catch (err) {
//     console.error("❌ Error saving personal details:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// };

// /**
//  * 📋 Fetch Personal Details by Employee ID
//  */
// exports.getPersonalDetails = async (req, res) => {
//   try {
//     const { employeeId } = req.params;

//     const details = await PersonalDetails.findOne({ employee: employeeId }).populate(
//       "employee",
//       "firstName lastName email phoneNumber"
//     );

//     if (!details) {
//       return res.status(404).json({ msg: "Personal details not found" });
//     }

//     res.status(200).json(details);
//   } catch (err) {
//     console.error("❌ Error fetching personal details:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// };
// const PersonalDetails = require("../models/personalDetails");
// const { blobServiceClient, containerName } = require("../config/azureBlob");
// const fs = require("fs");
// const path = require("path");

// // ✅ Helper: Upload file to Azure Blob
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

//     // Delete local file after upload
//     fs.unlink(localFilePath, (err) => {
//       if (err) console.warn("⚠️ Could not delete local file:", err.message);
//     });

//     return blockBlobClient.url;
//   } catch (err) {
//     console.error("❌ Azure upload failed:", err.message);
//     return null;
//   }
// }

// // ✅ Save or Update Personal Details
// exports.savePersonalDetails = async (req, res) => {
//   try {
//     const {
//       employee,
//       fatherName,
//       motherName,
//       gender,
//       bloodGroup,
//       currentAddress,
//       permanentAddress,
//       landmark,
//       pincode,
//       village,
//       state,
//       emergencyContactNumber,
//       nominee1,
//       nominee2,
//       adharNumber,
//       panNumber,
//     } = req.body;

//     if (!employee) {
//       return res.status(400).json({ msg: "Employee ID is required" });
//     }

//     console.log("📦 Uploaded Files:", req.files);

//     // ✅ Helper to extract local path
//     const getFilePath = (fieldName) => {
//       const file = req.files?.[fieldName]?.[0];
//       return file ? path.resolve(file.path) : null;
//     };

//     // ✅ Upload each file to Azure (if exists)
//     const adharUrl = await uploadToAzure(getFilePath("adharFile"));
//     const panUrl = await uploadToAzure(getFilePath("panFile"));
//     const marriageUrl = await uploadToAzure(getFilePath("marriageCertificate"));
//     const photoUrl = await uploadToAzure(getFilePath("empPhoto"));

//     const existing = await PersonalDetails.findOne({ employee });

//     if (existing) {
//       const updated = await PersonalDetails.findOneAndUpdate(
//         { employee },
//         {
//           fatherName,
//           motherName,
//           gender,
//           bloodGroup,
//           currentAddress,
//           permanentAddress,
//           landmark,
//           pincode,
//           village,
//           state,
//           emergencyContactNumber,
//           nominee1,
//           nominee2,
//           adharNumber,
//           adharFile: adharUrl || existing.adharFile,
//           panNumber,
//           panFile: panUrl || existing.panFile,
//           marriageCertificate: marriageUrl || existing.marriageCertificate,
//           empPhoto: photoUrl || existing.empPhoto,
//         },
//         { new: true }
//       );

//       return res.status(200).json({
//         msg: "✅ Personal details updated successfully",
//         data: updated,
//       });
//     }

//     // Create new record
//     const personalDetails = new PersonalDetails({
//       employee,
//       fatherName,
//       motherName,
//       gender,
//       bloodGroup,
//       currentAddress,
//       permanentAddress,
//       landmark,
//       pincode,
//       village,
//       state,
//       emergencyContactNumber,
//       nominee1,
//       nominee2,
//       adharNumber,
//       adharFile: adharUrl,
//       panNumber,
//       panFile: panUrl,
//       marriageCertificate: marriageUrl,
//       empPhoto: photoUrl,
//     });

//     await personalDetails.save();

//     res.status(201).json({
//       msg: "✅ Personal details saved successfully",
//       data: personalDetails,
//     });
//   } catch (err) {
//     console.error("❌ Error saving personal details:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// };

// // 📋 Fetch Personal Details by Employee ID
// //const PersonalDetails = require("../models/personalDetails");

// // 🟢 Get all
// exports.getAllPersonalDetails = async (req, res) => {
//   try {
//     const details = await PersonalDetails.find();
//     res.json(details);
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching personal details" });
//   }
// };

// // 🟢 Get by employeeId
// exports.getPersonalDetails = async (req, res) => {
//   try {
//     const details = await PersonalDetails.findOne({ empId: req.params.employeeId }); // 👈 match your schema field
//     if (!details)
//       return res.status(404).json({ msg: "Personal details not found" });
//     res.json(details);
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching personal details" });
//   }
// };
const PersonalDetails = require("../models/personalDetails");
const { blobServiceClient, containerName } = require("../config/azureBlob");
const fs = require("fs");
const path = require("path");

// 🔹 Upload a file to Azure Blob and return the URL
async function uploadToAzure(localFilePath) {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.warn("⚠️ File not found:", localFilePath);
      return null;
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: "container" });

    const blobName = path.basename(localFilePath);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(localFilePath);

    console.log("✅ Uploaded to Azure:", blockBlobClient.url);

    fs.unlink(localFilePath, (err) => {
      if (err) console.warn("⚠️ Failed to delete local file:", err.message);
    });

    return blockBlobClient.url;
  } catch (err) {
    console.error("❌ Azure upload failed:", err.message);
    return null;
  }
}

// 🔹 Save or Update Personal Details
exports.savePersonalDetails = async (req, res) => {
  try {
    console.log("📥 Incoming Body:", req.body);

    // Extract all body fields
    const {
      firstName,
      middleName,
      lastName,
      fatherName,
      motherName,
      email,
      phone,
      alternativePhone,
      gender,
      bloodGroup,
      currentAddress,
      sameAddress,
      permanentAddress,
      landmark,
      pincode,
      village,
      state,
      emergencyNumber,
      nominee1,
      nominee2,
      aadharNumber,
      panNumber,
      isMarried,
    } = req.body;

    // Helper for local file paths
    const getFilePath = (field) => {
      const file = req.files?.[field]?.[0];
      return file ? path.resolve(file.path) : null;
    };

    // Upload files to Azure
    const photoUrl = await uploadToAzure(getFilePath("photo"));
    const aadharUrl = await uploadToAzure(getFilePath("aadharUpload"));
    const panUrl = await uploadToAzure(getFilePath("panUpload"));
    const marriageUrl = await uploadToAzure(getFilePath("marriageCertificate"));

    // ✅ Find by email (assuming unique per employee)
    const existing = await PersonalDetails.findOne({ email });

    if (existing) {
      const updated = await PersonalDetails.findOneAndUpdate(
        { email },
        {
          firstName,
          middleName,
          lastName,
          fatherName,
          motherName,
          email,
          phone,
          alternativePhone,
          gender,
          bloodGroup,
          currentAddress,
          sameAddress,
          permanentAddress,
          landmark,
          pincode,
          village,
          state,
          emergencyNumber,
          nominee1,
          nominee2,
          aadharNumber,
          panNumber,
          isMarried,
          photo: photoUrl || existing.photo,
          aadharUpload: aadharUrl || existing.aadharUpload,
          panUpload: panUrl || existing.panUpload,
          marriageCertificate: marriageUrl || existing.marriageCertificate,
        },
        { new: true }
      );

      return res.status(200).json({
        msg: "✅ Personal details updated successfully",
        data: updated,
      });
    }

    // ✅ Create a new record
    const personalDetails = new PersonalDetails({
      firstName,
      middleName,
      lastName,
      fatherName,
      motherName,
      email,
      phone,
      alternativePhone,
      gender,
      bloodGroup,
      currentAddress,
      sameAddress,
      permanentAddress,
      landmark,
      pincode,
      village,
      state,
      emergencyNumber,
      nominee1,
      nominee2,
      aadharNumber,
      aadharUpload: aadharUrl,
      panNumber,
      panUpload: panUrl,
      isMarried,
      marriageCertificate: marriageUrl,
      photo: photoUrl,
    });

    await personalDetails.save();

    res.status(201).json({
      msg: "✅ Personal details saved successfully",
      data: personalDetails,
    });
  } catch (err) {
    console.error("❌ Error saving personal details:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// 🔹 Get all Personal Details
exports.getAllPersonalDetails = async (req, res) => {
  try {
    const details = await PersonalDetails.find();
    res.json(details);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching personal details" });
  }
};

// 🔹 Get by email (or change to _id if needed)
exports.getPersonalDetails = async (req, res) => {
  try {
    const details = await PersonalDetails.findOne({ email: req.params.email });
    if (!details)
      return res.status(404).json({ msg: "Personal details not found" });
    res.json(details);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching personal details" });
  }
};
