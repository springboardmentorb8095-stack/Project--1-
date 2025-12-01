// src/pages/ContractDetail.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaUserCircle, FaCalendarAlt, FaClipboardList } from "react-icons/fa";

import ProjectDetails from "./ProjectDetails";
import ReviewModal from "./ReviewModal";
import ReviewList from "./ReviewList";

function Contract() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        setIsClient(parsedUser?.role === "client");
        setIsFreelancer(parsedUser?.role === "freelancer");
      }
    } catch (e) {
      console.error("Error parsing user:", e);
    }
  }, []);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await api.get(`/contracts/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContract(res.data);
        setHasReviewed(res.data.reviewed || false);
      } catch (err) {
        console.error("Failed to fetch contract:", err);
        alert("Unable to load contract.");
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id, token]);

  const handleStatusUpdate = async (newStatus) => {
    if (!contract || contract.status === newStatus) return;

    const confirmed = window.confirm(
      `Change status from "${contract.status}" to "${newStatus}"?\n\nNote: This action may be irreversible.`
    );
    if (!confirmed) return;

    try {
      await api.patch(
        `/contracts/${contract.id}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContract((prev) => ({ ...prev, status: newStatus }));
      alert("Status updated successfully.");
    } catch (err) {
      console.error("Error updating contract status:", err);
      alert("Failed to update contract status.");
    }
  };

  const handleReviewSuccess = () => {
    alert("Review submitted successfully!");
    setHasReviewed(true);
    setShowReviewModal(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-indigo-600 text-lg font-medium">
        Loading contract...
      </div>
    );

  if (!contract)
    return (
      <p className="text-center text-gray-700 mt-10">Contract not found.</p>
    );

  return (
    <div
      className="w-full p-10"
      style={{
        background: "linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)",
        minHeight: "100vh",
      }}
    >
      

      <div className="bg-white shadow-md rounded-lg border border-gray-200 p-8 w-full">
        <div className="flex items-center space-x-3 mb-6 text-indigo-700 font-bold text-2xl">
          <FaClipboardList />
          <h2>Contract Details</h2>
        </div>

        {/* Grid layout for clean full-width display */}
        <div className="grid md:grid-cols-2 gap-8 text-gray-700">
          <div className="space-y-3">
            <p>
              <strong>Project Title:</strong>{" "}
              {contract.proposal?.project_title || "N/A"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  contract.status === "completed"
                    ? "text-green-600"
                    : contract.status === "active"
                    ? "text-yellow-600"
                    : "text-gray-600"
                }`}
              >
                {contract.status}
              </span>
            </p>

            <div className="flex items-center space-x-2">
              <label className="font-medium">Change Status:</label>
              <select
                value={contract.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={["completed", "cancelled"].includes(contract.status)}
                className="border border-gray-300 rounded-md px-3 py-1 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <p className="flex items-center">
              <FaCalendarAlt className="text-indigo-500 mr-2" />
              <span>
                <strong>Start Date:</strong>{" "}
                {new Date(contract.start_date).toLocaleDateString()}{" "}
                <strong>– End Date:</strong>{" "}
                {new Date(contract.end_date).toLocaleDateString()}
              </span>
            </p>
          </div>

          <div>
            {isClient && (
              <p
                onClick={() =>
                  navigate(`/users/${contract.freelancer_id}/profile`)
                }
                className="flex items-center text-indigo-600 font-medium hover:underline cursor-pointer"
              >
                <FaUserCircle size={22} className="mr-2" />
                {contract.freelancer_name}
              </p>
            )}

            {isFreelancer && (
              <p
                onClick={() => navigate(`/users/${contract.client_id}/profile`)}
                className="flex items-center text-indigo-600 font-medium hover:underline cursor-pointer"
              >
                <FaUserCircle size={22} className="mr-2" />
                {contract.client_name}
              </p>
            )}
          </div>
        </div>

        {/* Full-width Project details */}
        <div className="mt-8">
          <ProjectDetails projectId={contract.proposal.project_id} />
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-3">
            Reviews
          </h3>
          <ReviewList contractId={contract.id} />

          {contract.status === "completed" && !hasReviewed && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
            >
              Leave a Review
            </button>
          )}

          {contract.status === "completed" && hasReviewed && (
            <button
              disabled
              className="mt-4 px-6 py-2 bg-gray-400 text-white font-medium rounded-md cursor-not-allowed"
            >
              Review Submitted ✓
            </button>
          )}

          {showReviewModal && (
            <ReviewModal
              contractId={contract.id}
              onClose={() => setShowReviewModal(false)}
              onSuccess={handleReviewSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Contract;
