
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams, Link } from 'react-router-dom'
import './EditJob.css'

const EditJob = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        jobType: "Full-time",
        workMode: "On-site",
        experience: "",
        salary: "",
        description: "",
        requirements: "",
        skills: "",
        vacancies: 1,
        applicationDeadline: ""
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    // Fetch existing job details
    useEffect(() => {

        const getJobDetails = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:5000/api/jobs/my-jobs",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const jobs = response.data.jobs || []

                const job = jobs.find((item) => item._id === id)

                if (!job) {
                    setError("Job not found.")
                    return
                }

                setFormData({
                    title: job.title || "",
                    company: job.company || "",
                    location: job.location || "",
                    jobType: job.jobType || "Full-time",
                    workMode: job.workMode || "On-site",
                    experience: job.experience || "",
                    salary: job.salary || "",
                    description: job.description || "",
                    requirements: Array.isArray(job.requirements)
                        ? job.requirements.join("\n")
                        : job.requirements || "",
                    skills: Array.isArray(job.skills)
                        ? job.skills.join(", ")
                        : job.skills || "",
                    vacancies: job.vacancies || 1,
                    applicationDeadline: job.applicationDeadline
                        ? new Date(job.applicationDeadline)
                            .toISOString().split("T")[0]
                        : ""
                })

            } catch (error) {

                console.log("Error fetching job:", error)
                setError("Unable to load job details.")

            } finally {
                setLoading(false)
            }
        }

        getJobDetails()

    }, [id, token])


    // Handle form changes
    const handleChange = (e) => {

        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }


    // Update job
    const handleSubmit = async (e) => {

        e.preventDefault()

        setSaving(true)
        setError("")

        try {

            const jobData = {
                ...formData,

                skills: formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill !== ""),

                requirements: formData.requirements
                    .split("\n")
                    .map((item) => item.trim())
                    .filter((item) => item !== ""),

                vacancies: Number(formData.vacancies)
            }

            await axios.put(
                `http://localhost:5000/api/jobs/${id}`,
                jobData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert("Job updated successfully!")

            navigate("/recruiter/my-jobs")

        } catch (error) {

            console.log("Error updating job:", error)

            setError(
                error.response?.data?.message ||
                "Unable to update job."
            )

        } finally {
            setSaving(false)
        }
    }


    if (loading) {
        return (
            <div className="edit-job-loading">
                Loading job details...
            </div>
        )
    }

    return (

        <div className="edit-job-page">

            {/* Sidebar */}
            <aside className="edit-job-sidebar">

                <h2>TalentBridge</h2>

                <nav>

                    <Link to="/recruiter/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/recruiter/post-job">
                        Post a Job
                    </Link>

                    <Link
                        to="/recruiter/my-jobs"
                        className="active"
                    >
                        My Jobs
                    </Link>

                    <Link to="/recruiter/applicants">
                        Applicants
                    </Link>

                    <Link to="/recruiter/company-profile">
                        Company Profile
                    </Link>

                </nav>

            </aside>


            {/* Main Content */}
            <main className="edit-job-content">

                <div className="edit-job-header">

                    <div>
                        <h1>Edit Job</h1>
                        <p>
                            Update the information for your job posting.
                        </p>
                    </div>

                    <Link
                        to="/recruiter/my-jobs"
                        className="edit-back-button"
                    >
                        Back to My Jobs
                    </Link>

                </div>


                {error && (
                    <div className="edit-job-error">
                        {error}
                    </div>
                )}


                {!error && (

                    <form
                        className="edit-job-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Basic Information */}
                        <div className="edit-form-section">

                            <h2>Basic Information</h2>

                            <div className="edit-form-grid">

                                <div className="edit-form-group">
                                    <label>Job Title *</label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="edit-form-group">
                                    <label>Company Name *</label>

                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="edit-form-group">
                                    <label>Location *</label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="edit-form-group">
                                    <label>Job Type *</label>

                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>


                                <div className="edit-form-group">
                                    <label>Work Mode *</label>

                                    <select
                                        name="workMode"
                                        value={formData.workMode}
                                        onChange={handleChange}
                                    >
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>


                                <div className="edit-form-group">
                                    <label>Experience *</label>

                                    <input
                                        type="text"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="edit-form-group">
                                    <label>Salary *</label>

                                    <input
                                        type="text"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="edit-form-group">
                                    <label>Vacancies *</label>

                                    <input
                                        type="number"
                                        name="vacancies"
                                        value={formData.vacancies}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </div>


                                <div className="edit-form-group">
                                    <label>Application Deadline *</label>

                                    <input
                                        type="date"
                                        name="applicationDeadline"
                                        value={formData.applicationDeadline}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                        </div>


                        {/* Description */}
                        <div className="edit-form-section">

                            <h2>Job Description</h2>

                            <div className="edit-form-group">
                                <label>Description *</label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="6"
                                    required
                                />
                            </div>


                            <div className="edit-form-group">
                                <label>Requirements *</label>

                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                />

                                <small>
                                    Enter each requirement on a new line.
                                </small>
                            </div>


                            <div className="edit-form-group">
                                <label>Required Skills *</label>

                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    required
                                />

                                <small>
                                    Separate skills using commas.
                                </small>
                            </div>

                        </div>


                        {/* Buttons */}
                        <div className="edit-form-buttons">

                            <button
                                type="button"
                                className="edit-cancel-button"
                                onClick={() => navigate("/recruiter/my-jobs")}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="edit-save-button"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                        </div>

                    </form>

                )}

            </main>

        </div>
    )
}

export default EditJob
