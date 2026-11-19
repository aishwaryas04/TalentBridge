
import React from "react";
import { Link } from "react-router-dom";
import {
    BriefcaseBusiness,
    Users,
    TrendingUp,
    Search,
    Building2,
    UserCheck,
    ArrowRight,
    CheckCircle
} from "lucide-react";
import "./Home.css";

const Home = () => {
    return (
        <div className="home-page">

            {/* Navbar */}
            <nav className="home-navbar">
                <Link to="/" className="home-logo">
                    <BriefcaseBusiness size={27} />
                    <span>TalentBridge</span>
                </Link>

                <div className="home-nav-links">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#features">Features</a>
                </div>

                <div className="home-nav-buttons">
                    <Link to="/login" className="home-login-btn">
                        Login
                    </Link>
                    <Link to="/register" className="home-register-btn">
                        Register
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="home-hero" id="home">
                <div className="hero-content">
                    <div className="hero-tag">
                        <span></span>
                        Your Career Journey Starts Here
                    </div>

                    <h1>
                        Find Your Dream Job.
                        <br />
                        <span>Build Your Future.</span>
                    </h1>

                    <p>
                        Welcome to TalentBridge! Your trusted platform to
                        discover exciting job opportunities, connect with
                        employers, and take the next step in your career.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/register" className="hero-primary-btn">
                            Get Started <ArrowRight size={19} />
                        </Link>

                        <Link to="/login" className="hero-secondary-btn">
                            Login to Your Account
                        </Link>
                    </div>

                    <div className="hero-benefits">
                        <span><CheckCircle size={17} /> Explore Opportunities</span>
                        <span><CheckCircle size={17} /> Connect with Recruiters</span>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-main-card">
                        <div className="hero-card-top">
                            <div className="hero-card-icon">
                                <BriefcaseBusiness size={27} />
                            </div>
                            <span className="hiring-status">Career Opportunities</span>
                        </div>

                        <h3>Your Next Opportunity Awaits</h3>
                        <p>Take the next step towards your professional goals.</p>

                        <div className="hero-search-box">
                            <Search size={19} />
                            <span>Find your perfect opportunity...</span>
                        </div>

                        <div className="hero-card-bottom">
                            <div>
                                <strong>Discover</strong>
                                <span>New opportunities</span>
                            </div>
                            <div>
                                <strong>Connect</strong>
                                <span>With employers</span>
                            </div>
                        </div>
                    </div>

                    <div className="floating-card floating-card-one">
                        <UserCheck size={22} />
                        <div>
                            <strong>For Job Seekers</strong>
                            <span>Find your career path</span>
                        </div>
                    </div>

                    <div className="floating-card floating-card-two">
                        <Building2 size={22} />
                        <div>
                            <strong>For Recruiters</strong>
                            <span>Find the right talent</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="home-about" id="about">
                <div className="section-heading">
                    <span>ABOUT TALENTBRIDGE</span>
                    <h2>Bringing Talent and Opportunities Together</h2>
                    <p>
                        TalentBridge makes the job search and recruitment
                        process easier by connecting job seekers with
                        recruiters through one convenient platform.
                    </p>
                </div>

                <div className="home-stats">
                    <div className="stat-item">
                        <BriefcaseBusiness size={27} />
                        <h3>Discover Jobs</h3>
                        <p>Explore opportunities that match your skills.</p>
                    </div>

                    <div className="stat-item">
                        <Users size={27} />
                        <h3>Connect with Talent</h3>
                        <p>Bring job seekers and recruiters together.</p>
                    </div>

                    <div className="stat-item">
                        <TrendingUp size={27} />
                        <h3>Grow Your Career</h3>
                        <p>Move forward towards your professional goals.</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="home-features" id="features">
                <div className="section-heading">
                    <span>WHY TALENTBRIDGE?</span>
                    <h2>Everything You Need in One Place</h2>
                    <p>
                        Whether you are looking for a job or hiring
                        professionals, TalentBridge helps you get started.
                    </p>
                </div>

                <div className="feature-cards">
                    <div className="feature-card">
                        <div className="feature-icon blue-icon">
                            <Search size={25} />
                        </div>
                        <h3>Find Jobs Easily</h3>
                        <p>
                            Browse job opportunities, apply for positions
                            and track your applications.
                        </p>
                        <Link to="/register">
                            Explore More <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon purple-icon">
                            <Building2 size={25} />
                        </div>
                        <h3>Recruit Top Talent</h3>
                        <p>
                            Post job openings, manage applications and
                            connect with potential candidates.
                        </p>
                        <Link to="/register">
                            Get Started <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon green-icon">
                            <TrendingUp size={25} />
                        </div>
                        <h3>Track Your Progress</h3>
                        <p>
                            Manage your job applications and stay updated
                            throughout the recruitment process.
                        </p>
                        <Link to="/register">
                            Join Us <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="home-cta">
                <h2>Ready to Take the Next Step?</h2>
                <p>
                    Create your account today and start exploring
                    opportunities with TalentBridge.
                </p>
                <Link to="/register">
                    Create Your Account <ArrowRight size={18} />
                </Link>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <Link to="/" className="footer-logo">
                    <BriefcaseBusiness size={23} />
                    TalentBridge
                </Link>

                <p>
                    Connecting talent with opportunities.
                </p>

                <span>© {new Date().getFullYear()} TalentBridge. All rights reserved.</span>
            </footer>

        </div>
    );
};

export default Home;
