
const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");



const applyForJob = async (req, res) => {
    try {
        const { coverLetter } = req.body;
        const jobId = req.params.jobId;

        // Resume is required for every application
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload your resume"
            });
        }

        // Check whether the job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Check whether the job is active
        if (
            job.status !== "Active" ||
            job.applicationDeadline < new Date()
        ) {
            return res.status(400).json({
                message: "This job is no longer accepting applications"
            });
        }

        // Check whether the user is a job seeker
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({
                message: "Only job seekers can apply for jobs"
            });
        }

        // Prevent duplicate applications
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            resume: req.file.filename,
            coverLetter: coverLetter || ""
        });

        // Notify recruiter about the new application
        try {
            await Notification.create({
                recipient: job.recruiter,
                message: `${req.user.name} has applied for your job: ${job.title}.`,
                type: "new_application",
                relatedApplication: application._id
            });
        } catch (notificationError) {
            console.log(
                "Failed to create recruiter notification:",
                notificationError.message
            );
        }

        res.status(201).json({
            message: "Job application submitted successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to submit application",
            error: error.message
        });
    }
};



// Get applicants for a recruiter's job
const getJobApplicants = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Check whether the job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Check whether this recruiter owns the job
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only view applicants for your own jobs"
            });
        }

        // Fetch applications for this job
        const applications = await Application.find({ job: jobId })
            .populate("applicant", "name email phone location skills")
            .populate("job", "title company")
            .sort({ appliedAt: -1 });

        res.status(200).json({
            message: "Applicants fetched successfully",
            totalApplicants: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch applicants",
            error: error.message
        });
    }
};


// Update application status - Recruiter only

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.applicationId;

        const allowedStatuses = [
            "Pending",
            "Under Review",
            "Shortlisted",
            "Rejected",
            "Hired"
        ];

        // Validate status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        // Find application
        const application = await Application.findById(applicationId)
            .populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Check job ownership
        if (
            application.job.recruiter.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only update applications for your own jobs"
            });
        }

        // Store previous status
        const previousStatus = application.status;

        // Update status
        application.status = status;
        await application.save();

        // Create notification only when status changes
        if (previousStatus !== status) {
            await Notification.create({
                recipient: application.applicant,
                message: `Your application for ${application.job.title} has been updated to ${status}.`,
                type: "application_status",
                relatedApplication: application._id
            });
        }

        res.status(200).json({
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update application status",
            error: error.message
        });
    }
};


// Get applications submitted by the logged-in job seeker
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            applicant: req.user._id
        })
            .populate("job", "title company location jobType workMode salary")
            .sort({ appliedAt: -1 });

        res.status(200).json({
            message: "Your applications fetched successfully",
            totalApplications: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch your applications",
            error: error.message
        });
    }
};

const path = require("path");

// Download applicant resume - Recruiter only
const downloadApplicantResume = async (req, res) => {
    try {
        const application = await Application.findById(
            req.params.applicationId
        )
            .populate("job")
            .populate("applicant");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (
            application.job.recruiter.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only access resumes for your own jobs"
            });
        }

        // Use application resume or applicant's latest profile resume
        const resumePath = application.resume;
        // const resumePath =
        //     application.resume || application.applicant.resume;

        if (!resumePath) {
            return res.status(404).json({
                message: "Applicant has not uploaded a resume"
            });
        }

        const fileName = path.basename(resumePath);

        const filePath = path.join(
            __dirname,
            "../uploads/resumes",
            fileName
        );

        res.download(filePath, (error) => {
            if (error && !res.headersSent) {
                res.status(404).json({
                    message: "Resume file not found"
                });
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to download resume",
            error: error.message
        });
    }
};

module.exports = { applyForJob, getJobApplicants, updateApplicationStatus, getMyApplications, downloadApplicantResume };
