const mongoose = require("mongoose");

const educationDetailsSchema = new mongoose.Schema({
  employee: {
    type: String,
    required: true,
    unique: true,
  },
  tenth: {
    schoolName: String,
    yearOfPassing: String,
    percentage: String,
    certificate: String,     // Local file path (uploads/tenth.pdf)
    certificateUrl: String,  // Azure Blob URL
  },
  intermediate: {
    collegeName: String,
    yearOfPassing: String,
    percentage: String,
    certificate: String,
    certificateUrl: String,
  },
  degree: {
    collegeName: String,
    yearOfPassing: String,
    cgpa: String,
    certificate: String,
    certificateUrl: String,
  },
  mtech: {
    collegeName: String,
    yearOfPassing: String,
    cgpa: String,
    certificate: String,
    certificateUrl: String,
  },
});

module.exports = mongoose.model("EducationDetails", educationDetailsSchema);
