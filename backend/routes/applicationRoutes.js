
const express = require("express");
const router = express.Router();

const { applyForJob, getJobApplicants, updateApplicationStatus, getMyApplications, downloadApplicantResume } = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Apply for a job - Job seeker only
router.post(
    "/:jobId",
    protect,
    authorizeRoles("jobseeker"),
    upload.single("resume"),
    applyForJob
);

// Get applicants for a job - Recruiter only
router.get(
    "/job/:jobId",
    protect,
    authorizeRoles("recruiter"),
    getJobApplicants
);

// Update application status - Recruiter only
router.put(
    "/:applicationId/status",
    protect,
    authorizeRoles("recruiter"),
    updateApplicationStatus
);

// Get my applications - Job seeker only
router.get(
    "/my-applications",
    protect,
    authorizeRoles("jobseeker"),
    getMyApplications
);

// Download applicant resume - Recruiter only
router.get(
    "/:applicationId/resume",
    protect,
    authorizeRoles("recruiter"),
    downloadApplicantResume
);

module.exports = router;
