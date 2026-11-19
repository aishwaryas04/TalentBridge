
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { BarChart3 } from "lucide-react";
import './ManageApplications.css'

const ManageApplications = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedApplication, setSelectedApplication] = useState(null)

  // Fetch all applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/admin/applications',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setApplications(response.data.applications)
      } catch (error) {
        console.error('Error fetching applications:', error)
        alert(error.response?.data?.message || 'Unable to load applications')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [token])

  // Delete application
  const handleDeleteApplication = async (applicationId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this application? This action cannot be undone.'
    )

    if (!confirmDelete) return

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) => application._id !== applicationId
        )
      )

      if (selectedApplication?._id === applicationId) {
        setSelectedApplication(null)
      }

      alert('Application deleted successfully')
    } catch (error) {
      console.error('Error deleting application:', error)
      alert(error.response?.data?.message || 'Unable to delete application')
    }
  }

  // Search and filter applications
  const filteredApplications = applications.filter((application) => {
    const searchValue = search.toLowerCase()

    const matchesSearch =
      application.applicant?.name?.toLowerCase().includes(searchValue) ||
      application.applicant?.email?.toLowerCase().includes(searchValue) ||
      application.job?.title?.toLowerCase().includes(searchValue) ||
      application.job?.company?.toLowerCase().includes(searchValue)

    const matchesStatus =
      statusFilter === 'All' || application.status === statusFilter

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
          <Link to="/admin/jobs">Manage Jobs</Link>
          <Link to="/admin/applications" className="active">
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
            <h2>Manage Applications</h2>
            <p>View and manage all job applications</p>
          </div>

          <div className="admin-user-info">
            <span className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
            <p>{user?.name || 'Administrator'}</p>
          </div>
        </div>

        {/* Applications Section */}
        <section className="manage-applications-content">

          <div className="applications-heading">
            <div>
              <h1>All Applications</h1>
              <p>Monitor job applications submitted on TalentBridge</p>
            </div>

            <div className="total-applications-count">
              Total Applications: {applications.length}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="applications-filters">
            <input
              type="text"
              placeholder="Search by applicant, email, job or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>

          <div className="applications-results-info">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>

          {/* Loading and Applications Table */}
          {loading ? (
            <p className="applications-message">Loading applications...</p>
          ) : filteredApplications.length === 0 ? (
            <p className="applications-message">No applications found.</p>
          ) : (
            <div className="applications-table-container">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map((application) => (
                    <tr key={application._id}>

                      <td>
                        <div className="applicant-name">
                          {application.applicant?.name || 'Unknown'}
                        </div>
                        <div className="applicant-email">
                          {application.applicant?.email || 'N/A'}
                        </div>
                      </td>

                      <td className="application-job-title">
                        {application.job?.title || 'Job no longer available'}
                      </td>

                      <td>
                        {application.job?.company || 'N/A'}
                      </td>

                      <td>
                        {application.appliedAt
                          ? new Date(application.appliedAt).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td>
                        <span
                          className={`application-status ${application.status?.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {application.status || 'Unknown'}
                        </span>
                      </td>

                      <td>
                        <div className="application-actions">
                          <button
                            className="view-application-btn"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye size={16} />
                            View
                          </button>

                          <button
                            className="delete-application-btn"
                            onClick={() =>
                              handleDeleteApplication(application._id)
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

      {/* Application Details Modal */}
      {selectedApplication && (
        <div
          className="application-modal-overlay"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="application-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="application-modal-header">
              <div>
                <h2>Application Details</h2>
                <p>Complete application information</p>
              </div>

              <button
                className="close-application-modal"
                onClick={() => setSelectedApplication(null)}
              >
                ×
              </button>
            </div>

            <div className="application-modal-content">

              <h3>Applicant Information</h3>

              <div className="application-detail-grid">
                <div>
                  <span>Name</span>
                  <strong>
                    {selectedApplication.applicant?.name || 'Unknown'}
                  </strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    {selectedApplication.applicant?.email || 'N/A'}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>
                    {selectedApplication.applicant?.phone || 'Not provided'}
                  </strong>
                </div>

                <div>
                  <span>Applied On</span>
                  <strong>
                    {selectedApplication.appliedAt
                      ? new Date(selectedApplication.appliedAt).toLocaleDateString()
                      : 'N/A'}
                  </strong>
                </div>
              </div>

              <div className="application-modal-section">
                <h4>Job Information</h4>
                <p>
                  <strong>Position:</strong>{' '}
                  {selectedApplication.job?.title || 'Job no longer available'}
                </p>
                <p>
                  <strong>Company:</strong>{' '}
                  {selectedApplication.job?.company || 'N/A'}
                </p>
                <p>
                  <strong>Location:</strong>{' '}
                  {selectedApplication.job?.location || 'N/A'}
                </p>
              </div>

              <div className="application-modal-section">
                <h4>Recruiter Information</h4>
                <p>
                  <strong>Name:</strong>{' '}
                  {selectedApplication.job?.recruiter?.name || 'N/A'}
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  {selectedApplication.job?.recruiter?.email || 'N/A'}
                </p>
                <p>
                  <strong>Company:</strong>{' '}
                  {selectedApplication.job?.recruiter?.companyName || 'N/A'}
                </p>
              </div>

              <div className="application-modal-section">
                <h4>Application Status</h4>
                <span
                  className={`application-status ${selectedApplication.status?.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {selectedApplication.status || 'Unknown'}
                </span>
              </div>

              <div className="application-modal-section">
                <h4>Cover Letter</h4>
                <p className="cover-letter-text">
                  {selectedApplication.coverLetter || 'No cover letter provided.'}
                </p>
              </div>

            </div>

            <div className="application-modal-footer">
              <button onClick={() => setSelectedApplication(null)}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default ManageApplications
