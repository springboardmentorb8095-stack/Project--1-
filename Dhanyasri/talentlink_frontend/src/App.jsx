import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FindFreelancers from "./pages/FindFreelancers";
import FindProjects from "./pages/FindProjects";
import Dashboard from "./pages/Dashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Contracts from "./pages/Contracts";
import Messages from "./pages/Messages";
import FreelancerProfile from "./pages/FreelancerProfile";
import ClientProfile from "./pages/ClientProfile";
import Notifications from "./pages/Notifications"; // 🆕 Added

// Theme Context + Global Toggle
import { ThemeProvider } from "./theme/ThemeContext";
import ThemeToggle from "./theme/ThemeToggle";

import "./index.css";

function App() {
  return (
    <ThemeProvider>
      {/* 🌙 Global Theme Toggle */}
      <div
        style={{
          position: "fixed",
          top: "12px",
          right: "16px",
          zIndex: 999,
        }}
      >
        <ThemeToggle />
      </div>

      {/* 🧭 App Routes */}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/freelancerdashboard" element={<FreelancerDashboard />} />
        <Route path="/find-freelancers" element={<FindFreelancers />} />
        <Route path="/find-projects" element={<FindProjects />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} /> {/* 🆕 Added Route */}
        <Route path="/freelancer/profile" element={<FreelancerProfile />} />
        <Route path="/client/profile" element={<ClientProfile />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
