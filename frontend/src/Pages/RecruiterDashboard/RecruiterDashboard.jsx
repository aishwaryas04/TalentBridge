
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './RecruiterDashboard.css'
import { Bell } from 'lucide-react'

const RecruiterDashboard = () => {

    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("user") || "null")
    const token = localStorage.getItem("token")

    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)

    // Fetch recruiter's jobs
    useEffect(() => {

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
                console.log("Error fetching recruiter jobs:", error)
            } finally {
                setLoading(false)
            }
        }

        getMyJobs()

    }, [token])

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

    // Calculate job statistics
    const activeJobs = jobs.filter(
        (job) => job.status === "Active"
    ).length

    const closedJobs = jobs.filter(
        (job) => job.status === "Closed"
    ).length

    // Logout
    const logout = () => {

        localStorage.removeItem("token")
        localStorage.removeItem("user")

        alert("Logged out successfully")

        navigate("/login")
    }

    return (

        <div className="recruiter-dashboard">

            {/* Sidebar */}
            <div className="sidebar">

                <h2 className="logo">TalentBridge</h2>

                <div className="menu">

                    <Link
                        to="/recruiter/dashboard"
                        className="active"
                    >
                        Dashboard
                    </Link>

                    <Link to="/recruiter/post-job">
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

                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>


            {/* Main Dashboard */}
            <div className="dashboard-content">

                {/* Topbar */}
                <div className="topbar">

                    <h2>Recruiter Dashboard</h2>

                    <div className="user-info">
                        <span className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase() || "R"}
                        </span>

                        <p>{user?.name || "Recruiter"}</p>
                    </div>

                </div>


                {/* Welcome Section */}
                <div className="welcome-section">

                    <h1>
                        Welcome back, {user?.name || "Recruiter"}!
                    </h1>

                    <p>
                        Manage your job postings and find the right
                        candidates for your company.
                    </p>

                </div>


                {/* Statistics */}
                <div className="stats-container">

                    <div className="stat-card">
                        <div className="stat-icon total-icon">
                            <i className="fa-solid fa-briefcase"></i>
                        </div>

                        <h3>
                            {loading ? "..." : jobs.length}
                        </h3>

                        <p>Total Jobs Posted</p>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon active-icon">
                            <i className="fa-solid fa-circle-check"></i>
                        </div>

                        <h3>
                            {loading ? "..." : activeJobs}
                        </h3>

                        <p>Active Jobs</p>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon closed-icon">
                            <i className="fa-solid fa-circle-xmark"></i>
                        </div>

                        <h3>
                            {loading ? "..." : closedJobs}
                        </h3>

                        <p>Closed Jobs</p>
                    </div>

                </div>


                {/* Quick Actions */}
                <div className="recruiter-actions">

                    <h2>Quick Actions</h2>

                    <div className="action-container">

                        <div className="action-card">

                            <div className="action-icon">
                                <i className="fa-solid fa-plus"></i>
                            </div>

                            <h3>Post a New Job</h3>

                            <p>
                                Create a job listing and reach
                                potential candidates.
                            </p>

                            <Link to="/recruiter/post-job">
                                Post Job
                            </Link>

                        </div>


                        <div className="action-card">

                            <div className="action-icon">
                                <i className="fa-solid fa-list-check"></i>
                            </div>

                            <h3>Manage Your Jobs</h3>

                            <p>
                                View, edit and manage your existing
                                job postings.
                            </p>

                            <Link to="/recruiter/my-jobs">
                                View My Jobs
                            </Link>

                        </div>


                        <div className="action-card">

                            <div className="action-icon">
                                <i className="fa-solid fa-users"></i>
                            </div>

                            <h3>View Applicants</h3>

                            <p>
                                Review applications and find
                                suitable candidates.
                            </p>

                            <Link to="/recruiter/applicants">
                                View Applicants
                            </Link>

                        </div>

                    </div>

                </div>


                {/* Recent Jobs */}
                <div className="recent-jobs">

                    <div className="section-heading">
                        <h2>Recently Posted Jobs</h2>

                        <Link to="/recruiter/my-jobs">
                            View All
                        </Link>
                    </div>


                    {loading ? (

                        <p className="loading-message">
                            Loading your jobs...
                        </p>

                    ) : jobs.length > 0 ? (

                        jobs.slice(0, 3).map((job) => (

                            <div
                                className="recent-job-card"
                                key={job._id}
                            >

                                <div className="job-details">

                                    <h3>{job.title}</h3>

                                    <p>
                                        {job.company} · {job.location}
                                    </p>

                                </div>

                                <span
                                    className={
                                        job.status === "Active"
                                            ? "active-status"
                                            : "closed-status"
                                    }
                                >
                                    {job.status}
                                </span>

                            </div>

                        ))

                    ) : (

                        <div className="empty-jobs">

                            <i className="fa-solid fa-briefcase"></i>

                            <h3>No Jobs Posted Yet</h3>

                            <p>
                                Start by creating your first job posting.
                            </p>

                            <Link to="/recruiter/post-job">
                                Post Your First Job
                            </Link>

                        </div>

                    )}

                </div>

            </div>

        </div>

    )
}

export default RecruiterDashboard
