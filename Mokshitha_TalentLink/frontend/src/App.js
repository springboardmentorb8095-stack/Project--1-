import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages-mokshi/Home";
import Register from "./pages-mokshi/Register";
import Login from "./pages-mokshi/Login";
import RoleSelection from "./pages-mokshi/RoleSelection";
import ProfilePage from "./pages-mokshi/ProfilePage";
import ClientDashboard from "./pages-mokshi/ClientDashboard";
import FreelancerDashboard from "./pages-mokshi/FreelancerDashboard";
import ProjectFeed from "./pages-mokshi/ProjectFeed";
import ProjectDetails from "./pages-mokshi/ProjectDetails";
import ProposalForm from "./pages-mokshi/ProposalForm";
import ChatPage from "./pages-mokshi/ChatPage";
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
        <Route path="/chat/:contractId" element={<ChatPage />} />

      </Routes>
    </Router>
  );
}

export default App;
