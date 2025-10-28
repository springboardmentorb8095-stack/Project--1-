import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaUserCircle } from "react-icons/fa";

import Portfolio from "./ProjectDetails";
import ProjectDetails from "./ProjectDetails";

function Contract() {
  const { id } = useParams(); // contract ID from URL
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false);

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
      await api.patch(`/contracts/${contract.id}/`, {
        status: newStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setContract((prev) => ({ ...prev, status: newStatus }));
      alert("Status updated successfully.");
    } catch (err) {
      console.error("Error updating contract status:", err);
      alert("Failed to update contract status.");
    }
  };

  if (loading) return <p>Loading contract...</p>;
  if (!contract) return <p>Contract not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Back
      </button>

      <h2>Contract Details</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          maxWidth: "600px"
        }}

      >
        <p>
          <strong>Project Title:</strong> {contract.proposal?.project_title || "N/A"}
        </p>

        <p>
          <strong>Status:</strong> {contract.status}
        </p>

        <select
          value={contract.status}
          onChange={(e) => handleStatusUpdate(e.target.value)}
          disabled={["completed", "cancelled"].includes(contract.status)}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(contract.start_date).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(contract.end_date).toLocaleDateString()}
        </p>

        {isClient && (
          <p
            onClick={() =>
              navigate(`/users/${contract.freelancer_id}/profile`)
            }
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <FaUserCircle size={24} style={{ marginRight: "8px" }} />
            {contract.freelancer_name}
          </p>
        )}


        {isFreelancer && (
          <p
            onClick={() => navigate(`/users/${contract.client_id}/profile`)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <FaUserCircle size={24} style={{ marginRight: "8px" }} />
            {contract.client_name}
          </p>
        )}
        
        <ProjectDetails projectId={contract.proposal.project_id}/>
      </div>
    </div>
  );
}

export default Contract;
