import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-white">
      <h1 className="display-4 mb-3">404 — Page Not Found</h1>
      <p className="lead mb-4">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">Go to Homepage</Link>
    </div>
  );
}

export default NotFoundPage;
