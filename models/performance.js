const mongoose = require("mongoose");
const performanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: String,
  designation: String,
  experience: String
});
module.exports = mongoose.model("performance", performanceSchema);