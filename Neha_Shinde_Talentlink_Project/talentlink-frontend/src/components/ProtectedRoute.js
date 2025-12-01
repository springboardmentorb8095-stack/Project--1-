import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  const isValidToken = () => {
    // Basic JWT format check: eyJ... (header.payload.signature)
    return token && /^ey[\w-]+\.[\w-]+\.[\w-]+$/.test(token);
  };

  return isValidToken() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
