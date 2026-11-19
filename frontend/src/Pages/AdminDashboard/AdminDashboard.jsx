import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobSeekers: 0,
    totalRecruiters: 0,
    totalJobs: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // setStats(response.data.stats || response.data)
        setStats({
          totalUsers: response.data.stats.users.total,
          totalJobSeekers: response.data.stats.users.jobSeekers,
          totalRecruiters: response.data.stats.users.recruiters,
          totalJobs: response.data.stats.jobs.total,
        });
      } catch (error) {
        console.error("Error fetching admin statistics:", error);
        alert(
          error.response?.data?.message ||
            "Unable to load dashboard statistics",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">TalentBridge</h2>
        <p className="admin-role">Admin Panel</p>

        <nav>
          <Link to="/admin/dashboard" className="active">
            Dashboard
          </Link>

          <Link to="/admin/users">Manage Users</Link>

          <Link to="/admin/jobs">
    Manage Jobs
  </Link>

  <Link to="/admin/applications">
  Manage Applications
</Link>

<Link to="/admin/analytics">
    <BarChart3 size={19} />
    Analytics
</Link>
        </nav>

        <button className="admin-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div>
            <h2>Admin Dashboard</h2>
            <p>Manage and monitor TalentBridge</p>
          </div>

          <div className="admin-user-info">
            <span className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </span>
            <p>{user?.name || "Administrator"}</p>
          </div>
        </div>

        {/* Welcome Section */}
        <section className="admin-welcome">
          <h1>Welcome back, {user?.name || "Admin"}!</h1>
          <p>Here's an overview of your TalentBridge platform.</p>
        </section>

        {/* Statistics */}
        <section className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon users-icon">U</div>
            <div>
              <h3>{loading ? "..." : stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon seeker-icon">J</div>
            <div>
              <h3>{loading ? "..." : stats.totalJobSeekers}</h3>
              <p>Job Seekers</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon recruiter-icon">R</div>
            <div>
              <h3>{loading ? "..." : stats.totalRecruiters}</h3>
              <p>Recruiters</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon jobs-icon">J</div>
            <div>
              <h3>{loading ? "..." : stats.totalJobs}</h3>
              <p>Total Jobs</p>
            </div>
          </div>
        </section>

        {/* Platform Overview */}
        <section className="admin-overview">
          <h2>Platform Overview</h2>

          <div className="admin-overview-card">
            <h3>TalentBridge Administration</h3>
            <p>
              Monitor registered users, recruiter accounts, job postings, and
              overall platform activity from this dashboard.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
