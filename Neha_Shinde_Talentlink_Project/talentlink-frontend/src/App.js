import { useLocation } from 'react-router-dom';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage'; // ✅ Corrected import name
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProjectsPage from './pages/ProjectsPage';
import HowItWorksPage from "./pages/HowItWorksPage";
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import ProjectForm from './pages/ProjectForm';
import ProjectFeed from './pages/ProjectFeed';
import ProjectDetail from './pages/ProjectDetail';
import CreateContractForm from './components/CreateContractForm';
import NotFoundPage from './pages/NotFoundPage';
import MessagesPage from './pages/MessagesPage';
import ContractsPage from './pages/ContractsPage';
import ReviewForm from './pages/ReviewForm';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const protectedRoutes = [
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/profile-setup', element: <ProfileSetup /> },
    { path: '/projects/:id', element: <ProjectDetail /> },
    { path: '/project-feed', element: <ProjectFeed /> },
    { path: '/create-contract', element: <CreateContractForm /> },
    { path: '/my-projects', element: <ProjectFeed /> },
    { path: '/contracts', element: <ContractsPage /> },
    { path: '/reviews', element: <ReviewForm /> },
  ];

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} /> {/* ✅ Corrected route path and component */}
        <Route path="/work" element={<HowItWorksPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-project" element={<ProjectForm />} />
        <Route path="/my-projects" element={<ProjectFeed />} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

        {protectedRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
        ))}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
