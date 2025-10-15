import React from "react";
import "./Dashboard.css";

function EarningsPage() {
  const earnings = [
    {
      id: 1,
      project: "E-commerce Website",
      amount: "$1200",
      date: "2025-09-20",
    },
    {
      id: 2,
      project: "UI Design for App",
      amount: "$800",
      date: "2025-09-25",
    },
    {
      id: 3,
      project: "Data Dashboard",
      amount: "$1500",
      date: "2025-10-02",
    },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">💰 Earnings</h2>
      <p className="dashboard-subtitle">
        Track your income and completed project payments.
      </p>

      <div className="dashboard-cards">
        {earnings.map((earning) => (
          <div className="dashboard-card" key={earning.id}>
            <h3>{earning.project}</h3>
            <p>
              <strong>Amount:</strong> {earning.amount}
            </p>
            <p>
              <strong>Date:</strong> {earning.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EarningsPage;
