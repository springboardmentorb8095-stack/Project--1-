import React, { useEffect, useState } from "react";

function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const savedContracts = JSON.parse(localStorage.getItem("contracts")) || [];
    setContracts(savedContracts);
  }, []);

  const filteredContracts =
    filter === "All" ? contracts : contracts.filter(c => c.status === filter);

  const updateStatus = (id, status) => {
    const updated = contracts.map(c => c.id === id ? {...c, status } : c);
    setContracts(updated);
    localStorage.setItem("contracts", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📜 Contracts</h2>

      {/* Filter */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
        {["All", "Pending", "Active", "Completed"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: filter === f ? "2px solid #007bff" : "1px solid #ccc",
              background: filter === f ? "#007bff" : "#f1f5f9",
              color: filter === f ? "white" : "black",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Contract List */}
      {filteredContracts.length === 0 ? (
        <p>No contracts found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredContracts.map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", borderRadius: "8px", background: "#f8f9fa", border: "1px solid #dee2e6" }}>
              <div>
                <h4>{c.projectTitle}</h4>
                <p>👤 Client: {c.client}</p>
                <p>🧑‍💻 Freelancer: {c.freelancer}</p>
                <p>📌 Status: <b>{c.status}</b></p>
                <p>🕒 Created At: {c.createdAt}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {c.status === "Pending" && (
                  <button onClick={() => updateStatus(c.id, "Active")} style={{ padding: "6px 12px", background: "#16a34a", color: "white", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
                    ✅ Mark Active
                  </button>
                )}
                {c.status === "Active" && (
                  <button onClick={() => updateStatus(c.id, "Completed")} style={{ padding: "6px 12px", background: "#f97316", color: "white", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
                    🏁 Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContractsPage;
