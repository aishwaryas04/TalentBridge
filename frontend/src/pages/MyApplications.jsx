
import React, { useState, useEffect } from 'react'
import "./MyApplications.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const MyApplications = () => {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])

  useEffect(() => {
    const getApplications = async () => {
      try {
        const token = localStorage.getItem("token")

        const response = await axios.get(
          "http://localhost:5000/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setApplications(response.data.applications || [])

      } catch (error) {
        console.log("Error fetching applications:", error)
      }
    }

    getApplications()
  }, [])

  const getStatusClass = (status) => {
    if (status === "Shortlisted") return "shortlisted"
    if (status === "Rejected") return "rejected"
    if (status === "Hired") return "hired"
    if (status === "Under Review") return "under-review"
    return "pending"
  }

  return (
    <div className="my-applications">
      <div className="applications-header">
        <div>
          <h1>My Applications</h1>
          <p>Track all your job applications in one place.</p>
        </div>

        <button onClick={() => navigate("/jobseeker/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="applications-summary">
        <h2>Total Applications: {applications.length}</h2>
      </div>

      <div className="applications-container">
        {applications.length > 0 ? (
          applications.map((application) => (
            <div className="application-card" key={application._id}>

              <div className="application-info">
                <h2>{application.job?.title || "Job no longer available"}</h2>

                <h3>
                  {application.job?.company || "Company not available"}
                </h3>

                <div className="application-details">
                  <p>{application.job?.location || "Location not available"}</p>

                  <p>{application.job?.jobType || "Job type not available"}</p>

                  <p>
                    Applied on:{" "}
                    {application.appliedAt
                      ? new Date(application.appliedAt).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>

              <div className="application-status">
                <span className={getStatusClass(application.status)}>
                  {application.status}
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="no-applications">
            <h2>No Applications Yet</h2>
            <p>You haven't applied for any jobs. Start exploring opportunities!</p>

            <button onClick={() => navigate("/jobseeker/browse-jobs")}>
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyApplications
