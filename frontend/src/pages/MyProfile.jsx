
import React, { useState, useEffect } from 'react'
import "./MyProfile.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    resume: ""
  })

  const [isEditing, setIsEditing] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(true)

  const getProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const user = response.data.user || response.data

      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        skills: Array.isArray(user.skills)
          ? user.skills.join(", ")
          : user.skills || "",
        resume: user.resume || ""
      })

    } catch (error) {
      console.log("Error fetching profile:", error)
      alert("Unable to load profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  const editProfile = () => {
    setIsEditing(true)
  }

  const cancelEdit = () => {
    getProfile()
    setResumeFile(null)
    setIsEditing(false)
  }

  const updateProfile = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          name: profile.name,
          phone: profile.phone,
          location: profile.location,
          skills: profile.skills
            .split(",")
            .map(skill => skill.trim())
            .filter(Boolean)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const savedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      )

      savedUser.name = profile.name
      localStorage.setItem("user", JSON.stringify(savedUser))

      alert(response.data.message || "Profile updated successfully!")

      setIsEditing(false)
      await getProfile()

    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Unable to update profile")
    }
  }

  const uploadResume = async () => {
    if (!resumeFile) {
      alert("Please select your resume first")
      return
    }

    try {
      const formData = new FormData()
      formData.append("resume", resumeFile)

      const response = await axios.post(
        "http://localhost:5000/api/users/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert(response.data.message || "Resume uploaded successfully!")

      setResumeFile(null)
      await getProfile()

    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Resume upload failed")
    }
  }

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>
  }

  return (
    <div className="my-profile">

      <div className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p>View and manage your personal information.</p>
        </div>

        <button onClick={() => navigate("/jobseeker/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="profile-card">

        <div className="profile-top">
          <div className="profile-avatar">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="profile-heading">
            <h2>{profile.name || "Your Name"}</h2>
            <p>Job Seeker</p>
            <span>{profile.email}</span>
          </div>

          {!isEditing && (
            <button className="edit-btn" onClick={editProfile}>
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (

          <form className="profile-form" onSubmit={updateProfile}>

            <h2>Edit Personal Information</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="Enter your location"
                />
              </div>

              <div className="form-group full-width">
                <label>Skills</label>
                <textarea
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="Example: React, JavaScript, HTML, CSS"
                />
                <small>Separate each skill with a comma.</small>
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="save-btn">
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>

          </form>

        ) : (

          <div className="profile-details">

            <div className="details-section">
              <h2>Personal Information</h2>

              <div className="details-grid">
                <div className="detail-item">
                  <span>Full Name</span>
                  <p>{profile.name || "Not added"}</p>
                </div>

                <div className="detail-item">
                  <span>Email Address</span>
                  <p>{profile.email || "Not added"}</p>
                </div>

                <div className="detail-item">
                  <span>Phone Number</span>
                  <p>{profile.phone || "Not added"}</p>
                </div>

                <div className="detail-item">
                  <span>Location</span>
                  <p>{profile.location || "Not added"}</p>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h2>Professional Information</h2>

              <div className="detail-item">
                <span>Skills</span>

                <div className="skills-list">
                  {profile.skills
                    ? profile.skills.split(",").filter(skill => skill.trim()).map((skill, index) => (
                        <span className="skill-tag" key={index}>
                          {skill.trim()}
                        </span>
                      ))
                    : <p>No skills added yet.</p>
                  }
                </div>
              </div>
            </div>

            <div className="details-section resume-section">
              <h2>Resume</h2>

              {profile.resume ? (
                <p className="resume-message">
                  <span className="resume-icon">📄</span>
                  Resume uploaded
                </p>
              ) : (
                <p className="resume-message">No resume uploaded yet.</p>
              )}

              <div className="resume-upload">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />

                <button onClick={uploadResume} type="button">
                  Upload Resume
                </button>
              </div>
            </div>

          </div>

        )}

      </div>
    </div>
  )
}

export default MyProfile
