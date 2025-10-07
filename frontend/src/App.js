import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import "./pages/Auth.css";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ViewProposals from "./pages/ViewProposals";
import EarningsPage from "./pages/EarningsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ApplyPage from "./pages/ApplyPage";
import ProfilesPage from "./pages/ProfilesPage";
import ProjectsSearchPage from "./pages/ProjectsSearchPage";


function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h2>🔑 My App</h2>
        <nav>
          <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
          <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
          <Link to="/login">Login</Link>
        </nav>
        <hr />
        <Routes>
  <Route path="/" element={<h3>🏠 Welcome to Home Page</h3>} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/client-dashboard" element={<ClientDashboard />} />
  <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
  <Route path="/view-proposals" element={<ViewProposals />} />
  <Route path="/earnings" element={<EarningsPage />} />
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/projects/:id/apply" element={<ApplyPage />} />
  <Route path="/profiles" element={<ProfilesPage />} />
  <Route path="/projects-search" element={<ProjectsSearchPage />} />

</Routes>

      </div>
    </Router>
  );
}

export default App;
