const Job = require("../models/Job");

// Create a new job
const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            jobType,
            workMode,
            experience,
            salary,
            description,
            requirements,
            skills,
            vacancies,
            applicationDeadline
        } = req.body;

        // Check required fields
        if (
            !title ||
            !company ||
            !location ||
            !jobType ||
            !workMode ||
            !experience ||
            !description ||
            !applicationDeadline
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        // Create job
        const job = await Job.create({
            title,
            company,
            location,
            jobType,
            workMode,
            experience,
            salary,
            description,
            requirements,
            skills,
            vacancies,
            applicationDeadline,
            recruiter: req.user._id
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create job",
            error: error.message
        });
    }
};
// Get all active jobs
// const getAllJobs = async (req, res) => {
//     try {
//         const jobs = await Job.find({
//             status: "Active",
//             applicationDeadline: { $gte: new Date() }
//         })
//         .populate("recruiter", "name companyName")
//         .sort({ createdAt: -1 });

//         res.status(200).json({
//             message: "Jobs fetched successfully",
//             totalJobs: jobs.length,
//             jobs
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Failed to fetch jobs",
//             error: error.message
//         });
//     }
// };

// Get all active jobs with search and filters

// Get all active jobs with search, filters and pagination
const getAllJobs = async (req, res) => {
    try {
        const {
            keyword,
            location,
            jobType,
            workMode
        } = req.query;

        // Pagination values
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        // Base filter
        const filter = {
            status: "Active",
            applicationDeadline: { $gte: new Date() }
        };

        // Search by title, company or description
        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { company: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ];
        }

        // Filter by location
        if (location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }

        // Filter by job type
        if (jobType) {
            filter.jobType = jobType;
        }

        // Filter by work mode
        if (workMode) {
            filter.workMode = workMode;
        }

        // Count matching jobs
        const totalJobs = await Job.countDocuments(filter);

        // Fetch paginated jobs
        const jobs = await Job.find(filter)
            .populate("recruiter", "name companyName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Jobs fetched successfully",
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message
        });
    }
};


const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            recruiter: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Your posted jobs fetched successfully",
            totalJobs: jobs.length,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch your jobs",
            error: error.message
        });
    }
};


// Update a job posted by the logged-in recruiter
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        // Check whether job exists
        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Check whether this recruiter owns the job
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only update your own jobs"
            });
        }

        // Update only the fields provided in the request
        const allowedFields = [
            "title",
            "company",
            "location",
            "jobType",
            "workMode",
            "experience",
            "salary",
            "description",
            "requirements",
            "skills",
            "vacancies",
            "applicationDeadline",
            "status"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                job[field] = req.body[field];
            }
        });

        const updatedJob = await job.save();

        res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update job",
            error: error.message
        });
    }
};


// Delete a job posted by the logged-in recruiter
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        // Check whether job exists
        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Check whether this recruiter owns the job
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only delete your own jobs"
            });
        }

        await job.deleteOne();

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



module.exports = { createJob, getAllJobs, getMyJobs, updateJob, deleteJob };
