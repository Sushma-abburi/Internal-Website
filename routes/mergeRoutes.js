const express = require("express");
const router = express.Router();
const { mergeAllCollections } = require("../controllers/mergeController");

// GET or POST route to trigger merge
router.get("/merge", mergeAllCollections);

module.exports = router;
