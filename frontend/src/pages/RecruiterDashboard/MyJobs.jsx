
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import './MyJobs.css'

const MyJobs = () => {

    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)

    // Fetch recruiter's jobs
    const getMyJobs = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/jobs/my-jobs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setJobs(response.data.jobs || [])

        } catch (error) {

            console.log("Error fetching jobs:", error)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getMyJobs()
    }, [])

    // Fetch unread notification count
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

    // Delete job
    const handleDelete = async (jobId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        )

        if (!confirmDelete) return

        try {

            await axios.delete(
                `http://localhost:5000/api/jobs/${jobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert("Job deleted successfully!")

            setJobs((prevJobs) =>
                prevJobs.filter((job) => job._id !== jobId)
            )

        } catch (error) {

            console.log("Error deleting job:", error)

            alert(
                error.response?.data?.message ||
                "Unable to delete job."
            )
        }
    }

    // Logout
    const logout = () => {

        localStorage.removeItem("token")
        localStorage.removeItem("user")

        navigate("/login")
    }

    return (

        <div className="my-jobs-page">

            {/* Sidebar */}
            <aside className="my-jobs-sidebar">

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

                <button onClick={logout}>
                    Logout
                </button>

            </aside>


            {/* Main Content */}
            <main className="my-jobs-content">

                {/* Header */}
                <div className="my-jobs-header">

                    <div>
                        <h1>My Jobs</h1>
                        <p>
                            Manage all the job opportunities you have posted.
                        </p>
                    </div>

                    <Link
                        to="/recruiter/post-job"
                        className="add-job-button"
                    >
                        + Post New Job
                    </Link>

                </div>


                {/* Job Statistics */}
                <div className="my-jobs-stats">

                    <div className="my-job-stat-card">
                        <h3>{jobs.length}</h3>
                        <p>Total Jobs</p>
                    </div>

                    <div className="my-job-stat-card">
                        <h3>
                            {jobs.filter(
                                (job) => job.status === "Active"
                            ).length}
                        </h3>
                        <p>Active Jobs</p>
                    </div>

                    <div className="my-job-stat-card">
                        <h3>
                            {jobs.filter(
                                (job) => job.status === "Closed"
                            ).length}
                        </h3>
                        <p>Closed Jobs</p>
                    </div>

                </div>


                {/* Jobs List */}
                <div className="jobs-list-section">

                    <h2>Posted Job Listings</h2>

                    {loading ? (

                        <p className="jobs-loading">
                            Loading your jobs...
                        </p>

                    ) : jobs.length > 0 ? (

                        <div className="jobs-list">

                            {jobs.map((job) => (

                                <div
                                    className="my-job-card"
                                    key={job._id}
                                >

                                    <div className="my-job-top">

                                        <div>
                                            <h3>{job.title}</h3>

                                            <p className="company-location">
                                                {job.company} · {job.location}
                                            </p>
                                        </div>

                                        <span
                                            className={
                                                job.status === "Active"
                                                    ? "job-active"
                                                    : "job-closed"
                                            }
                                        >
                                            {job.status}
                                        </span>

                                    </div>


                                    <div className="my-job-details">

                                        <span>
                                            <strong>Job Type:</strong> {job.jobType}
                                        </span>

                                        <span>
                                            <strong>Work Mode:</strong> {job.workMode}
                                        </span>

                                        <span>
                                            <strong>Experience:</strong> {job.experience}
                                        </span>

                                        <span>
                                            <strong>Salary:</strong> {job.salary}
                                        </span>

                                    </div>


                                    <p className="job-description">
                                        {job.description}
                                    </p>


                                    <div className="my-job-footer">

                                        <span>
                                            Vacancies: {job.vacancies}
                                        </span>

                                        <div className="my-job-actions">

                                            <Link
                                                to={`/recruiter/edit-job/${job._id}`}
                                                className="edit-job-button"
                                            >
                                                Edit Job
                                            </Link>

                                            <button
                                                className="delete-job-button"
                                                onClick={() => handleDelete(job._id)}
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="no-jobs">

                            <h3>No Jobs Posted Yet</h3>

                            <p>
                                You haven't posted any jobs.
                                Start by creating your first job listing.
                            </p>

                            <Link to="/recruiter/post-job">
                                Post a Job
                            </Link>

                        </div>

                    )}

                </div>

            </main>

        </div>
    )
}

export default MyJobs
