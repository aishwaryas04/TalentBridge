
import React, { useState } from 'react'
import "./Register.css"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("jobseeker")

  const registerbtn = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: name,
        email: email,
        password: password,
        role: role
      })

      if (response.status === 201 || response.status === 200) {
        alert("Registration successful! Please login.")

        setName("")
        setEmail("")
        setPassword("")
        setRole("jobseeker")

        navigate("/login")
      }
    }
    catch (error) {
      console.log(error)

      if (error.response) {
        alert(error.response.data.message || "Registration failed")
      }
      else {
        alert("Unable to connect to server")
      }
    }
  }

  
return (
    <div className="register-container">

      <Link to="/" className="back-home-link">
        ← Back to Home
      </Link>

      <div className="register-box">

        <div className="register-heading">
          <h1>TalentBridge</h1>
          <p>Create your account and get started.</p>
        </div>

        <form onSubmit={registerbtn} className="form">

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />

          <label>Register As</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="jobseeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <button type="submit">Create Account</button>

          <div className="end">
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </div>

        </form>

      </div>
    </div>
)

}

export default Register
