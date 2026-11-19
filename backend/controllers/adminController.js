
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Fetch all statistics in parallel
        const [
            totalUsers,
            totalJobSeekers,
            totalRecruiters,
            totalJobs,
            activeJobs,
            closedJobs,
            totalApplications,
            pendingApplications,
            underReviewApplications,
            shortlistedApplications,
            rejectedApplications,
            hiredApplications
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "jobseeker" }),
            User.countDocuments({ role: "recruiter" }),

            Job.countDocuments(),
            Job.countDocuments({
                status: "Active",
                applicationDeadline: { $gte: new Date() }
            }),
            Job.countDocuments({ status: "Closed" }),

            Application.countDocuments(),
            Application.countDocuments({ status: "Pending" }),
            Application.countDocuments({ status: "Under Review" }),
            Application.countDocuments({ status: "Shortlisted" }),
            Application.countDocuments({ status: "Rejected" }),
            Application.countDocuments({ status: "Hired" })
        ]);

        // Send dashboard statistics
        res.status(200).json({
            message: "Dashboard statistics fetched successfully",

            stats: {
                users: {
                    total: totalUsers,
                    jobSeekers: totalJobSeekers,
                    recruiters: totalRecruiters
                },

                jobs: {
                    total: totalJobs,
                    active: activeJobs,
                    closed: closedJobs
                },

                applications: {
                    total: totalApplications,
                    pending: pendingApplications,
                    underReview: underReviewApplications,
                    shortlisted: shortlistedApplications,
                    rejected: rejectedApplications,
                    hired: hiredApplications
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};

// Get all registered users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Users fetched successfully",
            totalUsers: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


// Delete a registered user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Prevent admin from deleting their own account
        if (userId === req.user._id.toString()) {
            return res.status(400).json({
                message: "You cannot delete your own admin account"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // If the user is a job seeker, delete their applications
        if (user.role === "jobseeker") {
            await Application.deleteMany({
                applicant: userId
            });
        }

        // If the user is a recruiter, delete their jobs and related applications
        if (user.role === "recruiter") {
            const recruiterJobs = await Job.find({
                recruiter: userId
            }).select("_id");

            const jobIds = recruiterJobs.map(job => job._id);

            await Application.deleteMany({
                job: { $in: jobIds }
            });

            await Job.deleteMany({
                recruiter: userId
            });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        });
    }
};


// Get all job postings
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("recruiter", "name email companyName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Jobs fetched successfully",
            totalJobs: jobs.length,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message
        });
    }
};



// Delete a job posting
const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Delete applications associated with this job
        await Application.deleteMany({
            job: jobId
        });

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        res.status(200).json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete job",
            error: error.message
        });
    }
};


// Get all job applications
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("applicant", "name email phone")
            .populate({
                path: "job",
                select: "title company location recruiter",
                populate: {
                    path: "recruiter",
                    select: "name email companyName"
                }
            })
            .sort({ appliedAt: -1 });

        res.status(200).json({
            message: "Applications fetched successfully",
            totalApplications: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch applications",
            error: error.message
        });
    }
};


// Delete an application
const deleteApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        await Application.findByIdAndDelete(applicationId);

        res.status(200).json({
            message: "Application deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete application",
            error: error.message
        });
    }
};


// Get admin analytics
const getAdminAnalytics = async (req, res) => {
    try {
        const currentDate = new Date();
        const range = req.query.range || "6months";

        let startDate;
        let groupByDay = false;

        switch (range) {
            case "7days":
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - 7);
                groupByDay = true;
                break;

            case "30days":
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - 30);
                groupByDay = true;
                break;

            case "1year":
                startDate = new Date(
                    currentDate.getFullYear() - 1,
                    currentDate.getMonth(),
                    currentDate.getDate()
                );
                break;

            case "6months":
            default:
                startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 5,
                    1
                );
                break;
        }

        const dateGroup = groupByDay
            ? {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" }
            }
            : {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
            };

        const [
            userTrends,
            jobTrends,
            applicationTrends,
            recruiterActivity,
            applicationStatus
        ] = await Promise.all([

            // User registration trends
            User.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate,
                            $lte: currentDate
                        },
                        role: { $in: ["jobseeker", "recruiter"] }
                    }
                },
                {
                    $group: {
                        _id: {
                            ...dateGroup,
                            role: "$role"
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
            ]),

            // Job posting trends
            Job.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate,
                            $lte: currentDate
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            ...(groupByDay && {
                                day: { $dayOfMonth: "$createdAt" }
                            })
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
            ]),

            // Application trends
            Application.aggregate([
                {
                    $match: {
                        appliedAt: {
                            $gte: startDate,
                            $lte: currentDate
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$appliedAt" },
                            month: { $month: "$appliedAt" },
                            ...(groupByDay && {
                                day: { $dayOfMonth: "$appliedAt" }
                            })
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
            ]),

            // Top recruiters within selected range
            Job.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate,
                            $lte: currentDate
                        }
                    }
                },
                {
                    $group: {
                        _id: "$recruiter",
                        totalJobs: { $sum: 1 }
                    }
                },
                { $sort: { totalJobs: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "recruiter"
                    }
                },
                { $unwind: "$recruiter" },
                {
                    $project: {
                        _id: 1,
                        name: "$recruiter.name",
                        companyName: "$recruiter.companyName",
                        totalJobs: 1
                    }
                }
            ]),

            // Application status breakdown
            Application.aggregate([
                {
                    $match: {
                        appliedAt: {
                            $gte: startDate,
                            $lte: currentDate
                        }
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        res.status(200).json({
            message: "Admin analytics fetched successfully",
            selectedRange: range,
            analytics: {
                userTrends,
                jobTrends,
                applicationTrends,
                recruiterActivity,
                applicationStatus
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch admin analytics",
            error: error.message
        });
    }
};



module.exports = { getDashboardStats, getAllUsers, deleteUser, getAllJobs, deleteJob, getAllApplications, deleteApplication, getAdminAnalytics };
