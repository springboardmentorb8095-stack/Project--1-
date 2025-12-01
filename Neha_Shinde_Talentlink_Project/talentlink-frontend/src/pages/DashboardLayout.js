import React, { useEffect } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ role, children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const resolvedRole = role || storedUser?.profile?.role || 'client';

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .dashboard-wrapper {
        display: flex;
        min-height: 100vh;
        font-family: 'Segoe UI', sans-serif;
      }

      .sidebar {
        width: 220px;
        background: #4c1d95;
        padding: 2rem 1rem;
        color: white;
        box-shadow: 2px 0 8px rgba(0,0,0,0.1);
      }

      .sidebar h4 {
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
      }

      .sidebar ul {
        list-style: none;
        padding-left: 0;
      }

      .sidebar li {
        margin-bottom: 1rem;
      }

      .sidebar a {
        color: white;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .sidebar a:hover {
        color: #c4b5fd;
        text-decoration: underline;
      }

      .main-content {
        flex: 1;
        padding: 2rem;
        background: linear-gradient(to right, #6a11cb, #2575fc);
        overflow-y: auto;
      }

      @media (max-width: 768px) {
        .dashboard-wrapper {
          flex-direction: column;
        }

        .sidebar {
          width: 100%;
          padding: 1rem;
          text-align: center;
        }

        .main-content {
          padding: 1rem;
        }
      }
    `;
    document.head.appendChild(styleTag);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <Sidebar role={resolvedRole} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
