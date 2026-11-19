
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: ["jobseeker", "recruiter", "admin"],
            default: "jobseeker"
        },

        profilePicture: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        skills: {
            type: [String],
            default: []
        },

        resume: {
            type: String,
            default: ""
        },

        // Recruiter company details
        companyName: {
            type: String,
            default: ""
        },

        companyDescription: {
            type: String,
            default: ""
        },

        industry: {
            type: String,
            default: ""
        },

        website: {
            type: String,
            default: ""
        },

        companyEmail: {
            type: String,
            default: ""
        },

        companyPhone: {
            type: String,
            default: ""
        },

        companyLogo: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
