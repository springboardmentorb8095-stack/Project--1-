import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from './DashboardLayout';
import NotificationBell from '../components/NotificationBell'; // adjust path if needed


function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return setLoading(false);
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/profiles/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profiles = res.data;
        if (!Array.isArray(profiles) || profiles.length === 0 || !profiles[0]?.user) {
          toast.info('Redirecting to profile setup...');
          setTimeout(() => navigate('/profile-setup'), 1500);
        } else {
          setProfile(profiles[0]);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  useEffect(() => {
    if (!profile) return;
    const fetchRoleData = async () => {
      try {
        const endpoint =
          profile.role === 'freelancer'
            ? 'http://127.0.0.1:8000/api/proposals/'
            : 'http://127.0.0.1:8000/api/projects/';
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        profile.role === 'freelancer' ? setProposals(res.data) : setProjects(res.data);
      } catch (err) {
        console.error('Role data fetch error:', err);
        toast.error('Failed to load role-specific data.');
      }
    };
    fetchRoleData();
  }, [profile, token]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">No profile found. Redirecting to setup...</div>
      </div>
    );
  }

  return (
    <DashboardLayout role={profile.role}>
      <div className="fade-in container py-4">
        {/* Banner */}
        {/* Banner */}
<div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
  <div className="d-flex align-items-center">
    <div
      className="rounded-circle bg-white text-primary fw-bold d-flex justify-content-center align-items-center shadow-sm"
      style={{ width: '60px', height: '60px', fontSize: '1.8rem' }}
    >
      {profile.user?.username?.charAt(0).toUpperCase() || 'U'}
    </div>
    <div className="ms-3">
      <h3 className="mb-1 fw-semibold">
        Welcome, {profile.user?.username || 'User'} 👋
      </h3>
      <small className="text-light">Here’s your personalized dashboard</small>
    </div>
  </div>
  <div className="d-flex align-items-center gap-3">
    <NotificationBell /> {/* ✅ Added bell here */}
    <button className="btn btn-light btn-sm me-2" onClick={() => window.location.reload()}>
      <i className="bi bi-arrow-clockwise me-1"></i> Refresh
    </button>
    <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/edit-profile')}>
      <i className="bi bi-pencil-square me-1"></i> Edit Profile
    </button>
  </div>
</div>


        {/* Profile Info */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card p-3 text-center shadow-sm">
              <h6 className="text-muted">Role</h6>
              <p className="fw-semibold">{profile.role}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 text-center shadow-sm">
              <h6 className="text-muted">Hourly Rate</h6>
              <p className="fw-semibold">₹{profile.hourly_rate}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 text-center shadow-sm">
              <h6 className="text-muted">Availability</h6>
              <p className="fw-semibold">{profile.availability ? 'Available' : 'Not Available'}</p>
            </div>
          </div>
          <div className="col-12">
            <div className="card p-3 shadow-sm">
              <h6 className="text-muted">Bio</h6>
              <p>{profile.bio || 'No bio added yet.'}</p>
            </div>
          </div>
        </div>

        {/* Freelancer Section */}
        {profile.role === 'freelancer' && (
          <div className="mt-5">
            <h5 className="mb-3 text-white">Your Proposals</h5>
            {proposals.length > 0 ? (
              <div className="row g-4">
                {proposals.map((p) => (
                  <div key={p.id} className="col-md-6 col-lg-4">
                    <div className="card p-3 shadow-sm h-100">
                      <h6>
                        <strong>Project:</strong>{' '}
                        <a href={`/projects/${p.project}`} className="text-decoration-none text-primary">
                          View
                        </a>
                      </h6>
                      <p><strong>Bid:</strong> ₹{p.proposed_rate}</p>
                      <p><strong>Timeline:</strong> {p.timeline_weeks} weeks</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        {p.accepted ? (
                          <span className="badge bg-success ms-2">
                            <i className="bi bi-check-circle me-1"></i> Accepted
                          </span>
                        ) : (
                          <span className="badge bg-warning text-dark ms-2">
                            <i className="bi bi-hourglass-split me-1"></i> Pending
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state text-center mt-3">
                <i className="bi bi-envelope-paper empty-icon fs-1 text-light"></i>
                <p className="text-light">You haven’t submitted any proposals yet.</p>
                <button className="btn btn-outline-light btn-sm">Browse Projects</button>
              </div>
            )}
          </div>
        )}

        {/* Client Section */}
        {profile.role === 'client' && (
          <div className="mt-5">
            <h5 className="mb-3 text-white">Your Posted Projects</h5>
            {projects.length > 0 ? (
              <div className="row g-4">
                {projects.map((project) => (
                  <div key={project.id} className="col-md-6 col-lg-4">
                    <div className="card p-3 shadow-sm h-100 d-flex flex-column justify-content-between">
                      <div>
                        <h6 className="fw-bold text-primary">{project.title}</h6>
                        <p><strong>Budget:</strong> ₹{project.budget}</p>
                        <p><strong>Duration:</strong> {project.duration_weeks} weeks</p>
                      </div>
                      <a
                        href={`/projects/${project.id}`}
                        className="btn btn-sm btn-outline-primary mt-2 align-self-start"
                      >
                        Manage Proposals
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state text-center mt-3">
                <i className="bi bi-folder2-open empty-icon fs-1 text-light"></i>
                <p className="text-light">You haven’t posted any projects yet.</p>
                <button className="btn btn-outline-light btn-sm">Post a Project</button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
