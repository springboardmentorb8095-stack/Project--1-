import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Feed.css";

export default function ProposalForm() {
  const { id } = useParams();
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();
  const freelancerId = localStorage.getItem("profileId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/proposals/", {
        project: id,
        freelancer: freelancerId,
        description,
        price,
      });
      alert("✅ Proposal submitted successfully!");
      navigate(`/project/${id}`);
    } catch (err) {
      console.error("Error submitting proposal:", err);
      alert("❌ Failed to submit proposal!");
    }
  };

  return (
    <div className="proposal-page">
      <h2>💬 Submit Proposal</h2>
      <form onSubmit={handleSubmit} className="proposal-form">
        <textarea
          placeholder="Describe your proposal..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Your Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Send Proposal</button>
      </form>
    </div>
  );
}
