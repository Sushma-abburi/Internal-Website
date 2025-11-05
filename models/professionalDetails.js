// const mongoose = require("mongoose");

// // Reusable file metadata schema
// const fileSchema = new mongoose.Schema({
//   filename: String,
//   originalname: String,
//   mimetype: String,
//   size: Number,
//   path: String,          // local/temporary path
//   filePathUrl: String,   // Azure Blob URL
// }, { _id: false });

// // Experience details schema
// const experienceSchema = new mongoose.Schema({
//   companyName: String,
//   companyLocation: String,
//   jobTitle: String,
//   startDate: Date,
//   endDate: Date,
//   duration: String,
//   roles: String,
//   projects: String,
//   skills: String,
//   salary: String,
//   relievingLetter: fileSchema,
//   salarySlips: [fileSchema],
//   hrName: String,
//   hrEmail: String,
//   hrPhone: String,
//   managerName: String,
//   managerEmail: String,
//   managerPhone: String,
// }, { _id: false });

// // Professional Details schema
// const professionalDetailsSchema = new mongoose.Schema(
//   {
//     empId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     companyName: String,
//     companyLocation: String,
//     designation: String,
//     joiningDate: Date,
//     leavingDate: Date,
//     duration: String,
//     roles: String,
//     projects: String,
//     skills: String,
//     salary: String,

//     profilePicture: fileSchema,
//     relievingLetter: fileSchema,
//     salarySlips: [fileSchema],

//     hrName: String,
//     hrEmail: String,
//     hrPhone: String,

//     managerName: String,
//     managerEmail: String,
//     managerPhone: String,

//     experiences: [experienceSchema],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("ProfessionalDetails", professionalDetailsSchema);
const mongoose = require("mongoose");

// --------------------
// 🔹 Experience Schema
// --------------------
const experienceSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyLocation: { type: String, required: true },
    jobTitle: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: String }, // calculated client-side
    roles: { type: String, required: true },
    projects: { type: String, required: true },
    skills: { type: String, required: true },
    salary: { type: String, required: true },

    // File uploads — store as URLs (e.g., from Azure or AWS)
    relivingLetter: { type: String, required: true },
    salarySlips: { type: String, required: true },

    // HR details
    hrName: { type: String, required: true },
    hrEmail: { type: String, required: true },
    hrPhone: { type: String, required: true },

    // Manager details
    managerName: { type: String, required: true },
    managerEmail: { type: String, required: true },
    managerPhone: { type: String, required: true },
  },
  { _id: false } // disables auto _id for subdocs
);

// --------------------
// 🔹 Main Professional Schema
// --------------------
const professionalDetailsSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    dateOfJoining: { type: Date, required: true },
    role: { type: String, required: true },
    department: {
      type: String,
      enum: [
        "Engineering",
        "Human Resources",
        "Finance",
        "Marketing",
        "Operations",
        "Sales",
        "IT Support",
        "Administration",
      ],
      required: true,
    },
    salary: { type: String, required: true },

    // Optional experience details
    hasExperience: { type: Boolean, default: false },
    experiences: [experienceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfessionalDetails", professionalDetailsSchema);
