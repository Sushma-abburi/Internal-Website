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
const PersonalDetails = require("../models/personalDetails");
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

// ✅ Save or Update Personal Details
exports.savePersonalDetails = async (req, res) => {
  try {
    const {
      employee,
      fatherName,
      motherName,
      gender,
      bloodGroup,
      currentAddress,
      permanentAddress,
      landmark,
      pincode,
      village,
      state,
      emergencyContactNumber,
      nominee1,
      nominee2,
      adharNumber,
      panNumber,
    } = req.body;

    if (!employee) {
      return res.status(400).json({ msg: "Employee ID is required" });
    }

    console.log("📦 Uploaded Files:", req.files);

    // ✅ Helper to extract local path
    const getFilePath = (fieldName) => {
      const file = req.files?.[fieldName]?.[0];
      return file ? path.resolve(file.path) : null;
    };

    // ✅ Upload each file to Azure (if exists)
    const adharUrl = await uploadToAzure(getFilePath("adharFile"));
    const panUrl = await uploadToAzure(getFilePath("panFile"));
    const marriageUrl = await uploadToAzure(getFilePath("marriageCertificate"));
    const photoUrl = await uploadToAzure(getFilePath("empPhoto"));

    const existing = await PersonalDetails.findOne({ employee });

    if (existing) {
      const updated = await PersonalDetails.findOneAndUpdate(
        { employee },
        {
          fatherName,
          motherName,
          gender,
          bloodGroup,
          currentAddress,
          permanentAddress,
          landmark,
          pincode,
          village,
          state,
          emergencyContactNumber,
          nominee1,
          nominee2,
          adharNumber,
          adharFile: adharUrl || existing.adharFile,
          panNumber,
          panFile: panUrl || existing.panFile,
          marriageCertificate: marriageUrl || existing.marriageCertificate,
          empPhoto: photoUrl || existing.empPhoto,
        },
        { new: true }
      );

      return res.status(200).json({
        msg: "✅ Personal details updated successfully",
        data: updated,
      });
    }

    // Create new record
    const personalDetails = new PersonalDetails({
      employee,
      fatherName,
      motherName,
      gender,
      bloodGroup,
      currentAddress,
      permanentAddress,
      landmark,
      pincode,
      village,
      state,
      emergencyContactNumber,
      nominee1,
      nominee2,
      adharNumber,
      adharFile: adharUrl,
      panNumber,
      panFile: panUrl,
      marriageCertificate: marriageUrl,
      empPhoto: photoUrl,
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

// 📋 Fetch Personal Details by Employee ID
exports.getPersonalDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const details = await PersonalDetails.findOne({ employee: employeeId });

    if (!details) {
      return res.status(404).json({ msg: "Personal details not found" });
    }

    res.status(200).json(details);
  } catch (err) {
    console.error("❌ Error fetching personal details:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
