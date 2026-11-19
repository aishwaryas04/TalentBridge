
const express = require("express");
const router = express.Router();

const {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteJob,
    getAllApplications,
    deleteApplication,
    getAdminAnalytics
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Admin dashboard statistics
router.get(
    "/dashboard",
    protect,
    authorizeRoles("admin"),
    getDashboardStats
);

// Get all registered users
router.get(
    "/users",
    protect,
    authorizeRoles("admin"),
    getAllUsers
);

// Delete a registered user
router.delete(
    "/users/:id",
    protect,
    authorizeRoles("admin"),
    deleteUser
);

// Get all job postings
router.get(
    "/jobs",
    protect,
    authorizeRoles("admin"),
    getAllJobs
);

// Delete a job posting
router.delete(
    "/jobs/:id",
    protect,
    authorizeRoles("admin"),
    deleteJob
);

// Manage Applications
router.get(
    "/applications",
    protect,
    authorizeRoles("admin"),
    getAllApplications
);

router.delete(
    "/applications/:id",
    protect,
    authorizeRoles("admin"),
    deleteApplication
);
router.get(
    "/analytics",
    protect,
    authorizeRoles("admin"),
    getAdminAnalytics
);

module.exports = router;
