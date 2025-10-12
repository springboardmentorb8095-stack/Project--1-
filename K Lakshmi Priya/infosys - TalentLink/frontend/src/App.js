// src/App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import PortfolioForm from "./pages/PortfolioForm";

import ProjectDetails from "./pages/ProjectDetails"; //Optional — you now use ProposalForm
import ProposalForm from "./pages/ProposalForm";

import ProjectForm from "./pages/ProjectForm";
import ProjectList from "./pages/ProjectList";

import ProposalView from "./pages/ProposalView";

// inside your <Routes> component


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/add" element={<PortfolioForm />} />

        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/projects/edit/:id" element={<ProjectForm isEdit={true} />} />

        <Route path="/proposals/new/:id" element={<ProposalForm />} />
        <Route path="/proposals/edit/:proposalId" element={<ProposalForm />} />
        
        <Route path="/proposals/view/:id" element={<ProposalView />} />
      </Routes>
    </Router>
  );
}

export default App;
