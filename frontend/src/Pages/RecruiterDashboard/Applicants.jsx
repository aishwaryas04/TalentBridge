import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import "./Applicants.css";

const Applicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusChanges, setStatusChanges] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");

  // Fetch recruiter's jobs
  const getMyJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/jobs/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const jobList = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];

      setJobs(jobList);

      if (jobList.length > 0) {
        setSelectedJob(jobList[0]._id);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Unable to load your jobs.");
    }
  };

  // Fetch applicants for selected job
  const getApplicants = async () => {
    if (!selectedJob) {
      setApplications([]);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/api/applications/job/${selectedJob}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;

      setApplications(Array.isArray(data) ? data : data.applications || []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      alert("Unable to load applicants.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyJobs();
  }, []);

  useEffect(() => {
    getApplicants();
  }, [selectedJob]);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const unread = response.data.notifications.filter(
          (notification) => !notification.isRead,
        ).length;

        setUnreadCount(unread);
      } catch (error) {
        console.log("Error fetching unread notifications:", error);
      }
    };

    fetchUnreadCount();
  }, [token]);
  // Handle status selection
  const handleStatusChange = (applicationId, status) => {
    setStatusChanges((prev) => ({
      ...prev,
      [applicationId]: status,
    }));
  };

  // Update application status
  const updateStatus = async (applicationId, currentStatus) => {
    const newStatus = statusChanges[applicationId] || currentStatus;

    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? { ...application, status: newStatus }
            : application,
        ),
      );

      setStatusChanges((prev) => {
        const updated = { ...prev };
        delete updated[applicationId];
        return updated;
      });

      alert("Application status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Unable to update status.");
    }
  };

  // View applicant resume
  const viewResume = async (applicationId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/applications/${applicationId}/resume`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      const file = new Blob([response.data], {
        type: response.headers["content-type"] || "application/pdf",
      });

      const fileUrl = window.URL.createObjectURL(file);
      window.open(fileUrl, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (error) {
      console.error("Error opening resume:", error);
      alert("Unable to open this resume.");
    }
  };

  return (
    <div className="applicants-page">
      {/* Sidebar */}
      <aside className="applicants-sidebar">
        <h2>TalentBridge</h2>
        <p className="sidebar-role">Recruiter Panel</p>

        <nav>
          <Link to="/recruiter/dashboard">Dashboard</Link>
          <Link to="/recruiter/post-job">Post a Job</Link>
          <Link to="/recruiter/my-jobs">My Jobs</Link>
          <Link to="/recruiter/applicants" className="active">
            Applicants
          </Link>
          <Link to="/recruiter/company-profile">Company Profile</Link>

          <Link
            to="/recruiter/notifications"
            className="sidebar-notification-link"
          >
            <Bell size={18} />
            <span>Notifications</span>

            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </Link>
        </nav>

        <button
          className="applicants-logout"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="applicants-main">
        <div className="applicants-header">
          <div>
            <h1>Applicants</h1>
            <p>Manage applications received for your job postings.</p>
          </div>
        </div>

        {/* Job Selection */}
        <div className="applicants-filter">
          <label htmlFor="jobSelect">Select Job</label>

          <select
            id="jobSelect"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            {jobs.length === 0 && <option value="">No jobs posted</option>}

            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        {/* Applicants List */}
        <div className="applicants-content">
          <div className="applicants-title">
            <h2>Received Applications</h2>
            <span>{applications.length} Applicants</span>
          </div>

          {loading ? (
            <p className="applicants-message">Loading applicants...</p>
          ) : applications.length === 0 ? (
            <div className="applicants-empty">
              <h3>No Applicants Yet</h3>
              <p>
                Applications for this job will appear here when candidates
                apply.
              </p>
            </div>
          ) : (
            <div className="applicants-list">
              {applications.map((application) => {
                const applicant = application.applicant || {};
                const currentStatus =
                  statusChanges[application._id] || application.status;

                return (
                  <div className="applicant-card" key={application._id}>
                    <div className="applicant-details">
                      <div className="applicant-avatar">
                        {(applicant.name || "A").charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3>{applicant.name || "Applicant"}</h3>
                        <p>{applicant.email || "Email not available"}</p>
                        <p>
                          Applied on:{" "}
                          {application.appliedAt
                            ? new Date(
                                application.appliedAt,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="applicant-actions">
                      <button
                        className="resume-button"
                        onClick={() => viewResume(application._id)}
                      >
                        View Resume
                      </button>

                      <div className="status-controls">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(application._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>

                        <button
                          className="status-button"
                          onClick={() =>
                            updateStatus(application._id, application.status)
                          }
                          disabled={!statusChanges[application._id]}
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Applicants;
