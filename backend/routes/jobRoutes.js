const express = require("express");
const router = express.Router();

// const { createJob } = require("../controllers/jobController");
const {
    createJob,
    getAllJobs,
    getMyJobs,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Get jobs posted by the logged-in recruiter
router.get("/my-jobs", protect, authorizeRoles("recruiter"), getMyJobs);

// Create job - Recruiter only
router.post("/", protect, authorizeRoles("recruiter"), createJob);

// Update job - Recruiter only
router.put("/:id", protect, authorizeRoles("recruiter"), updateJob);

// Delete job - Recruiter only
router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);

// Get all available jobs
router.get("/", getAllJobs);

module.exports = router;