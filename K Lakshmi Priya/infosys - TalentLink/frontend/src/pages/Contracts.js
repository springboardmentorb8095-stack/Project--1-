// src/pages/ContractDashboard.js
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaFolderOpen, FaCalendarAlt } from "react-icons/fa";

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-indigo-600 text-lg font-medium">
        Loading contracts...
      </div>
    );

  return (
    <div
      className="max-w-6xl mx-auto p-16"
      style={{
        background:
          "linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)",
        minHeight: "100vh",
      }}
    >
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Your Contracts
      </h2>

      {contracts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No contracts found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition transform hover:-translate-y-1 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2 text-indigo-700 font-semibold">
                  <FaFolderOpen />
                  <p>{contract.proposal?.project_title || "N/A"}</p>
                </div>

                <div className="flex items-center space-x-2 cursor-pointer">
                  <FaUserCircle
                    size={24}
                    className="text-gray-600 hover:text-indigo-500"
                  />
                  {isClient && (
                    <span
                      onClick={() =>
                        navigate(`/users/${contract.freelancer_id}/profile`)
                      }
                      className="text-indigo-600 font-medium hover:underline"
                    >
                      {contract.freelancer_name}
                    </span>
                  )}
                  {isFreelancer && (
                    <span
                      onClick={() =>
                        navigate(`/users/${contract.client_id}/profile`)
                      }
                      className="text-indigo-600 font-medium hover:underline"
                    >
                      {contract.client_name}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-1">
                <strong className="text-gray-900">Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    contract.status === "completed"
                      ? "text-green-600"
                      : contract.status === "in_progress"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {contract.status}
                </span>
              </p>

              <p className="flex items-center text-gray-700">
                <FaCalendarAlt className="text-indigo-500 mr-2" />
                <span>
                  <strong>Start:</strong>{" "}
                  {new Date(contract.start_date).toLocaleDateString()}{" "}
                  <strong>– End:</strong>{" "}
                  {new Date(contract.end_date).toLocaleDateString()}
                </span>
              </p>

              <button
                onClick={() => navigate(`/contracts/${contract.id}`)}
                className="mt-4 w-full py-2 text-white font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 transition"
              >
                View Contract
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContractDashboard;
