const mongoose = require("mongoose");

const personalDetailsSchema = new mongoose.Schema({
  employee: { type: String, required: true, unique: true },
  fatherName: String,
  motherName: String,
  gender: String,
  bloodGroup: String,
  currentAddress: String,
  permanentAddress: String,
  landmark: String,
  pincode: String,
  village: String,
  state: String,
  emergencyContactNumber: String,
  nominee1: String,
  nominee2: String,
  adharNumber: String,
  panNumber: String,
  adharFile: String, // Azure URL
  panFile: String,   // Azure URL
  marriageCertificate: String, // Azure URL
  empPhoto: String, // Azure URL
});

module.exports = mongoose.model("PersonalDetails", personalDetailsSchema);
