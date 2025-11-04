import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";

function ContractDashboard() {
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        setUserId(parsedUser?.id);
        setIsClient(parsedUser?.role === "client");
        setIsFreelancer(parsedUser?.role === "freelancer");
      }
    } catch (e) {
      console.error("Error parsing user:", e);
    }
  }, []);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!token) return;

      try {
        const res = await api.get("/contracts/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContracts(res.data);
      } catch (err) {
        console.error("Failed to fetch contracts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [token]);

  if (loading) return <p>Loading contracts...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Contracts</h2>

      {contracts.length === 0 ? (
        <p>No contracts found.</p>
      ) : (
        contracts.map((contract) => (
          <div
            key={contract.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            <div style={{
              display : "grid",
              gridTemplateColumns : "3fr 1fr",
              gap : "8px"
              }
            }>
              <div>
              <p>
                <strong>Project Title:</strong> {contract.proposal?.project_title || "N/A"}
              </p>
              </div>
              <div>                
                {isClient && (

                    <p
                          onClick={() => navigate(`/users/${contract.freelancer_id}/profile`)}
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
              </div>
            </div>
            <p>
              <strong>Status:</strong> {contract.status}
            </p>
            <p>
              <strong>Start:</strong>{" "}
              {new Date(contract.start_date).toLocaleDateString()}
              <strong> - End:</strong>{" "}
              {new Date(contract.end_date).toLocaleDateString()}
            </p>



            <p onClick={() => navigate(`/contracts/${contract.id}`)} style={{ cursor: "pointer", textDecoration: "underline" }}>
                View
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default ContractDashboard;
