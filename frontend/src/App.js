import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import ProfilePage from "./pages/ProfilePage";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ProjectFeed from "./pages/ProjectFeed";
import ProjectDetails from "./pages/ProjectDetails";
import ProposalForm from "./pages/ProposalForm";

function App() {
  const profileId = localStorage.getItem("profileId");

  return (
    <Router>
      <Routes>
        {/* 🌟 Common Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role" element={<RoleSelection profileId={profileId} />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* 💼 Client Pages */}
        <Route path="/client-dashboard" element={<ClientDashboard />} />

        {/* 🧑‍💻 Freelancer Pages */}
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/feed" element={<ProjectFeed />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/project/:id/propose" element={<ProposalForm />} />
      </Routes>
    </Router>
  );
}

export default App;
