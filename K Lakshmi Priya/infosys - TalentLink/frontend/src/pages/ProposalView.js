
//ProposalView.js

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function ProposalView() {
  const { id } = useParams(); // proposal ID
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProposal = async () => {
    try {
      const res = await api.get(`/proposals/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProposal(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch proposal");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
        await api.patch(`/proposals/${id}/update-status/`, { status }, {

        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Proposal ${status}`);
      fetchProposal(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to update proposal status");
    }
  };

  useEffect(() => {
    fetchProposal();
  }, [id]);

  if (loading) return <p>Loading proposal...</p>;
  if (error) return <p>{error}</p>;
  if (!proposal) return <p>Proposal not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Proposal by {proposal.freelancer_name || "Freelancer"}</h2>
      <p><strong>Budget:</strong> ${proposal.proposed_rate}</p>
      <p><strong>Cover Letter:</strong></p>
      <p>{proposal.cover_letter}</p>
      <p><strong>Status:</strong> {proposal.status}</p>

      {proposal.status === "pending" && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => updateStatus("accepted")} style={{ marginRight: "1rem" }}>
            Accept
          </button>
          <button onClick={() => updateStatus("rejected")} style={{ color: "red" }}>
            Reject
          </button>
        </div>
      )}

      <button style={{ marginTop: "1rem" }} onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

export default ProposalView;
