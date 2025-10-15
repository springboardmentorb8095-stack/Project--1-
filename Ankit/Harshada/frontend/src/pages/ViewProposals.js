import React from "react";
import "./Dashboard.css";

function ViewProposals() {
  const proposals = [
    {
      id: 1,
      title: "E-commerce Website Development",
      client: "Badri",
      budget: "$1200",
      status: "Pending",
    },
    {
      id: 2,
      title: "Mobile App UI Design",
      client: "Swapna",
      budget: "$800",
      status: "Accepted",
    },
    {
      id: 3,
      title: "Data Visualization Dashboard",
      client: "Archana.",
      budget: "$1500",
      status: "Rejected",
    },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📄 My Proposals</h2>
      <p className="dashboard-subtitle">
        Here you can see all your submitted proposals.
      </p>

      <div className="dashboard-cards">
        {proposals.map((proposal) => (
          <div className="dashboard-card" key={proposal.id}>
            <h3>{proposal.title}</h3>
            <p>
              <strong>Client:</strong> {proposal.client}
            </p>
            <p>
              <strong>Budget:</strong> {proposal.budget}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    proposal.status === "Accepted"
                      ? "green"
                      : proposal.status === "Rejected"
                      ? "red"
                      : "#555",
                }}
              >
                {proposal.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewProposals;
