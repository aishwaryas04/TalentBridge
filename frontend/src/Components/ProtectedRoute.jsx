
import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRole }) => {

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "null")

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) {

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    }
    else if (user.role === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />
    }
    else {
      return <Navigate to="/jobseeker/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute
