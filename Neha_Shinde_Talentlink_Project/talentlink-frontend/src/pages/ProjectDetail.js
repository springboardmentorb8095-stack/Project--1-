import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProposalForm from './ProposalForm';
import ReviewForm from './ReviewForm';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('access');
    const isJWT = /^ey[\w-]+\.[\w-]+\.[\w-]+$/.test(storedToken);
    if (storedToken && isJWT) {
      setToken(storedToken);
    } else {
      toast.error("Missing or invalid token. Please log in again.");
    }
  }, []);

  useEffect(() => {
    const fetchProjectAndProposals = async () => {
      try {
        const projectRes = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProject(projectRes.data);

        const proposalRes = await axios.get(`http://127.0.0.1:8000/api/proposals/?project=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProposals(proposalRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load project or proposals");
      }
    };

    if (token) fetchProjectAndProposals();
  }, [id, token]);

  const updateStatus = async (proposalId, accepted) => {
    try {
      const status = accepted ? 'accepted' : 'rejected';

      await axios.patch(`http://127.0.0.1:8000/api/proposals/${proposalId}/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (status === 'accepted') {
        await axios.post(`http://127.0.0.1:8000/api/contracts/`, {
          proposal_id: proposalId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Proposal accepted and contract created!");
      } else {
        toast.success("Proposal rejected");
      }

      const refresh = async () => {
        try {
          const projectRes = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProject(projectRes.data);

          const proposalRes = await axios.get(`http://127.0.0.1:8000/api/proposals/?project=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProposals(proposalRes.data);
        } catch (err) {
          console.error("Error refreshing data:", err);
        }
      };

      refresh();
    } catch (err) {
      console.error("Status update failed:", err.response?.data);
      toast.error("Failed to update proposal status");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#fff'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {project ? (
          <>
            <section style={{
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              marginBottom: '30px',
              color: '#333'
            }}>
              <h2 style={{ marginBottom: '10px', color: '#6a11cb' }}>{project.title}</h2>
              <p>{project.description}</p>
              <p><strong>💰 Budget:</strong> ₹{project.budget}</p>
              <p><strong>⏱️ Duration:</strong> {project.duration_weeks} weeks</p>
            </section>

            <section style={{
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              marginBottom: '30px',
              color: '#333'
            }}>
              <h4 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600', color: '#6a11cb' }}>
                Submit Your Proposal
              </h4>
              <ProposalForm projectId={project.id} />
            </section>

            {proposals.length > 0 ? (
              <section>
                <h3 style={{ marginBottom: '20px', color: '#fff' }}>Proposals Received</h3>
                {proposals.map(p => {
                  console.log('Proposal:', p); // ✅ Log each proposal
                  return (
                    <div key={p.id} style={{
                      backgroundColor: p.status === 'accepted' ? '#e6ffe6' : '#ffffff',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '20px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      color: '#333'
                    }}>
                      <p><strong>Freelancer:</strong> {p.freelancer}</p>
                      <p><strong>Bid:</strong> ₹{p.proposed_rate}</p>
                      <p><strong>Timeline:</strong> {p.timeline_weeks} weeks</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span style={{
                          color: p.status === 'accepted' ? 'green' : 'orange',
                          fontWeight: 'bold'
                        }}>
                          {p.status === 'accepted' ? 'Accepted ✅' : 'Pending ⏳'}
                        </span>
                      </p>
                      <div style={{ marginTop: '10px' }}>
                        <button
                          onClick={() => updateStatus(p.id, true)}
                          disabled={p.status === 'accepted'}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            marginRight: '10px',
                            cursor: p.status === 'accepted' ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(p.id, false)}
                          disabled={p.status === 'accepted'}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: p.status === 'accepted' ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </div>

                      {/* ✅ Review Form for Accepted Proposals */}
                      {p.status === 'accepted' && p.freelancer_profile && (
                        <div style={{ marginTop: '20px' }}>
                          <h5 style={{ color: '#6a11cb', marginBottom: '10px' }}>Leave a Review</h5>
                          <ReviewForm projectId={project.id} reviewedId={p.freelancer_profile} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            ) : (
              <section style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                color: '#666',
                textAlign: 'center'
              }}>
                <i className="bi bi-emoji-frown fs-4 mb-2 d-block"></i>
                No proposals yet.
              </section>
            )}
          </>
        ) : (
          <p>Loading project details...</p>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;




/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProposalForm from './ProposalForm';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('access');
    const isJWT = /^ey[\w-]+\.[\w-]+\.[\w-]+$/.test(storedToken);
    if (storedToken && isJWT) {
      setToken(storedToken);
    } else {
      toast.error("Missing or invalid token. Please log in again.");
    }
  }, []);

  useEffect(() => {
    const fetchProjectAndProposals = async () => {
      try {
        const projectRes = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProject(projectRes.data);

        const proposalRes = await axios.get(`http://127.0.0.1:8000/api/proposals/?project=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProposals(proposalRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load project or proposals");
      }
    };

    if (token) fetchProjectAndProposals();
  }, [id, token]);

  const updateStatus = async (proposalId, accepted) => {
    try {
      const status = accepted ? 'accepted' : 'rejected';

      await axios.patch(`http://127.0.0.1:8000/api/proposals/${proposalId}/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (status === 'accepted') {
        await axios.post(`http://127.0.0.1:8000/api/contracts/`, {
          proposal_id: proposalId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Proposal accepted and contract created!");
      } else {
        toast.success("Proposal rejected");
      }

      const refresh = async () => {
        try {
          const projectRes = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProject(projectRes.data);

          const proposalRes = await axios.get(`http://127.0.0.1:8000/api/proposals/?project=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProposals(proposalRes.data);
        } catch (err) {
          console.error("Error refreshing data:", err);
        }
      };

      refresh();
    } catch (err) {
      console.error("Status update failed:", err.response?.data);
      toast.error("Failed to update proposal status");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#fff'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {project ? (
          <>
            <section style={{
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              marginBottom: '30px',
              color: '#333'
            }}>
              <h2 style={{ marginBottom: '10px', color: '#6a11cb' }}>{project.title}</h2>
              <p>{project.description}</p>
              <p><strong>💰 Budget:</strong> ₹{project.budget}</p>
              <p><strong>⏱️ Duration:</strong> {project.duration_weeks} weeks</p>
            </section>

            <section style={{
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              marginBottom: '30px',
              color: '#333'
            }}>
              <h4 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600', color: '#6a11cb' }}>
                Submit Your Proposal
              </h4>
              <ProposalForm projectId={project.id} />
            </section>

            {proposals.length > 0 ? (
              <section>
                <h3 style={{ marginBottom: '20px', color: '#fff' }}>Proposals Received</h3>
                {proposals.map(p => (
                  <div key={p.id} style={{
                    backgroundColor: p.status === 'accepted' ? '#e6ffe6' : '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    color: '#333'
                  }}>
                    <p><strong>Freelancer:</strong> {p.freelancer}</p>
                    <p><strong>Bid:</strong> ₹{p.proposed_rate}</p>
                    <p><strong>Timeline:</strong> {p.timeline_weeks} weeks</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span style={{
                        color: p.status === 'accepted' ? 'green' : 'orange',
                        fontWeight: 'bold'
                      }}>
                        {p.status === 'accepted' ? 'Accepted ✅' : 'Pending ⏳'}
                      </span>
                    </p>
                    <div style={{ marginTop: '10px' }}>
                      <button
                        onClick={() => updateStatus(p.id, true)}
                        disabled={p.status === 'accepted'}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          marginRight: '10px',
                          cursor: p.status === 'accepted' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(p.id, false)}
                        disabled={p.status === 'accepted'}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: p.status === 'accepted' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            ) : (
              <section style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                color: '#666',
                textAlign: 'center'
              }}>
                <i className="bi bi-emoji-frown fs-4 mb-2 d-block"></i>
                No proposals yet.
              </section>
            )}
          </>
        ) : (
          <p>Loading project details...</p>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;*/




/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProposalForm from './ProposalForm';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const token = localStorage.getItem('access');

  useEffect(() => {
    fetchProjectAndProposals();
  }, [id]);

  const fetchProjectAndProposals = async () => {
    try {
      const projectRes = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(projectRes.data);

      const proposalRes = await axios.get(`http://127.0.0.1:8000/api/proposals/?project=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(proposalRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load project or proposals");
    }
  };

  const updateStatus = async (proposalId, accepted) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/proposals/${proposalId}/`, 
        { accepted }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Proposal ${accepted ? 'accepted' : 'rejected'}`);
      fetchProjectAndProposals();
    } catch (err) {
      console.error("Status update failed:", err.response?.data);
      toast.error("Failed to update proposal status");
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      {project ? (
        <>
          <div style={{
            backgroundColor: '#f0f8ff',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #d0e0f0',
            marginBottom: '30px'
          }}>
            <h2 style={{ marginBottom: '10px' }}>{project.title}</h2>
            <p style={{ marginBottom: '5px' }}>{project.description}</p>
            <p><strong>💰 Budget:</strong> ₹{project.budget}</p>
            <p><strong>⏱️ Duration:</strong> {project.duration_weeks} weeks</p>
          </div>

          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h4 style={{ marginBottom: '15px' }}>Submit Your Proposal</h4>
            <ProposalForm projectId={project.id} />
          </div>

          {proposals.length > 0 ? (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Proposals Received</h3>
              {proposals.map(p => (
                <div key={p.id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px',
                  backgroundColor: p.accepted ? '#e6ffe6' : '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <p><strong>Freelancer:</strong> {p.freelancer}</p>
                  <p><strong>Bid:</strong> ₹{p.proposed_rate}</p>
                  <p><strong>Timeline:</strong> {p.timeline_weeks} weeks</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span style={{
                      color: p.accepted ? 'green' : 'orange',
                      fontWeight: 'bold'
                    }}>
                      {p.accepted ? 'Accepted ✅' : 'Pending ⏳'}
                    </span>
                  </p>
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => updateStatus(p.id, true)}
                      disabled={p.accepted}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        marginRight: '10px',
                        cursor: p.accepted ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={e => e.target.style.backgroundColor = '#218838'}
                      onMouseLeave={e => e.target.style.backgroundColor = '#28a745'}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(p.id, false)}
                      disabled={p.accepted}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: p.accepted ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={e => e.target.style.backgroundColor = '#c82333'}
                      onMouseLeave={e => e.target.style.backgroundColor = '#dc3545'}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No proposals yet.</p>
          )}
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
}

export default ProjectDetail;
*/