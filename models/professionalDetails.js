const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  path: String,
});

const professionalDetailsSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: String,
    designation: String,
    joiningDate: Date,
    leavingDate: Date,

    profilePicture: fileSchema, // single file
    relievingLetter: fileSchema, // single file
    salarySlips: [fileSchema], // multiple files
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfessionalDetails", professionalDetailsSchema);
