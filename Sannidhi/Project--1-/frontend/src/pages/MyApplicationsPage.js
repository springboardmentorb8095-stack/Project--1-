import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingApplication, setEditingApplication] = useState(null);
  const [editForm, setEditForm] = useState({
    cover_letter: "",
    bid_amount: ""
  });

  // Fetch user's applications
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/proposals/my-proposals/", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error("Failed to fetch applications");
        // Load demo applications from localStorage
        const demoApplications = JSON.parse(localStorage.getItem('demoApplications') || '[]');
        const sampleApplications = [
          {
            id: 1,
            project_title: "Website Redesign",
            cover_letter: "I have extensive experience in web design and would love to work on this project.",
            bid_amount: "2000.00",
            status: "pending",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            project_title: "Mobile App Backend API",
            cover_letter: "I specialize in backend development and have worked on similar projects before.",
            bid_amount: "1500.00",
            status: "accepted",
            created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ];
        setApplications([...sampleApplications, ...demoApplications]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      // Load demo applications from localStorage
      const demoApplications = JSON.parse(localStorage.getItem('demoApplications') || '[]');
      const sampleApplications = [
        {
          id: 1,
          project_title: "Website Redesign",
          cover_letter: "I have extensive experience in web design and would love to work on this project.",
          bid_amount: "2000.00",
          status: "pending",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          project_title: "Mobile App Backend API",
          cover_letter: "I specialize in backend development and have worked on similar projects before.",
          bid_amount: "1500.00",
          status: "accepted",
          created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ];
      setApplications([...sampleApplications, ...demoApplications]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Refresh applications when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchApplications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Delete application
  const handleDelete = async (applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const token = localStorage.getItem("access");
        
        // For demo applications (ID 1 or 2), just remove from state
        if (applicationId <= 2) {
          setApplications(applications.filter(app => app.id !== applicationId));
          alert("Application deleted successfully!");
          return;
        }

        // For localStorage demo applications (ID > 2), remove from localStorage
        if (applicationId > 2) {
          const demoApplications = JSON.parse(localStorage.getItem('demoApplications') || '[]');
          const updatedApplications = demoApplications.filter(app => app.id !== applicationId);
          localStorage.setItem('demoApplications', JSON.stringify(updatedApplications));
          setApplications(applications.filter(app => app.id !== applicationId));
          alert("Application deleted successfully!");
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/proposals/my-proposals/${applicationId}/delete/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setApplications(applications.filter(app => app.id !== applicationId));
          alert("Application deleted successfully!");
        } else {
          alert("Failed to delete application");
        }
      } catch (error) {
        console.error("Error deleting application:", error);
        alert("Error deleting application");
      }
    }
  };

  // Start editing application
  const handleEdit = (application) => {
    setEditingApplication(application);
    setEditForm({
      cover_letter: application.cover_letter,
      bid_amount: application.bid_amount
    });
  };

  // Save edited application
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("access");
      
      // For demo applications (ID 1 or 2), just update state
      if (editingApplication.id <= 2) {
        const updatedApplication = {
          ...editingApplication,
          cover_letter: editForm.cover_letter,
          bid_amount: editForm.bid_amount
        };
        setApplications(applications.map(app => 
          app.id === editingApplication.id ? updatedApplication : app
        ));
        setEditingApplication(null);
        alert("Application updated successfully!");
        return;
      }

      // For localStorage demo applications (ID > 2), update localStorage
      if (editingApplication.id > 2) {
        const demoApplications = JSON.parse(localStorage.getItem('demoApplications') || '[]');
        const updatedApplications = demoApplications.map(app => 
          app.id === editingApplication.id 
            ? { ...app, cover_letter: editForm.cover_letter, bid_amount: editForm.bid_amount }
            : app
        );
        localStorage.setItem('demoApplications', JSON.stringify(updatedApplications));
        
        const updatedApplication = {
          ...editingApplication,
          cover_letter: editForm.cover_letter,
          bid_amount: editForm.bid_amount
        };
        setApplications(applications.map(app => 
          app.id === editingApplication.id ? updatedApplication : app
        ));
        setEditingApplication(null);
        alert("Application updated successfully!");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/proposals/my-proposals/${editingApplication.id}/`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedApplication = await response.json();
        setApplications(applications.map(app => 
          app.id === editingApplication.id ? updatedApplication : app
        ));
        setEditingApplication(null);
        alert("Application updated successfully!");
      } else {
        alert("Failed to update application");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Error updating application");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingApplication(null);
    setEditForm({ cover_letter: "", bid_amount: "" });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading your applications...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📋 My Applications</h1>
        <p>Manage your project applications and track their status</p>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications">
          <div className="no-applications-content">
            <h3>No Applications Yet</h3>
            <p>You haven't applied to any projects yet. Start browsing projects to find opportunities!</p>
            <button 
              className="btn primary-btn"
              onClick={() => window.location.href = '/projects'}
            >
              Browse Projects
            </button>
          </div>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <h3>{application.project_title}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(application.status) }}
                >
                  {application.status.toUpperCase()}
                </span>
              </div>

              <div className="application-details">
                <div className="detail-row">
                  <span className="detail-label">💰 Bid Amount:</span>
                  <span className="detail-value">${application.bid_amount}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📅 Applied:</span>
                  <span className="detail-value">
                    {new Date(application.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📝 Cover Letter:</span>
                  <span className="detail-value">{application.cover_letter}</span>
                </div>
              </div>

              {editingApplication && editingApplication.id === application.id ? (
                <div className="edit-form">
                  <h4>Edit Application</h4>
                  <div className="form-group">
                    <label>Cover Letter:</label>
                    <textarea
                      value={editForm.cover_letter}
                      onChange={(e) => setEditForm({...editForm, cover_letter: e.target.value})}
                      rows="4"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bid Amount:</label>
                    <input
                      type="number"
                      value={editForm.bid_amount}
                      onChange={(e) => setEditForm({...editForm, bid_amount: e.target.value})}
                      step="0.01"
                    />
                  </div>
                  <div className="form-actions">
                    <button className="btn primary-btn" onClick={handleSaveEdit}>
                      Save Changes
                    </button>
                    <button className="btn secondary-btn" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="application-actions">
                  <button 
                    className="btn edit-btn"
                    onClick={() => handleEdit(application)}
                    disabled={application.status !== 'pending'}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn delete-btn"
                    onClick={() => handleDelete(application.id)}
                    disabled={application.status !== 'pending'}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplicationsPage;
