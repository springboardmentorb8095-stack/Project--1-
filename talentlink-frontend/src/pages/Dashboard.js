import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  // ---------- Enhanced Inline CSS Styles ----------
  const styles = `
  .fade-in {
    animation: fadeIn 0.6s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hover-lift {
    transition: all 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1) !important;
  }

  /* Layout */
  .dashboard-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    padding: 2rem 4%;
    background: linear-gradient(120deg, #6a11cb 0%, #2575fc 100%);
  }

  /* Banner */
  .dashboard-banner {
    background: linear-gradient(135deg, #0061ff 0%, #60efff 100%);
    color: white;
    border-radius: 1rem;
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
    padding: 2rem;
  }

  /* Card */
  .dashboard-card {
    border: none;
    border-radius: 1rem;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    background: linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%);
    color: #333;
    padding: 1.6rem;
  }

  /* Typography */
  .dashboard-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #4c1d95;
  }
  .dashboard-subtitle {
    font-weight: 500;
    color: #5b21b6;
  }

  /* Badges */
  .dashboard-badge {
    padding: 0.4rem 0.8rem;
    border-radius: 50px;
    font-size: 0.9rem;
  }

  /* Empty states */
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  .empty-icon {
    font-size: 2.5rem;
    color: #9ca3af;
    margin-bottom: 0.5rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .dashboard-container {
      padding: 1.5rem;
    }
    .dashboard-banner {
      flex-direction: column;
      text-align: center;
    }
    .dashboard-banner .btn {
      margin-top: 0.5rem;
    }
    .card {
      margin-bottom: 1rem;
    }
  }
  `;

  // inject styles once
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
  }, []);

  // ---------- Fetch Profile ----------
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return setLoading(false);
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/profiles/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedProfile = res.data[0];
        if (!fetchedProfile || !fetchedProfile.user) {
          toast.info('Redirecting to profile setup...');
          setTimeout(() => navigate('/profile-setup'), 1500);
        } else {
          setProfile(fetchedProfile);
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

  // ---------- Fetch Role-Based Data ----------
  useEffect(() => {
    if (!profile) return;
    const fetchRoleData = async () => {
      try {
        if (profile.role === 'freelancer') {
          const res = await axios.get('http://127.0.0.1:8000/api/proposals/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProposals(res.data);
        } else if (profile.role === 'client') {
          const res = await axios.get('http://127.0.0.1:8000/api/projects/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProjects(res.data);
        }
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
    <div className="dashboard-container fade-in">
      {/* ===== Banner ===== */}
      <div className="dashboard-banner mb-4 d-flex align-items-center justify-content-between flex-wrap">
        <div className="d-flex align-items-center mb-3 mb-md-0">
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
        <div>
          <button className="btn btn-light btn-sm me-2" onClick={() => window.location.reload()}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
          <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/edit-profile')}>
            <i className="bi bi-pencil-square me-1"></i> Edit Profile
          </button>
        </div>
      </div>

      {/* ===== Profile Info ===== */}
      <div className="row g-3">
        <div className="col-md-6 col-lg-4">
          <div className="card dashboard-card hover-lift h-100">
            <h6 className="text-muted mb-2">
              <i className="bi bi-person-workspace me-2"></i>Role
            </h6>
            <h5 className="dashboard-subtitle">{profile.role}</h5>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card dashboard-card hover-lift h-100">
            <h6 className="text-muted mb-2">
              <i className="bi bi-currency-rupee me-2"></i>Hourly Rate
            </h6>
            <h5 className="dashboard-subtitle">₹{profile.hourly_rate}</h5>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card dashboard-card hover-lift h-100">
            <h6 className="text-muted mb-2">
              <i className="bi bi-toggle-on me-2"></i>Availability
            </h6>
            <span
              className={`badge bg-${profile.availability ? 'success' : 'secondary'} dashboard-badge`}
            >
              {profile.availability ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>
        <div className="col-md-12">
          <div className="card dashboard-card hover-lift h-100">
            <h6 className="text-muted mb-2">
              <i className="bi bi-person-lines-fill me-2"></i>Bio
            </h6>
            <p className="mb-0">{profile.bio || 'No bio added yet'}</p>
          </div>
        </div>

        {/* ===== Skills ===== */}
        <div className="col-12">
          <div className="card dashboard-card hover-lift">
            <h6 className="text-muted mb-2">
              <i className="bi bi-stars me-2"></i>Skills
            </h6>
            <div className="d-flex flex-wrap mt-2">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="badge rounded-pill me-2 mb-2 px-3 py-2 fw-normal"
                    style={{
                      background: `linear-gradient(90deg, #${Math.floor(Math.random() * 16777215).toString(16)} 0%, #${Math.floor(Math.random() * 16777215).toString(16)} 100%)`,
                      color: '#fff',
                    }}
                  >
                    {skill.name || 'Skill'}
                  </span>
                ))
              ) : (
                <div className="empty-state">
                  <i className="bi bi-lightbulb empty-icon"></i>
                  <p>No skills added yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Freelancer Section ===== */}
      {profile.role === 'freelancer' && (
        <div className="card dashboard-card hover-lift mt-4">
          <h5 className="dashboard-title mb-3">
            <i className="bi bi-briefcase me-2"></i>Your Proposals
          </h5>
          {proposals.length > 0 ? (
            proposals.map((p) => (
              <div key={p.id} className="card dashboard-card mb-3">
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
            ))
          ) : (
            <div className="empty-state">
              <i className="bi bi-envelope-paper empty-icon"></i>
              <p>You haven’t submitted any proposals yet.</p>
              <button className="btn btn-outline-primary btn-sm">Browse Projects</button>
            </div>
          )}
        </div>
      )}

      {/* ===== Client Section ===== */}
      {profile.role === 'client' && (
        <div className="card dashboard-card hover-lift mt-4">
          <h5 className="dashboard-title mb-3">
            <i className="bi bi-journal-richtext me-2"></i>Your Posted Projects
          </h5>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="card dashboard-card mb-3">
                <h6><strong>Title:</strong> {project.title}</h6>
                <p><strong>Budget:</strong> ₹{project.budget}</p>
                <p><strong>Duration:</strong> {project.duration_weeks} weeks</p>
                <a
                  href={`/projects/${project.id}`}
                  className="btn btn-sm btn-outline-primary mt-2"
                >
                  Manage Proposals
                </a>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="bi bi-folder2-open empty-icon"></i>
              <p>You haven’t posted any projects yet.</p>
              <button className="btn btn-outline-primary btn-sm">Post a Project</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
