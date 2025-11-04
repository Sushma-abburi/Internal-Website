const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error("❌ Azure Storage connection string is missing in .env");
}

// ✅ Create the blob service client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

// ✅ Export both client and container name
const containerName = process.env.AZURE_CONTAINER_NAME || "uploads";

module.exports = { blobServiceClient, containerName };
