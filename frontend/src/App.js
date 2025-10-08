import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Profile_Client from "./pages/Profile_Client";
import Profile_Freelancer from "./pages/Profile_Freelancer";
import MyProfile from "./pages/MyProfile";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import "./pages/Auth.css";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px", position: "relative" }}>
        {/* ✅ My Profile Button */}
        <Link
          to="/my-profile"
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            backgroundColor: "#007bff",
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
          <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
          <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
          <Link to="/login">Login</Link>
        </nav>
        <hr />

        <Routes>
          <Route path="/" element={<h3>🏠 Welcome to Home Page</h3>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/client-profile" element={<Profile_Client />} />
          <Route path="/freelancer-profile" element={<Profile_Freelancer />} />
          <Route path="/my-profile" element={<MyProfile />} />

          {/* ✅ Added Dashboard Routes */}
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
