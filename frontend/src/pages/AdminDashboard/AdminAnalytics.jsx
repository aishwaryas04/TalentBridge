
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    BarChart3,
    LogOut,
    UserPlus,
    TrendingUp,
    Building2,
} from "lucide-react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

import "./AdminAnalytics.css";

const AdminAnalytics = () => {
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState({
        userTrends: [],
        jobTrends: [],
        applicationTrends: [],
        recruiterActivity: [],
        applicationStatus: [],
    });

    const [selectedRange, setSelectedRange] = useState("6months");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch analytics based on selected date range
    const fetchAnalytics = async (range) => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/admin/analytics",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        range: range,
                    },
                }
            );

            setAnalytics(response.data.analytics);
        } catch (error) {
            console.error("Analytics error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load analytics data"
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch whenever the selected range changes
    useEffect(() => {
        fetchAnalytics(selectedRange);
    }, [selectedRange]);


// Export analytics data as CSV
const handleExportCSV = () => {
    const exportDate = new Date().toLocaleString("en-IN");

const rows = [
    ["TalentBridge - Platform Analytics"],
    ["Exported On", exportDate],
    ["Selected Range", selectedRange],
        [],
        ["User Registration Trends"],
        ["Year", "Month", "Day", "Role", "Count"],

        ...analytics.userTrends.map((item) => [
            item._id.year,
            item._id.month,
            item._id.day || "",
            item._id.role,
            item.count
        ]),

        [],
        ["Job Posting Trends"],
        ["Year", "Month", "Day", "Count"],

        ...analytics.jobTrends.map((item) => [
            item._id.year,
            item._id.month,
            item._id.day || "",
            item.count
        ]),

        [],
        ["Application Trends"],
        ["Year", "Month", "Day", "Count"],

        ...analytics.applicationTrends.map((item) => [
            item._id.year,
            item._id.month,
            item._id.day || "",
            item.count
        ]),

        [],
        ["Application Status"],
        ["Status", "Count"],

        ...analytics.applicationStatus.map((item) => [
            item._id,
            item.count
        ]),

        [],
        ["Top Recruiters"],
        ["Recruiter Name", "Company", "Total Jobs"],

        ...analytics.recruiterActivity.map((item) => [
            item.name,
            item.companyName || "Not provided",
            item.totalJobs
        ])
    ];

    const csvContent = rows
        .map((row) =>
            row.map((value) => {
                const text = String(value ?? "");
                return `"${text.replace(/"/g, '""')}"`;
            }).join(",")
        )
        .join("\n");

    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    // link.download = `TalentBridge-Analytics-${selectedRange}.csv`;
    const date = new Date().toISOString().split("T")[0];

link.download = `TalentBridge-Analytics-${selectedRange}-${date}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};


  // Export analytics data as PDF

const handleExportPDF = () => {
    const doc = new jsPDF();

    const exportDate = new Date().toLocaleString("en-IN");

    // Report heading
    doc.setFontSize(20);
    doc.text("TalentBridge - Platform Analytics", 14, 20);

    doc.setFontSize(10);
    doc.text(`Exported On: ${exportDate}`, 14, 30);
    doc.text(`Selected Range: ${selectedRange}`, 14, 37);

    let currentY = 47;

    // Reusable function to add analytics tables
    const addSection = (title, headers, rows) => {
        if (currentY > 250) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(14);
        doc.text(title, 14, currentY);

        autoTable(doc, {
            startY: currentY + 5,
            head: [headers],
            body: rows.length > 0 ? rows : [["No data available"]],
            theme: "grid",
            headStyles: {
                fillColor: [79, 70, 229]
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            margin: { left: 14, right: 14 }
        });

        currentY = doc.lastAutoTable.finalY + 12;
    };

    // User Registration Trends
    addSection(
        "User Registration Trends",
        ["Year", "Month", "Day", "Role", "Count"],
        analytics.userTrends.map((item) => [
            item._id.year,
            item._id.month,
            item._id.day || "-",
            item._id.role,
            item.count
        ])
    );

    // Job Posting Trends
    addSection(
        "Job Posting Trends",
        ["Year", "Month", "Day", "Count"],
        analytics.jobTrends.map((item) => [
            item._id.year,
            item._id.month,
            item._id.day || "-",
            item.count
        ])
    );

    // Application Trends
    addSection(
        "Application Trends",
        ["Year", "Month", "Day", "Count"],
        analytics.applicationTrends.map((item) => [
            item._id.year,
            item._id.month,
            item._id.day || "-",
            item.count
        ])
    );

    // Application Status
    addSection(
        "Application Status",
        ["Status", "Count"],
        analytics.applicationStatus.map((item) => [
            item._id,
            item.count
        ])
    );

    // Top Recruiters
    addSection(
        "Top Recruiters",
        ["Recruiter Name", "Company", "Total Jobs"],
        analytics.recruiterActivity.map((item) => [
            item.name,
            item.companyName || "Not provided",
            item.totalJobs
        ])
    );

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(
            `Page ${i} of ${pageCount}`,
            195,
            285,
            { align: "right" }
        );
    }

    // Download PDF
    const date = new Date().toISOString().split("T")[0];

    doc.save(`TalentBridge-Analytics-${selectedRange}-${date}.pdf`);
};


    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Date range label
    const getRangeLabel = () => {
        switch (selectedRange) {
            case "7days":
                return "Last 7 Days";
            case "30days":
                return "Last 30 Days";
            case "1year":
                return "Last 1 Year";
            default:
                return "Last 6 Months";
        }
    };

    // Prepare chart data for daily and monthly ranges
    const prepareChartData = () => {
        const data = [];
        const currentDate = new Date();

        const isDaily =
            selectedRange === "7days" ||
            selectedRange === "30days";

        let totalPeriods;

        if (selectedRange === "7days") {
            totalPeriods = 8;
        } else if (selectedRange === "30days") {
            totalPeriods = 31;
        } else if (selectedRange === "1year") {
            totalPeriods = 13;
        } else {
            totalPeriods = 6;
        }

        for (let i = totalPeriods - 1; i >= 0; i--) {
            let date;

            if (isDaily) {
                date = new Date(currentDate);
                date.setDate(currentDate.getDate() - i);
            } else {
                date = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - i,
                    1
                );
            }

            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            const matchesDate = (item) => {
                const matchesYearMonth =
                    item._id.year === year &&
                    item._id.month === month;

                if (isDaily) {
                    return (
                        matchesYearMonth &&
                        item._id.day === day
                    );
                }

                return matchesYearMonth;
            };

            const userRecords = analytics.userTrends.filter(
                matchesDate
            );

            const jobs = analytics.jobTrends.find(
                matchesDate
            );

            const applications = analytics.applicationTrends.find(
                matchesDate
            );

            const jobSeekers = userRecords.find(
                (item) => item._id.role === "jobseeker"
            );

            const recruiters = userRecords.find(
                (item) => item._id.role === "recruiter"
            );

            let label;

            if (isDaily) {
                label = date.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                });
            } else if (selectedRange === "1year") {
                label = date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                });
            } else {
                label = date.toLocaleDateString("en-US", {
                    month: "short",
                });
            }

            data.push({
                label,
                jobSeekers: jobSeekers?.count || 0,
                recruiters: recruiters?.count || 0,
                jobs: jobs?.count || 0,
                applications: applications?.count || 0,
            });
        }

        return data;
    };

    const chartData = prepareChartData();

    // Summary card values
    const totalUsers = analytics.userTrends.reduce(
        (total, item) => total + item.count,
        0
    );

    const totalJobs = analytics.jobTrends.reduce(
        (total, item) => total + item.count,
        0
    );

    const totalApplications = analytics.applicationTrends.reduce(
        (total, item) => total + item.count,
        0
    );

    const totalRecruiters = analytics.recruiterActivity.length;

    // Application status colors
    const statusColors = {
        Pending: "#F59E0B",
        "Under Review": "#3B82F6",
        Shortlisted: "#8B5CF6",
        Rejected: "#EF4444",
        Hired: "#10B981",
    };

    const pieData = analytics.applicationStatus.map((item) => ({
        name: item._id || "Unknown",
        value: item.count,
    }));

    if (loading) {
        return (
            <div className="analytics-loading">
                Loading analytics...
            </div>
        );
    }

    return (
        <div className="admin-analytics">

            {/* Sidebar */}
            <aside className="analytics-sidebar">

                <div className="analytics-logo">
                    <div className="analytics-logo-icon">T</div>
                    <h2>TalentBridge</h2>
                </div>

                <div className="analytics-admin-info">
                    <div className="analytics-admin-avatar">A</div>

                    <div>
                        <h4>Administrator</h4>
                        <p>Platform Admin</p>
                    </div>
                </div>

                <nav className="analytics-nav">

                    <p className="analytics-nav-heading">
                        MAIN MENU
                    </p>

                    <Link to="/admin/dashboard">
                        <LayoutDashboard size={19} />
                        Dashboard
                    </Link>

                    <Link to="/admin/users">
                        <Users size={19} />
                        Manage Users
                    </Link>

                    <Link to="/admin/jobs">
                        <Briefcase size={19} />
                        Manage Jobs
                    </Link>

                    <Link to="/admin/applications">
                        <FileText size={19} />
                        Manage Applications
                    </Link>

                    <Link to="/admin/analytics" className="active">
                        <BarChart3 size={19} />
                        Analytics
                    </Link>

                </nav>

                <button
                    className="analytics-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={19} />
                    Logout
                </button>

            </aside>

            {/* Main Content */}
            <main className="analytics-main">

                {/* Header */}
                <header className="analytics-header">

                    <div>
                        <h1>Platform Analytics</h1>
                        <p>
                            Track registrations, job postings and
                            application activity.
                        </p>
                    </div>

                    <div style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap"
}}>
    <button
        onClick={handleExportCSV}
        style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 16px",
            background: "#4F46E5",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px"
        }}
    >
        <FileText size={18} />
        Export CSV
    </button>

    <button
    onClick={handleExportPDF}
    style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "11px 16px",
        background: "#DC2626",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px"
    }}
>
    <FileText size={18} />
    Export PDF
</button>

    <div className="analytics-header-badge">
        <BarChart3 size={18} />
        Admin Analytics
    </div>
</div>

                </header>

                {error && (
                    <div className="analytics-error">
                        {error}
                    </div>
                )}

                {/* Date Range Filter */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "22px",
                        flexWrap: "wrap",
                    }}
                >
                    <label
                        htmlFor="analytics-range"
                        style={{ fontWeight: "600" }}
                    >
                        Filter by:
                    </label>

                    <select
                        id="analytics-range"
                        value={selectedRange}
                        onChange={(e) =>
                            setSelectedRange(e.target.value)
                        }
                        style={{
                            padding: "10px 14px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            background: "#ffffff",
                            fontSize: "14px",
                            cursor: "pointer",
                            outline: "none",
                        }}
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="1year">Last 1 Year</option>
                    </select>
                </div>

                {/* Summary Cards */}
                <section className="analytics-summary">

                    <div className="analytics-summary-card">
                        <div className="analytics-card-icon purple">
                            <UserPlus size={23} />
                        </div>

                        <div>
                            <p>New Registrations</p>
                            <h2>{totalUsers}</h2>
                            <span>{getRangeLabel()}</span>
                        </div>
                    </div>

                    <div className="analytics-summary-card">
                        <div className="analytics-card-icon blue">
                            <Briefcase size={23} />
                        </div>

                        <div>
                            <p>New Job Postings</p>
                            <h2>{totalJobs}</h2>
                            <span>{getRangeLabel()}</span>
                        </div>
                    </div>

                    <div className="analytics-summary-card">
                        <div className="analytics-card-icon green">
                            <FileText size={23} />
                        </div>

                        <div>
                            <p>New Applications</p>
                            <h2>{totalApplications}</h2>
                            <span>{getRangeLabel()}</span>
                        </div>
                    </div>

                    <div className="analytics-summary-card">
                        <div className="analytics-card-icon orange">
                            <Building2 size={23} />
                        </div>

                        <div>
                            <p>Active Recruiters</p>
                            <h2>{totalRecruiters}</h2>
                            <span>With job postings in this period</span>
                        </div>
                    </div>

                </section>

                {/* User Registration Chart */}
                <section className="analytics-chart-card">

                    <div className="analytics-section-heading">
                        <div>
                            <h2>User Registration Trends</h2>
                            <p>
                                {selectedRange === "7days" ||
                                selectedRange === "30days"
                                    ? "Daily job seeker and recruiter registrations"
                                    : "Monthly job seeker and recruiter registrations"}
                            </p>
                        </div>

                        <TrendingUp size={22} />
                    </div>

                    <div className="analytics-chart">

                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis dataKey="label" />

                                <YAxis allowDecimals={false} />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="jobSeekers"
                                    name="Job Seekers"
                                    stroke="#6366F1"
                                    strokeWidth={3}
                                    activeDot={{ r: 7 }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="recruiters"
                                    name="Recruiters"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    activeDot={{ r: 7 }}
                                />

                            </LineChart>
                        </ResponsiveContainer>

                    </div>

                </section>

                {/* Job and Application Activity */}
                <section className="analytics-chart-card">

                    <div className="analytics-section-heading">
                        <div>
                            <h2>Platform Activity</h2>
                            <p>
                                {selectedRange === "7days" ||
                                selectedRange === "30days"
                                    ? "Daily job postings and applications"
                                    : "Monthly job postings and applications"}
                            </p>
                        </div>

                        <BarChart3 size={22} />
                    </div>

                    <div className="analytics-chart">

                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis dataKey="label" />

                                <YAxis allowDecimals={false} />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="jobs"
                                    name="Job Postings"
                                    fill="#6366F1"
                                    radius={[6, 6, 0, 0]}
                                />

                                <Bar
                                    dataKey="applications"
                                    name="Applications"
                                    fill="#10B981"
                                    radius={[6, 6, 0, 0]}
                                />

                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </section>

                {/* Bottom Analytics */}
                <section className="analytics-bottom-grid">

                    {/* Application Status */}
                    <div className="analytics-chart-card">

                        <div className="analytics-section-heading">
                            <div>
                                <h2>Application Status</h2>
                                <p>Application distribution</p>
                            </div>
                        </div>

                        {pieData.length > 0 ? (

                            <div className="analytics-pie-chart">

                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>

                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={105}
                                            label={({ name, percent }) =>
                                                `${name} ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={`status-${index}`}
                                                    fill={
                                                        statusColors[entry.name] ||
                                                        "#94A3B8"
                                                    }
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                        <Legend />

                                    </PieChart>
                                </ResponsiveContainer>

                            </div>

                        ) : (

                            <p className="analytics-empty">
                                No application data available.
                            </p>

                        )}

                    </div>

                    {/* Top Recruiters */}
                    <div className="analytics-chart-card">

                        <div className="analytics-section-heading">
                            <div>
                                <h2>Top Recruiters</h2>
                                <p>
                                    Recruiters with the most job postings
                                    in this period
                                </p>
                            </div>
                        </div>

                        <div className="analytics-recruiter-list">

                            {analytics.recruiterActivity.length > 0 ? (

                                analytics.recruiterActivity.map(
                                    (recruiter, index) => (

                                        <div
                                            className="analytics-recruiter-item"
                                            key={recruiter._id}
                                        >

                                            <div className="analytics-recruiter-rank">
                                                {index + 1}
                                            </div>

                                            <div className="analytics-recruiter-details">
                                                <h4>{recruiter.name}</h4>

                                                <p>
                                                    {recruiter.companyName ||
                                                        "Company not provided"}
                                                </p>
                                            </div>

                                            <div className="analytics-job-count">
                                                {recruiter.totalJobs} Jobs
                                            </div>

                                        </div>
                                    )
                                )

                            ) : (

                                <p className="analytics-empty">
                                    No recruiter activity available.
                                </p>

                            )}

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default AdminAnalytics;
