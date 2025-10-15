import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function ApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState("");
  const [bid, setBid] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Proposal submitted for project:", id, {
      coverLetter,
      bid,
    });
    alert("✅ Proposal submitted successfully (demo)");
    navigate("/freelancer-dashboard");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">✍️ Apply to Project #{id}</h2>
      <p className="dashboard-subtitle">
        Write a short proposal and your bid amount.
      </p>

      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "left" }}>
        <form onSubmit={handleSubmit}>
          <label>Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows="6"
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
            required
          />

          <label>Your Bid (USD)</label>
          <input
            type="text"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            placeholder="e.g. 1200"
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
            required
          />

          <div style={{ display: "flex", gap: 12 }}>
            <button className="dashboard-btn" type="submit">
              Submit Proposal
            </button>
            <button
              type="button"
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyPage;
