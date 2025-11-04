const mongoose = require("mongoose");

// Reusable file metadata schema
const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  path: String,          // local/temporary path
  filePathUrl: String,   // Azure Blob URL
}, { _id: false });

// Experience details schema
const experienceSchema = new mongoose.Schema({
  companyName: String,
  companyLocation: String,
  jobTitle: String,
  startDate: Date,
  endDate: Date,
  duration: String,
  roles: String,
  projects: String,
  skills: String,
  salary: String,
  relievingLetter: fileSchema,
  salarySlips: [fileSchema],
  hrName: String,
  hrEmail: String,
  hrPhone: String,
  managerName: String,
  managerEmail: String,
  managerPhone: String,
}, { _id: false });

// Professional Details schema
const professionalDetailsSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: String,
    companyLocation: String,
    designation: String,
    joiningDate: Date,
    leavingDate: Date,
    duration: String,
    roles: String,
    projects: String,
    skills: String,
    salary: String,

    profilePicture: fileSchema,
    relievingLetter: fileSchema,
    salarySlips: [fileSchema],

    hrName: String,
    hrEmail: String,
    hrPhone: String,

    managerName: String,
    managerEmail: String,
    managerPhone: String,

    experiences: [experienceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfessionalDetails", professionalDetailsSchema);
