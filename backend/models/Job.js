
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract"],
            required: true
        },

        workMode: {
            type: String,
            enum: ["On-site", "Remote", "Hybrid"],
            required: true
        },

        experience: {
            type: String,
            required: true
        },

        salary: {
            type: String,
            default: "Not disclosed"
        },

        description: {
            type: String,
            required: true
        },

        requirements: {
            type: [String],
            default: []
        },

        skills: {
            type: [String],
            default: []
        },

        vacancies: {
            type: Number,
            default: 1
        },

        applicationDeadline: {
            type: Date,
            required: true
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["Active", "Closed"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
