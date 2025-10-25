import React from "react";
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
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
      <Route path="/freelancer/profile" element={<FreelancerProfile />} />
      <Route path="/client/profile" element={<ClientProfile />} />
    </Routes>
  );
}

export default App;
