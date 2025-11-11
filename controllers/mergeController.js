const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const PersonalDetails = require("../models/personalDetails");
const EducationDetails = require("../models/educationDetails");
const ProfessionalDetails = require("../models/professionalDetails");

// Define new model for merged collection
const Merged = mongoose.model("Merged", new mongoose.Schema({}, { strict: false }), "mergedemployees");

// 🧩 Merge all collections into one
exports.mergeAllCollections = async (req, res) => {
  try {
    const collections = [
      { name: "employees", model: Employee },
      { name: "personaldetails", model: PersonalDetails },
      { name: "educationdetails", model: EducationDetails },
      { name: "professionaldetails", model: ProfessionalDetails },
    ];

    let totalInserted = 0;

    for (const { name, model } of collections) {
      console.log(`📦 Fetching from ${name}...`);
      const docs = await model.find({});

      if (docs.length === 0) {
        console.log(`⚠️ No records found in ${name}`);
        continue;
      }

      // Remove duplicate _id and add label
      const cleanedDocs = docs.map((d) => {
        const obj = d.toObject();
        delete obj._id;
        obj.sourceCollection = name;
        return obj;
      });

      await Merged.insertMany(cleanedDocs);
      console.log(`✅ Inserted ${cleanedDocs.length} from ${name}`);
      totalInserted += cleanedDocs.length;
    }

    console.log(`🎉 Merge complete — Total ${totalInserted} documents inserted!`);
    res.status(200).json({
      msg: "All collections merged successfully",
      inserted: totalInserted,
    });
  } catch (error) {
    console.error("❌ Error merging:", error);
    res.status(500).json({
      msg: "Error merging collections",
      error: error.message,
    });
  }
};
