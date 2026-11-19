
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import BrowseJobs from "./pages/BrowseJobs";
import MyApplications from "./pages/MyApplications";
import MyProfile from "./pages/MyProfile";

import PostJob from "./pages/RecruiterDashboard/PostJob";
import MyJobs from "./pages/RecruiterDashboard/MyJobs";
import EditJob from "./pages/RecruiterDashboard/EditJob";
import Applicants from "./pages/RecruiterDashboard/Applicants";
import CompanyProfile from "./pages/RecruiterDashboard/CompanyProfile";

import ManageUsers from "./pages/AdminDashboard/ManageUsers";
import ManageJobs from "./pages/AdminDashboard/ManageJobs";
import ManageApplications from "./pages/AdminDashboard/ManageApplications";
import AdminAnalytics from "./pages/AdminDashboard/AdminAnalytics";

import Notifications from "./pages/Notifications";
import RecruiterNotifications from "./pages/RecruiterDashboard/RecruiterNotifications";

const App = () => {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Job Seeker Routes */}
            <Route
                path="/jobseeker/dashboard"
                element={
                    <ProtectedRoute allowedRole="jobseeker">
                        <JobSeekerDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/jobseeker/browse-jobs"
                element={
                    <ProtectedRoute allowedRole="jobseeker">
                        <BrowseJobs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/jobseeker/my-applications"
                element={
                    <ProtectedRoute allowedRole="jobseeker">
                        <MyApplications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/jobseeker/my-profile"
                element={
                    <ProtectedRoute allowedRole="jobseeker">
                        <MyProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/jobseeker/notifications"
                element={
                    <ProtectedRoute allowedRole="jobseeker">
                        <Notifications />
                    </ProtectedRoute>
                }
            />

            {/* Recruiter Routes */}
            <Route
                path="/recruiter/dashboard"
                element={
                    <ProtectedRoute allowedRole="recruiter">
                        <RecruiterDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/post-job"
                element={
                    <ProtectedRoute allowedRole="recruiter">
                        <PostJob />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/my-jobs"
                element={
                    <ProtectedRoute allowedRole="recruiter">
                        <MyJobs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/edit-job/:id"
                element={
                    <ProtectedRoute allowedRole="recruiter">
                        <EditJob />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/applicants"
                element={
                    <ProtectedRoute allowedRole="recruiter">
                        <Applicants />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/company-profile"
                element={
                    <ProtectedRoute allowedRole="recruiter">
                        <CompanyProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/notifications"
                element={
                    <ProtectedRoute allowedRole="recruiter">
                        <RecruiterNotifications />
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <ManageUsers />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/jobs"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <ManageJobs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/applications"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <ManageApplications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/analytics"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminAnalytics />
                    </ProtectedRoute>
                }
            />

            {/* Invalid Routes */}
            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    );
};

export default App;
