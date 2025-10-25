import React, { useEffect, useState } from "react";
import API from "../api.js";
import NavigationBar from "./NavigationBar";
import styles from "../styles/Contracts.module.css";

function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      const res = await API.get("contracts/");
      setContracts(res.data);
    } catch (err) {
      console.error("Failed to fetch contracts:", err);
      setContracts([]);
      alert("❌ Failed to fetch contracts. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  if (loading) return <p className={styles.loading}>Loading contracts...</p>;

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar Nav */}
      <nav>
        <NavigationBar />
      </nav>

      {/* Main Content */}
      <div className={styles.content}>
        <h1>Contracts</h1>

        {contracts.length === 0 ? (
          <p>No contracts found.</p>
        ) : (
          contracts.map((contract) => (
            <div key={contract.id} className={styles.card}>
              <p><strong>Project:</strong> {contract.project_title || "N/A"}</p>
              <p><strong>Freelancer:</strong> {contract.freelancer_name || "N/A"}</p>
              <p><strong>Client:</strong> {contract.client_name || "N/A"}</p>
              <p><strong>Status:</strong> {contract.status || "N/A"}</p>
              <p><strong>Payment:</strong> ${contract.payment_amount || "0"}</p>
              <p>
                <strong>Created At:</strong>{" "}
                {contract.created_at
                  ? new Date(contract.created_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Contracts;
