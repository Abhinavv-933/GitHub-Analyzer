const express = require("express");
const router = express.Router();
const { analyzeProfile, getAllProfiles, getProfile, deleteProfile } = require("../controllers/profileController");

router.post("/analyze/:username", analyzeProfile);
router.get("/profiles", getAllProfiles);
router.get("/profiles/:username", getProfile);
router.delete("/profiles/:username", deleteProfile);

module.exports = router;