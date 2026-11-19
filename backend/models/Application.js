const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        resume: {
            type: String,
            default: ""
        },

        coverLetter: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Under Review",
                "Shortlisted",
                "Rejected",
                "Hired"
            ],
            default: "Pending"
        },

        appliedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Prevent the same user from applying to the same job twice
applicationSchema.index(
    { job: 1, applicant: 1 },
    { unique: true }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;