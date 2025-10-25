import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ProposalForm() {
  const { id, proposalId } = useParams(); // projectId and proposalId
  const isEdit = Boolean(proposalId);

  const [coverLetter, setCoverLetter] = useState("");
  const [rate, setRate] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (isEdit) {
      const fetchProposal = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/proposals/${proposalId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setCoverLetter(res.data.cover_letter || "");
          setRate(res.data.proposed_rate || "");
          setStatus(res.data.status || "");
        } catch (err) {
          console.error("Failed to fetch proposal:", err);
          alert("Failed to load proposal.");
        } finally {
          setLoading(false);
        }
      };

      fetchProposal();
    }
  }, [isEdit, proposalId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.patch(
          `/proposals/${proposalId}/`,
          { cover_letter: coverLetter, proposed_rate: rate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Proposal updated successfully!");
      } else {
        await api.post(
          "/proposals/",
          { project: id, cover_letter: coverLetter, proposed_rate: rate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Proposal submitted successfully!");
      }

      navigate("/projects");
    } catch (err) {
      console.error("Error submitting proposal", err);
      alert("Failed to submit proposal");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;

    setLoading(true);
    try {
      await api.delete(`/proposals/${proposalId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Proposal deleted successfully!");
      navigate("/projects");
    } catch (err) {
      console.error("Failed to delete proposal", err);
      alert("Failed to delete proposal.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "7rem" }}>
      <h2>{isEdit ? "Update Proposal" : "Submit Proposal"}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={10}
          placeholder="Cover Letter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
          required
        />
        <input
          type="number"
          placeholder="Proposed Rate ($)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
          required
          min={0}
          step={0.01}
        />
        {isEdit && (
          <p>
            <strong>Status:</strong> {status || "N/A"}
          </p>
        )}
        {status === "accepted" || status === "rejected" ? (
          <p>Your proposal is {status}.</p>
        ) : (
          <>
            <button type="submit" disabled={loading}>
              {isEdit ? "Update Proposal" : "Submit Proposal"}
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                style={{ marginLeft: "1rem", backgroundColor: "red", color: "white" }}
              >
                Delete Proposal
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
}

export default ProposalForm;
