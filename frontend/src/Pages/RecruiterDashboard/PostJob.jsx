
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import './PostJob.css'

const PostJob = () => {

    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "null")

    const [unreadCount, setUnreadCount] = useState(0)


useEffect(() => {

    const fetchUnreadCount = async () => {

        try {
            const response = await axios.get(
                "http://localhost:5000/api/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const unread = response.data.notifications.filter(
                notification => !notification.isRead
            ).length

            setUnreadCount(unread)

        } catch (error) {
            console.log("Error fetching unread notifications:", error)
        }
    }

    fetchUnreadCount()

}, [token])

    const [formData, setFormData] = useState({
        title: "",
        company: user?.companyName || "",
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

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
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

            await axios.post(
                "http://localhost:5000/api/jobs",
                jobData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert("Job posted successfully!")

            navigate("/recruiter/dashboard")

        } catch (error) {

            console.log("Error posting job:", error)

            setError(
                error.response?.data?.message ||
                "Unable to post job. Please try again."
            )

        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="post-job-page">

            {/* Sidebar */}
            <aside className="post-job-sidebar">

                <h2>TalentBridge</h2>

                <nav>
                    <Link to="/recruiter/dashboard">
                        Dashboard
                    </Link>

                    <Link
                        to="/recruiter/post-job"
                        className="active"
                    >
                        Post a Job
                    </Link>

                    <Link to="/recruiter/my-jobs">
                        My Jobs
                    </Link>

                    <Link to="/recruiter/applicants">
                        Applicants
                    </Link>

                    <Link to="/recruiter/company-profile">
                        Company Profile
                    </Link>

                    <Link
    to="/recruiter/notifications"
    className="sidebar-notification-link"
>
    <Bell size={18} />
    <span>Notifications</span>

    {unreadCount > 0 && (
        <span className="notification-badge">
            {unreadCount}
        </span>
    )}
</Link>
                </nav>

            </aside>


            {/* Main Content */}
            <main className="post-job-content">

                <div className="post-job-header">

                    <div>
                        <h1>Post a New Job</h1>
                        <p>
                            Fill in the details to create a new job
                            opportunity.
                        </p>
                    </div>

                    <Link
                        to="/recruiter/dashboard"
                        className="back-button"
                    >
                        Back to Dashboard
                    </Link>

                </div>


                <form
                    className="post-job-form"
                    onSubmit={handleSubmit}
                >

                    {/* Basic Information */}
                    <div className="form-section">

                        <h2>Basic Information</h2>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Job Title *</label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Frontend Developer"
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Company Name *</label>

                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Job Location *</label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Bangalore"
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Job Type *</label>

                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>


                            <div className="form-group">
                                <label>Work Mode *</label>

                                <select
                                    name="workMode"
                                    value={formData.workMode}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="On-site">On-site</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>


                            <div className="form-group">
                                <label>Experience Required *</label>

                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="e.g. 0-2 years"
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Salary *</label>

                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. 3-5 LPA"
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Number of Vacancies *</label>

                                <input
                                    type="number"
                                    name="vacancies"
                                    value={formData.vacancies}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Application Deadline *</label>

                                <input
                                    type="date"
                                    name="applicationDeadline"
                                    value={formData.applicationDeadline}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                />
                            </div>

                        </div>

                    </div>


                    {/* Job Description */}
                    <div className="form-section">

                        <h2>Job Description</h2>

                        <div className="form-group">

                            <label>Job Description *</label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the role and responsibilities..."
                                rows="6"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Requirements *</label>

                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                placeholder={"Enter each requirement on a new line"}
                                rows="5"
                                required
                            />

                            <small>
                                Enter each requirement on a separate line.
                            </small>

                        </div>


                        <div className="form-group">

                            <label>Required Skills *</label>

                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, JavaScript, HTML, CSS"
                                required
                            />

                            <small>
                                Separate skills using commas.
                            </small>

                        </div>

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}


                    {/* Buttons */}
                    <div className="form-buttons">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate("/recruiter/dashboard")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? "Posting..." : "Publish Job"}
                        </button>

                    </div>

                </form>

            </main>

        </div>
    )
}

export default PostJob
