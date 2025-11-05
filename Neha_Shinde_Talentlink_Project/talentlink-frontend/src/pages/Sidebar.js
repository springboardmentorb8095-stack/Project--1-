import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const clientLinks = [
    { label: 'Dashboard Overview', path: '/dashboard' },
    { label: 'Create Project', path: '/create-project' },
    { label: 'My Projects', path: '/my-projects' },
    { label: 'Manage Proposals', path: '/projects/1' },
    { label: 'Contracts', path: '/contracts' },
    { label: 'Reviews', path: '/projects/1' },
    { label: 'Messages', path: '/messages' },
  ];

  const freelancerLinks = [
    { label: 'Dashboard Overview', path: '/dashboard' },
    { label: 'Browse Projects', path: '/my-projects' },
    { label: 'My Proposals', path: '/projects/1' },
    { label: 'Contracts', path: '/contracts' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Messages', path: '/messages' },
  ];

  const links = role === 'client' ? clientLinks : freelancerLinks;

  return (
    <div className="sidebar">
      <h4 className="text-white mb-4">Dashboard</h4>
      <ul className="nav flex-column">
        {links.map((link, i) => (
          <li key={i} className="mb-2">
            <Link to={link.path} className="text-white text-decoration-none">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
