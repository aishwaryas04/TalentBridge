import React, { useState, useEffect } from "react";
import "./JobSeekerDashboard.css";
import { useNavigate, Link } from 'react-router-dom'
import axios from "axios";
import { Bell } from 'lucide-react'

const JobSeekerDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [totalApplications, setTotalApplications] = useState(0);
  const [shortlisted, setShortlisted] = useState(0);
  const [pending, setPending] = useState(0);

  const [unreadCount, setUnreadCount] = useState(0)

const fetchUnreadCount = async () => {
    try {
        const token = localStorage.getItem('token')

        const response = await axios.get(
            'http://localhost:5000/api/notifications',
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
        console.log('Error fetching unread notifications:', error)
    }
}

useEffect(() => {
    fetchUnreadCount()
}, [])

  useEffect(() => {
    const getApplicationStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const applications = response.data.applications || [];

        setTotalApplications(
          response.data.totalApplications || applications.length,
        );

        const shortlistedCount = applications.filter(
          (app) => app.status === "Shortlisted",
        ).length;

        const pendingCount = applications.filter(
          (app) => app.status === "Pending",
        ).length;

        setShortlisted(shortlistedCount);
        setPending(pendingCount);
      } catch (error) {
        console.log("Error fetching applications:", error);
      }
    };

    getApplicationStats();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="jobseeker-dashboard">
      <div className="sidebar">
        <h2>TalentBridge</h2>

        <div className="menu">
          <Link to="/jobseeker/dashboard" className="active">
            Dashboard
          </Link>

          <Link to="/jobseeker/browse-jobs">Browse Jobs</Link>

          <Link to="/jobseeker/my-applications">My Applications</Link>

          <Link to="/jobseeker/my-profile">My Profile</Link>

          <Link to="/jobseeker/notifications" className="sidebar-link">
    <Bell size={18} />
    <span>Notifications</span>

    {unreadCount > 0 && (
        <span className="notification-badge">
            {unreadCount}
        </span>
    )}
</Link>
        </div>

        <button onClick={logout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="topbar">
          <h2>Job Seeker Dashboard</h2>
          <p>Welcome, {user?.name || "User"}</p>
        </div>

        <div className="welcome-section">
          <h1>Welcome back, {user?.name || "User"}!</h1>
          <p>
            Find your next opportunity and take the next step in your career.
          </p>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h3>{totalApplications}</h3>
            <p>Applied Jobs</p>
          </div>

          <div className="stat-card">
            <h3>{shortlisted}</h3>
            <p>Shortlisted</p>
          </div>

          <div className="stat-card">
            <h3>{pending}</h3>
            <p>Pending Applications</p>
          </div>
        </div>

        <div className="recent-section">
          <h2>Recent Activity</h2>
          <p>You can track your job applications here.</p>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
