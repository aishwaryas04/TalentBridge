
import React, { useState, useEffect } from 'react'
import './BrowseJobs.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BrowseJobs = () => {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')

  // Application form states
  const [selectedJob, setSelectedJob] = useState(null)
  const [profile, setProfile] = useState({})
  const [resume, setResume] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch jobs
  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/jobs',
          {
            params: {
              keyword: search,
              location,
              jobType
            }
          }
        )

        setJobs(response.data.jobs || [])
      } catch (error) {
        console.log('Error fetching jobs:', error)
      }
    }

    getJobs()
  }, [search, location, jobType])

  // Open application form
  const applyJob = async (job) => {
    setSelectedJob(job)
    setResume(null)
    setCoverLetter('')
    setProfile({})
    setLoadingProfile(true)

    try {
      const token = localStorage.getItem('token')

      const response = await axios.get(
        'http://localhost:5000/api/users/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const user =
        response.data.user ||
        response.data.profile ||
        response.data

      setProfile(user)

    } catch (error) {
      console.error('Error fetching profile:', error)

      alert('Unable to load your profile information.')
      setSelectedJob(null)

    } finally {
      setLoadingProfile(false)
    }
  }

  // Submit application
  const submitApplication = async (e) => {
    e.preventDefault()

    if (!resume) {
      alert('Please upload a resume for this job.')
      return
    }

    const allowedExtensions = ['pdf', 'doc', 'docx']
    const extension = resume.name.split('.').pop().toLowerCase()

    if (!allowedExtensions.includes(extension)) {
      alert('Only PDF, DOC and DOCX files are allowed.')
      return
    }

    if (resume.size > 5 * 1024 * 1024) {
      alert('Resume size must be less than 5 MB.')
      return
    }

    try {
      setSubmitting(true)

      const token = localStorage.getItem('token')

      const formData = new FormData()

      formData.append('resume', resume)
      formData.append('coverLetter', coverLetter)

      const response = await axios.post(
        `http://localhost:5000/api/applications/${selectedJob._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert(
        response.data.message ||
        'Application submitted successfully!'
      )

      setSelectedJob(null)
      setResume(null)
      setCoverLetter('')

    } catch (error) {
      console.error('Application error:', error)

      alert(
        error.response?.data?.message ||
        'Unable to submit your application.'
      )

    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="browse-jobs">

      {/* Header */}
      <div className="browse-header">
        <div>
          <h1>Browse Jobs</h1>
          <p>Find the right opportunity for your career.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/jobseeker/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-section">

        <input
          type="text"
          placeholder="Search job title or company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

      </div>

      {/* Jobs List */}
      <div className="jobs-container">

        {jobs.length > 0 ? (
          jobs.map((job) => (

            <div className="job-card" key={job._id}>

              <h2>{job.title}</h2>
              <h3>{job.company}</h3>

              <div className="job-details">
                <p>{job.location}</p>
                <p>{job.jobType}</p>
                <p>{job.workMode}</p>
                <p>{job.experience}</p>
              </div>

              <p className="job-salary">
                Salary: {job.salary || 'Not specified'}
              </p>

              <p className="job-description">
                {job.description}
              </p>

              <button
                type="button"
                onClick={() => applyJob(job)}
              >
                Apply Now
              </button>

            </div>

          ))
        ) : (

          <div className="no-jobs">
            <h2>No Jobs Found</h2>
            <p>Try changing your search or filters.</p>
          </div>

        )}

      </div>

      {/* Application Form Modal */}
      {selectedJob && (

        <div className="application-modal-overlay">

          <div className="application-modal">

            {/* Modal Header */}
            <div className="application-modal-header">

              <div>
                <h2>Apply for Job</h2>
                <p>
                  {selectedJob.title} at {selectedJob.company}
                </p>
              </div>

              <button
                type="button"
                className="close-application"
                onClick={() => setSelectedJob(null)}
                disabled={submitting}
              >
                &times;
              </button>

            </div>

            {/* Loading Profile */}
            {loadingProfile ? (

              <p className="application-loading">
                Loading your profile...
              </p>

            ) : (

              <form onSubmit={submitApplication}>

                {/* Full Name */}
                <div className="application-form-group">

                  <label>Full Name</label>

                  <input
                    type="text"
                    value={profile.name || ''}
                    readOnly
                  />

                </div>

                {/* Email */}
                <div className="application-form-group">

                  <label>Email Address</label>

                  <input
                    type="email"
                    value={profile.email || ''}
                    readOnly
                  />

                </div>

                {/* Phone */}
                <div className="application-form-group">

                  <label>Phone Number</label>

                  <input
                    type="text"
                    value={profile.phone || ''}
                    readOnly
                  />

                </div>

                {/* Resume Upload */}
                <div className="application-form-group">

                  <label>Upload Resume *</label>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      setResume(e.target.files[0] || null)
                    }}
                    required
                  />

                  <small>
                    PDF, DOC or DOCX. Maximum file size: 5 MB.
                  </small>

                  {resume && (
                    <p className="selected-resume">
                      Selected: {resume.name}
                    </p>
                  )}

                </div>

                {/* Cover Letter */}
                <div className="application-form-group">

                  <label>Cover Letter (Optional)</label>

                  <textarea
                    rows="5"
                    placeholder="Write a short introduction about yourself and why you are interested in this job..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />

                </div>

                {/* Form Buttons */}
                <div className="application-form-actions">

                  <button
                    type="button"
                    className="cancel-application"
                    onClick={() => setSelectedJob(null)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="submit-application"
                    disabled={submitting}
                  >
                    {submitting
                      ? 'Submitting...'
                      : 'Submit Application'}
                  </button>

                </div>

              </form>

            )}

          </div>

        </div>

      )}

    </div>
  )
}

export default BrowseJobs
