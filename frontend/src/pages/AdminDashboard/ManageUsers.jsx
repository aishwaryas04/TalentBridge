
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { BarChart3 } from "lucide-react";
import './ManageUsers.css'

const ManageUsers = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/admin/users',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setUsers(response.data.users)
      } catch (error) {
        console.error('Error fetching users:', error)
        alert(error.response?.data?.message || 'Unable to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [token])

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${userName}? This action cannot be undone.`
    )

    if (!confirmDelete) return

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setUsers((previousUsers) =>
        previousUsers.filter((item) => item._id !== userId)
      )

      alert('User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert(error.response?.data?.message || 'Unable to delete user')
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    alert('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">TalentBridge</h2>
        <p className="admin-role">Admin Panel</p>

        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users" className="active">
            Manage Users
          </Link>
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

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h2>Manage Users</h2>
            <p>View all registered TalentBridge users</p>
          </div>

          <div className="admin-user-info">
            <span className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
            <p>{user?.name || 'Administrator'}</p>
          </div>
        </div>

        <section className="manage-users-content">
          <div className="users-heading">
            <div>
              <h1>Registered Users</h1>
              <p>Manage and monitor platform users</p>
            </div>

            <div className="total-users-count">
              Total Users: {users.length}
            </div>
          </div>

          {loading ? (
            <p className="users-message">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="users-message">No users found.</p>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Role</th>
                    <th>Registered On</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((item) => (
                    <tr key={item._id}>
                      <td className="user-name">{item.name}</td>

                      <td>{item.email}</td>

                      <td>{item.phone || 'Not provided'}</td>

                      <td>{item.location || 'Not provided'}</td>

                      <td>
                        <span className={`user-role ${item.role}`}>
                          {item.role === 'jobseeker'
                            ? 'Job Seeker'
                            : item.role === 'recruiter'
                              ? 'Recruiter'
                              : 'Admin'}
                        </span>
                      </td>

                      <td>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td>
                        {item.role === 'admin' ? (
                          <span className="protected-user">Protected</span>
                        ) : (
                          <button
                            className="delete-user-btn"
                            onClick={() =>
                              handleDeleteUser(item._id, item.name)
                            }
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default ManageUsers
