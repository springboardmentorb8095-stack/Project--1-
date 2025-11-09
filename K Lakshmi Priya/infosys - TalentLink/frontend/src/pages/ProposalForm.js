import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ProposalForm() {
  const { id, proposalId } = useParams();
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
    let res; // declare here so it's available after the if/else

    if (isEdit) {
      res = await api.patch(
        `/proposals/${proposalId}/`,
        { cover_letter: coverLetter, proposed_rate: rate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Proposal updated successfully!");
    } else {
      res = await api.post(
        "/proposals/",
        { project: id, cover_letter: coverLetter, proposed_rate: rate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Proposal submitted successfully!");
    }

    // ✅ Now you can safely access res.data
    const projectId = res?.data?.project_id || id;
    navigate(`/projects/${projectId}`);
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

  if (loading)
    return <p className="text-gray-500 text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? "Update Proposal" : "Submit Proposal"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Cover Letter</label>
          <textarea
            rows={10}
            placeholder="Cover Letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Proposed Rate ($)</label>
          <input
            type="number"
            placeholder="Proposed Rate ($)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            required
            min={0}
            step={0.01}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {isEdit && (
          <p className="text-gray-700">
            <strong>Status:</strong> {status || "N/A"}
          </p>
        )}

        {status === "accepted" || status === "rejected" ? (
          <p className="text-gray-700 font-medium">
            Your proposal is <span className="capitalize">{status}</span>.
          </p>
        ) : (
          <div className="flex items-center space-x-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-medium transition ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isEdit ? "Update Proposal" : "Submit Proposal"}
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete Proposal
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default ProposalForm;
