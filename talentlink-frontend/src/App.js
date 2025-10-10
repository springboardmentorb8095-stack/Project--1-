import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import ProjectForm from './pages/ProjectForm';
import ProjectFeed from './pages/ProjectFeed';
import ProjectDetail from './pages/ProjectDetail';


function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* ✅ Only one homepage route */}
        <Route path="/" element={<HomePage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-project" element={<ProjectForm />} />
      <Route path="/my-projects" element={<ProjectFeed />} />
       
        <Route
  path="/project-feed"
  element={
    <ProtectedRoute>
      <ProjectFeed />
    </ProtectedRoute>
  }
/>

<Route
  path="/projects/:id"
  element={
    <ProtectedRoute>
      <ProjectDetail />
    </ProtectedRoute>
  }
/>


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />
      </Routes>
      
    </Router>
  );
}

export default App;
