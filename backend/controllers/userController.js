
const User = require("../models/User");

// Get logged-in user's profile
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};


// Upload or update resume
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a resume"
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.resume = `/uploads/resumes/${req.file.filename}`;

        await user.save();

        res.status(200).json({
            message: "Resume uploaded successfully",
            resume: user.resume
        });

    } catch (error) {
        res.status(500).json({
            message: "Resume upload failed",
            error: error.message
        });
    }
};


// Update user profile
const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            location,
            skills,
            companyName,
            companyDescription,
            industry,
            website,
            companyEmail,
            companyPhone
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Common profile fields
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;

        // Job seeker fields
        if (user.role === "jobseeker" && skills !== undefined) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    message: "Skills must be an array"
                });
            }

            user.skills = skills;
        }

        // Recruiter company fields
        if (user.role === "recruiter") {
            if (companyName !== undefined) {
                user.companyName = companyName;
            }

            if (companyDescription !== undefined) {
                user.companyDescription = companyDescription;
            }

            if (industry !== undefined) {
                user.industry = industry;
            }

            if (website !== undefined) {
                user.website = website;
            }

            if (companyEmail !== undefined) {
                user.companyEmail = companyEmail;
            }

            if (companyPhone !== undefined) {
                user.companyPhone = companyPhone;
            }
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location,
                skills: user.skills,
                companyName: user.companyName,
                companyDescription: user.companyDescription,
                industry: user.industry,
                website: user.website,
                companyEmail: user.companyEmail,
                companyPhone: user.companyPhone,
                companyLogo: user.companyLogo,
                resume: user.resume
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Profile update failed",
            error: error.message
        });
    }
};


module.exports = {
    getMyProfile,
    uploadResume,
    updateProfile
};
