import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className={`homepage ${darkMode ? "dark" : "light"}`}>
      {/* ✅ Header */}
      <header className="homepage-header">
        <h1 className="logo">FreelancePro 🌐</h1>

        <div className="header-right">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* ✅ Login button moved to top-right */}
          <Link to="/login" className="btn login-top-btn">
            Login 🔑
          </Link>
        </div>
      </header>

      {/* ✅ Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2 className="animated-text">
            Welcome to <span>FreelancePro</span>
          </h2>
          <p>
            Find top freelancers and clients across the globe 🌍.  
            Post projects, hire experts, and build your dream career — all in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn primary-btn">
              Get Started 🚀
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="footer">
        <p>© 2025 FreelancePro | Connect. Work. Grow.</p>
      </footer>
    </div>
  );
}

export default HomePage;
