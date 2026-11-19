const express = require("express");
const router = express.Router();

const {
    getMyProfile,
    uploadResume,
    updateProfile
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Get profile
router.get("/profile", protect, getMyProfile);

// Upload resume
router.post(
    "/upload-resume",
    protect,
    upload.single("resume"),
    uploadResume
);


// Update profile
router.put("/profile", protect, updateProfile);

module.exports = router;