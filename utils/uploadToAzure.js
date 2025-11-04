const path = require("path");
const fs = require("fs");
const blobServiceClient = require("../config/azureBlob");

const containerName = process.env.AZURE_CONTAINER_NAME || "uploads";

async function uploadFileToAzure(localFilePath) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    await containerClient.createIfNotExists({ access: "container" });

    const blobName = path.basename(localFilePath);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadFile(localFilePath);

    return blockBlobClient.url; // This is the public URL
  } catch (err) {
    console.error("Azure upload failed:", err);
    throw err;
  }
}

module.exports = uploadFileToAzure;
