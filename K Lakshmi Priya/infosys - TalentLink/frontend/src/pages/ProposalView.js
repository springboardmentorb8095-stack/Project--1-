import { useEffect, useState, useCallback} from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { FaUserCircle, FaProjectDiagram } from "react-icons/fa";

export default function ProposalView() {
  const { id } = useParams(); // proposal ID
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const fetchProposal = useCallback(async () => {
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
}, [id, token]);  // Memoize the function to avoid unnecessary re-creation

useEffect(() => {
  fetchProposal();
}, [id, fetchProposal]);  // Now fetchProposal is stable, so no warning


  const updateStatus = async (status) => {
    try {
      await api.patch(
        `/proposals/${id}/update-status/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Proposal ${status}`);
      fetchProposal(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to update proposal status");
    }
  };


  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading proposal...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  if (!proposal)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Proposal not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">


      {/* Freelancer Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
        <FaUserCircle size={48} className="text-blue-500" />
        <div>
          <h2
            className="text-xl font-bold cursor-pointer hover:text-blue-600"
            onClick={() =>
              navigate(`/users/${proposal.freelancer}/profile`)
            }
          >
            {proposal.freelancer_name}
          </h2>
          <p className="text-gray-500">Freelancer</p>
        </div>
      </div>

      {/* Proposal Details Card */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h3
          onClick={() => navigate(`/projects/${proposal.project_id}`)}
          className="text-2xl font-semibold text-blue-700 cursor-pointer hover:underline flex items-center gap-2"
        >
          <FaProjectDiagram /> {proposal.project_title}
        </h3>
        <hr/>

        <div className="flex flex-wrap gap-6 text-gray-700">
          <p>
            <strong>Budget:</strong> ${proposal.proposed_rate}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                proposal.status === "accepted"
                  ? "text-green-600"
                  : proposal.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {proposal.status === "rejected"
                ? "Not Selected"
                : proposal.status.charAt(0).toUpperCase() +
                  proposal.status.slice(1)}
            </span>
          </p>
        </div>

        <div>
          <p className="font-semibold mb-1">Cover Letter:</p>
          <p className="text-gray-600 whitespace-pre-line">
            {proposal.cover_letter}
          </p>
        </div>

        {/* Action Buttons */}
        {proposal.status === "pending" && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => updateStatus("accepted")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Accept
            </button>
            <button
              onClick={() => updateStatus("rejected")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
