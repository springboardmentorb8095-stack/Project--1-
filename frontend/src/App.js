import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Profile_Client from "./pages/Profile_Client";
import Profile_Freelancer from "./pages/Profile_Freelancer";
import MyProfile from "./pages/MyProfile";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ProjectsPage from "./pages/ProjectsPage";
import MyProjects from "./pages/MyProjects";
import PostProject from "./pages/PostProject";
import HomePage from "./pages/HomePage";
import "./pages/Auth.css";

// ✅ Header Component (Back + Greeting + Theme Toggle)
function HeaderBar({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  if (!user) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: theme === "dark" ? "#181818" : "#f0f4ff",
        color: theme === "dark" ? "#ffffff" : "#000000",
        borderBottom: theme === "dark" ? "1px solid #333" : "1px solid #dbeafe",
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "0.3s ease-in-out",
      }}
    >
      <button
        onClick={() => navigate("/homepage")} // ✅ Back always goes to HomePage
        style={{
          background: "none",
          border: "none",
          color: theme === "dark" ? "#90caf9" : "#007bff",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ⬅ Back
      </button>

      <div style={{ fontSize: "18px", fontWeight: "600" }}>
        {greeting}, {user?.username || "User"} 👋
      </div>

      {/* ✅ Light/Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          background: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#333",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "6px 12px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
}

// ✅ Layout Wrapper
function Layout({ children, theme, toggleTheme }) {
  const location = useLocation();
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    // ✅ Hide header on home, homepage, login, register, and dashboard related pages
    if (
      location.pathname === "/" ||
      location.pathname === "/homepage" ||
      location.pathname.includes("login") ||
      location.pathname.includes("register") ||
      location.pathname.includes("dashboard") ||
      location.pathname.includes("projects") ||
      location.pathname.includes("my-projects") ||
      location.pathname.includes("post-project")
    ) {
      setHideHeader(true);
    } else {
      setHideHeader(false);
    }
  }, [location]);

  const showTopBar =
    location.pathname.includes("dashboard") ||
    location.pathname.includes("projects") ||
    location.pathname.includes("my-projects") ||
    location.pathname.includes("post-project");

  return (
    <div
      style={{
        padding: "20px",
        position: "relative",
        background: theme === "dark" ? "#121212" : "#ffffff",
        color: theme === "dark" ? "#eaeaea" : "#000000",
        minHeight: "100vh",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* ✅ Show Top Bar (Back + Greeting + Theme) */}
      {showTopBar && <HeaderBar theme={theme} toggleTheme={toggleTheme} />}

      {/* ✅ Hide My Profile + Nav Header on pages like login/register/dashboard */}
      {!hideHeader && (
        <>
          <Link
            to="/my-profile"
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              backgroundColor: theme === "dark" ? "#2563eb" : "#007bff",
              color: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            👤 My Profile
          </Link>

          <h2 style={{ textAlign: "center" }}>🔑 My App</h2>
          <nav style={{ textAlign: "center" }}>
            <Link
              to="/"
              style={{
                marginRight: "10px",
                color: theme === "dark" ? "#90caf9" : "#007bff",
              }}
            >
              Home
            </Link>
            <Link
              to="/register"
              style={{
                marginRight: "10px",
                color: theme === "dark" ? "#90caf9" : "#007bff",
              }}
            >
              Register
            </Link>
            <Link
              to="/login"
              style={{
                color: theme === "dark" ? "#90caf9" : "#007bff",
              }}
            >
              Login
            </Link>
          </nav>
          <hr style={{ borderColor: theme === "dark" ? "#333" : "#ccc" }} />
        </>
      )}

      {children}
    </div>
  );
}

// ✅ Main App Component
function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Router>
      <Layout theme={theme} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/client-profile" element={<Profile_Client />} />
          <Route path="/freelancer-profile" element={<Profile_Freelancer />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/homepage" element={<HomePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
