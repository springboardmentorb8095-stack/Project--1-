import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function ProjectProposals() {
  const { projectId } = useParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    try {
      const res = await api.get(`proposals/?project=${projectId}`);
      setProposals(res.data);
    } catch (err) {
      console.error("Error loading proposals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`proposals/${id}/update-status/`, { status: newStatus });
      alert(`Proposal ${newStatus}!`);
      fetchProposals();
    } catch (err) {
      console.error("Error updating proposal:", err);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [projectId]);

  if (loading) return <p>Loading proposals...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Proposals for Project #{projectId}</h2>
      {proposals.length === 0 ? (
        <p>No proposals yet.</p>
      ) : (
        proposals.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3>{p.freelancer_name}</h3>
            <p><strong>Rate:</strong> ${p.proposed_rate}</p>
            <p><strong>Cover Letter:</strong> {p.cover_letter}</p>
            <p><strong>Status:</strong> {p.status}</p>
            <div>
              {p.status === "pending" && (
                <>
                  <button onClick={() => handleStatusChange(p.id, "accepted")}>
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(p.id, "rejected")}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectProposals;
