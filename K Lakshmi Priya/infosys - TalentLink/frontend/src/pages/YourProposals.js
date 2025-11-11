import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaUserCircle, FaProjectDiagram, FaEdit, FaEye } from "react-icons/fa";

export default function YourProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("access");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));


const fetchProposals = useCallback(async () => {
  setLoading(true);
  try {
    const res = await api.get("/proposals/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProposals(res.data); // <-- Set proposals here
  } catch (err) {
    console.error(err);
    setError("Failed to fetch proposals.");
  } finally {
    setLoading(false);
  }
}, [token]); // Add any dependencies (like token) here

useEffect(() => {
  fetchProposals();
}, [fetchProposals]);


  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading proposals...</p>;
  if (error)
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (proposals.length === 0)
    return <p className="text-center mt-20 text-gray-500">No proposals found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Your Proposals
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {proposals.map((proposal) => {
          const isOwner = proposal.freelancer_name === user?.name; // frontend owner check

          return (
            <div
              key={proposal.id}
              className="bg-white shadow-md hover:shadow-xl rounded-xl p-5 transition duration-300 flex flex-col justify-between"
            >
              {/* Freelancer Info */}
              <div className="flex items-center gap-3 mb-4">
                <FaUserCircle className="text-blue-500" size={28} />
                <span
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={() => navigate(`/users/${proposal.freelancer}/profile`)}
                >
                  {proposal.freelancer_name}
                </span>
              </div>

              {/* Project Info */}
              <h2
                className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 flex items-center gap-2"
                onClick={() => navigate(`/projects/${proposal.project_id}`)}
              >
                <FaProjectDiagram /> {proposal.project_title}
              </h2>

              {/* Cover Letter */}
              <p className="text-gray-600 mb-2 text-sm line-clamp-3">
                {proposal.cover_letter || "No cover letter provided."}
              </p>

              {/* Budget & Status */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="text-gray-700">
                  <strong>Budget:</strong> ${proposal.proposed_rate}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold ${
                    proposal.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : proposal.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                {/* View button for non-owners */}
                {!isOwner && (
                  <button
                    onClick={() => navigate(`/proposals/view/${proposal.id}`)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  >
                    <FaEye /> View
                  </button>
                )}

                {/* Edit button for owner if pending */}
                {isOwner && (
                  <button
                    onClick={() =>
                      navigate(
                         `/proposals/edit/${proposal.id}`
                      )
                    }
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    <FaEdit /> View
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
