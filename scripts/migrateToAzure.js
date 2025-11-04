const mongoose = require("mongoose");
require("dotenv").config();
const uploadFileToAzure = require("../utils/uploadToAzure");

// Import your models
const Profile = require("../models/profile");
const Education = require("../models/educationDetails");
const Leave = require("../models/leave");
const Professional = require("../models/professionalDetails");

const MONGODB_URI = process.env.MONGODB_URI;

async function migrateModelFiles(Model, fileField = "filePath") {
  const docs = await Model.find({ [fileField]: { $ne: null } });

  for (const doc of docs) {
    try {
      const localFile = doc[fileField];
      if (!localFile) continue;

      const localPath = path.join(__dirname, "..", localFile);

      const azureUrl = await uploadFileToAzure(localPath);
      doc.fileUrl = azureUrl;
      await doc.save();

      console.log(`✅ Uploaded: ${localFile} → ${azureUrl}`);
    } catch (err) {
      console.error(`❌ Failed for ${doc._id}:`, err.message);
    }
  }
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  await migrateModelFiles(Profile, "profileImagePath");
  await migrateModelFiles(Education, "certificatePath");
  await migrateModelFiles(Leave, "filePath");
  await migrateModelFiles(Professional, "documentPath");

  console.log("🎉 Migration completed!");
  process.exit();
}

main();
