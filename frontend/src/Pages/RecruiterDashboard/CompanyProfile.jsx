
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import './CompanyProfile.css'

const CompanyProfile = () => {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [unreadCount, setUnreadCount] = useState(0)

  const [company, setCompany] = useState({
    companyName: '',
    companyDescription: '',
    industry: '',
    website: '',
    companyEmail: '',
    companyPhone: '',
    location: ''
  })

  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanyProfile()
  }, [])

  // Fetch unread notification count
useEffect(() => {

    const fetchUnreadCount = async () => {

        try {
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

    fetchUnreadCount()

}, [token])

  const fetchCompanyProfile = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/users/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const profile = response.data.user

      setCompany({
        companyName: profile.companyName || '',
        companyDescription: profile.companyDescription || '',
        industry: profile.industry || '',
        website: profile.website || '',
        companyEmail: profile.companyEmail || '',
        companyPhone: profile.companyPhone || '',
        location: profile.location || ''
      })
    } catch (error) {
      console.error('Error fetching company profile:', error)
      alert('Failed to load company profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()

    try {
      await axios.put(
        'http://localhost:5000/api/users/profile',
        company,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert('Company profile updated successfully!')
      setEditMode(false)
      fetchCompanyProfile()
    } catch (error) {
      console.error('Error updating company profile:', error)
      alert(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    fetchCompanyProfile()
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    alert('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="recruiter-company-layout">

      {/* Sidebar */}
      <aside className="company-sidebar">

        <h2 className="company-logo">TalentBridge</h2>

        <p className="company-sidebar-role">Recruiter Panel</p>

        <nav>
          <Link to="/recruiter/dashboard">Dashboard</Link>
          <Link to="/recruiter/post-job">Post a Job</Link>
          <Link to="/recruiter/my-jobs">My Jobs</Link>
          <Link to="/recruiter/applicants">Applicants</Link>
          <Link to="/recruiter/company-profile" className="active">
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

        <button className="company-logout" onClick={logout}>
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="company-main-content">

        <div className="company-topbar">
          <h2>Company Profile</h2>

          <div className="company-user-info">
            <span className="company-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'R'}
            </span>
            <p>{user?.name || 'Recruiter'}</p>
          </div>
        </div>

        <div className="company-profile-page">

          <div className="company-profile-header">
            <div>
              <h1>Company Profile</h1>
              <p>Manage your company information</p>
            </div>

            {!editMode && (
              <button
                className="company-edit-btn"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {loading ? (
            <div className="company-loading">
              Loading company profile...
            </div>
          ) : editMode ? (

            <form className="company-profile-form" onSubmit={handleSave}>

              <div className="company-form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={company.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="company-form-group">
                <label>Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={company.industry}
                  onChange={handleChange}
                  placeholder="Example: Information Technology"
                />
              </div>

              <div className="company-form-group">
                <label>Company Website</label>
                <input
                  type="url"
                  name="website"
                  value={company.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="company-form-group">
                <label>Company Email</label>
                <input
                  type="email"
                  name="companyEmail"
                  value={company.companyEmail}
                  onChange={handleChange}
                  placeholder="company@example.com"
                />
              </div>

              <div className="company-form-group">
                <label>Company Phone</label>
                <input
                  type="tel"
                  name="companyPhone"
                  value={company.companyPhone}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="Enter company phone"
                />
              </div>

              <div className="company-form-group">
                <label>Company Location</label>
                <input
                  type="text"
                  name="location"
                  value={company.location}
                  onChange={handleChange}
                  placeholder="Enter company location"
                />
              </div>

              <div className="company-form-group full-width">
                <label>Company Description</label>
                <textarea
                  name="companyDescription"
                  value={company.companyDescription}
                  onChange={handleChange}
                  placeholder="Tell candidates about your company..."
                  rows="5"
                />
              </div>

              <div className="company-form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="company-cancel-btn"
                >
                  Cancel
                </button>

                <button type="submit" className="company-save-btn">
                  Save Changes
                </button>
              </div>

            </form>

          ) : (

            <div className="company-profile-card">

              <div className="company-profile-banner">
                <div className="company-avatar">
                  {company.companyName
                    ? company.companyName.charAt(0).toUpperCase()
                    : 'C'}
                </div>

                <div>
                  <h2>{company.companyName || 'Company Name'}</h2>
                  <p>{company.industry || 'Industry not added'}</p>
                </div>
              </div>

              <div className="company-details">

                <div className="company-detail-item">
                  <span>Company Website</span>
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noreferrer">
                      {company.website}
                    </a>
                  ) : <p>Not added</p>}
                </div>

                <div className="company-detail-item">
                  <span>Company Email</span>
                  <p>{company.companyEmail || 'Not added'}</p>
                </div>

                <div className="company-detail-item">
                  <span>Company Phone</span>
                  <p>{company.companyPhone || 'Not added'}</p>
                </div>

                <div className="company-detail-item">
                  <span>Location</span>
                  <p>{company.location || 'Not added'}</p>
                </div>

                <div className="company-detail-item full-width">
                  <span>About Company</span>
                  <p>{company.companyDescription || 'No company description added yet.'}</p>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default CompanyProfile
