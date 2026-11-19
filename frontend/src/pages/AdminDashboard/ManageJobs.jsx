
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { BarChart3 } from "lucide-react";
import './ManageJobs.css'

const ManageJobs = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedJob, setSelectedJob] = useState(null)

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/admin/jobs',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setJobs(response.data.jobs)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        alert(error.response?.data?.message || 'Unable to load jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [token])

  // Delete job
  const handleDeleteJob = async (jobId, jobTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${jobTitle}"? All applications for this job will also be deleted.`
    )

    if (!confirmDelete) return

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job._id !== jobId)
      )

      if (selectedJob?._id === jobId) {
        setSelectedJob(null)
      }

      alert('Job deleted successfully')
    } catch (error) {
      console.error('Error deleting job:', error)
      alert(error.response?.data?.message || 'Unable to delete job')
    }
  }

  // Search and filter jobs
  const filteredJobs = jobs.filter((job) => {
    const searchValue = search.toLowerCase()

    const matchesSearch =
      job.title?.toLowerCase().includes(searchValue) ||
      job.company?.toLowerCase().includes(searchValue) ||
      job.location?.toLowerCase().includes(searchValue) ||
      job.recruiter?.name?.toLowerCase().includes(searchValue)

    const matchesStatus =
      statusFilter === 'All' || job.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    alert('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">TalentBridge</h2>
        <p className="admin-role">Admin Panel</p>

        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/admin/jobs" className="active">
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
            <h2>Manage Jobs</h2>
            <p>View and manage all platform job postings</p>
          </div>

          <div className="admin-user-info">
            <span className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
            <p>{user?.name || 'Administrator'}</p>
          </div>
        </div>

        {/* Jobs Section */}
        <section className="manage-jobs-content">

          <div className="jobs-heading">
            <div>
              <h1>All Job Postings</h1>
              <p>Monitor and manage recruiter job postings</p>
            </div>

            <div className="total-jobs-count">
              Total Jobs: {jobs.length}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="jobs-filters">
            <input
              type="text"
              placeholder="Search by job title, company or recruiter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Jobs</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="jobs-results-info">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>

          {/* Loading and Jobs Table */}
          {loading ? (
            <p className="jobs-message">Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="jobs-message">No jobs found.</p>
          ) : (
            <div className="jobs-table-container">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Job Details</th>
                    <th>Recruiter</th>
                    <th>Location</th>
                    <th>Job Type</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Posted On</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job._id}>

                      <td>
                        <div className="job-title">
                          {job.title}
                        </div>
                        <div className="job-company">
                          {job.company}
                        </div>
                      </td>

                      <td>
                        <div className="recruiter-name">
                          {job.recruiter?.name || 'Unknown'}
                        </div>
                        <div className="recruiter-email">
                          {job.recruiter?.email || 'N/A'}
                        </div>
                      </td>

                      <td>{job.location || 'N/A'}</td>

                      <td>{job.jobType || 'N/A'}</td>

                      <td>{job.salary || 'Not specified'}</td>

                      <td>
                        <span
                          className={`job-status ${job.status?.toLowerCase()}`}
                        >
                          {job.status || 'Unknown'}
                        </span>
                      </td>

                      <td>
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td>
                        <div className="job-actions">
                          <button
                            className="view-job-btn"
                            onClick={() => setSelectedJob(job)}
                          >
                            <Eye size={16} />
                            View
                          </button>

                          <button
                            className="delete-job-btn"
                            onClick={() =>
                              handleDeleteJob(job._id, job.title)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <div
          className="job-modal-overlay"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="job-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="job-modal-header">
              <div>
                <h2>Job Details</h2>
                <p>Complete job posting information</p>
              </div>

              <button
                className="close-job-modal"
                onClick={() => setSelectedJob(null)}
              >
                ×
              </button>
            </div>

            <div className="job-modal-content">

              <h3>{selectedJob.title}</h3>
              <p className="modal-company">
                {selectedJob.company}
              </p>

              <div className="job-detail-grid">

                <div>
                  <span>Location</span>
                  <strong>
                    {selectedJob.location || 'Not specified'}
                  </strong>
                </div>

                <div>
                  <span>Job Type</span>
                  <strong>
                    {selectedJob.jobType || 'Not specified'}
                  </strong>
                </div>

                <div>
                  <span>Work Mode</span>
                  <strong>
                    {selectedJob.workMode || 'Not specified'}
                  </strong>
                </div>

                <div>
                  <span>Experience</span>
                  <strong>
                    {selectedJob.experience || 'Not specified'}
                  </strong>
                </div>

                <div>
                  <span>Salary</span>
                  <strong>
                    {selectedJob.salary || 'Not specified'}
                  </strong>
                </div>

                <div>
                  <span>Vacancies</span>
                  <strong>
                    {selectedJob.vacancies || 'Not specified'}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>
                    {selectedJob.status || 'Unknown'}
                  </strong>
                </div>

                <div>
                  <span>Posted On</span>
                  <strong>
                    {selectedJob.createdAt
                      ? new Date(selectedJob.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </strong>
                </div>

                <div>
                  <span>Application Deadline</span>
                  <strong>
                    {selectedJob.applicationDeadline
                      ? new Date(selectedJob.applicationDeadline).toLocaleDateString()
                      : 'Not specified'}
                  </strong>
                </div>

              </div>

              <div className="job-description-section">
                <h4>Job Description</h4>
                <p>
                  {selectedJob.description || 'No description provided.'}
                </p>
              </div>

              <div className="job-description-section">
                <h4>Requirements</h4>
                <p>
                  {selectedJob.requirements || 'No requirements provided.'}
                </p>
              </div>

              <div className="job-description-section">
                <h4>Required Skills</h4>
                <p>
                  {Array.isArray(selectedJob.skills)
                    ? selectedJob.skills.join(', ')
                    : selectedJob.skills || 'Not specified'}
                </p>
              </div>

              <div className="job-description-section">
                <h4>Recruiter Information</h4>
                <p>Name: {selectedJob.recruiter?.name || 'Unknown'}</p>
                <p>Email: {selectedJob.recruiter?.email || 'N/A'}</p>
                <p>
                  Company: {selectedJob.recruiter?.companyName || 'N/A'}
                </p>
              </div>

            </div>

            <div className="job-modal-footer">
              <button
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default ManageJobs
