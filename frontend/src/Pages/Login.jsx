
import React, { useState } from 'react'
import "./Login.css"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const loginbtn = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: email,
        password: password
      })

      if (response.status === 200) {
        console.log("LOGIN RESPONSE:", response.data)

        alert("Login successful")

        // Store login details
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        setEmail("")
        setPassword("")

        // Navigate based on user role
        const role = response.data.user.role

        if (role === "admin") {
          navigate("/admin/dashboard")
        }
        else if (role === "recruiter") {
          navigate("/recruiter/dashboard")
        }
        else {
          navigate("/jobseeker/dashboard")
        }
      }
    }
    catch (error) {
      console.log(error)

      if (error.response && error.response.status === 401) {
        alert("Invalid email or password")
      }
      else {
        alert("Login failed. Please try again.")
      }
    }
  }

  
return (
    <div className="login-container">

      <Link to="/" className="back-home-link">
        ← Back to Home
      </Link>

      <div className="login-box">

        <div className="login-heading">
          <h1>TalentBridge</h1>
          <p>Welcome back! Login to continue your journey.</p>
        </div>

        <form onSubmit={loginbtn} className="form">

          <label>Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>

          <div className="end">
            <p>Don't have an account?</p>
            <Link to="/register">Register</Link>
          </div>

        </form>

      </div>
    </div>
)

}

export default Login
