import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function RoleSelection() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("loggedUser");

  const handleSaveRole = async () => {
    if (!role) {
      alert("Please select a role!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/set-role/", {
        username,
        role,
      });

      alert(`✅ Role "${role}" saved successfully!`);

      // Redirect to correct dashboard
      if (role === "freelancer") {
        navigate("/freelancer-dashboard");
      } else if (role === "client") {
        navigate("/client-dashboard");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      if (error.response?.status === 403) {
        alert("⚠️ Role already assigned! You cannot change it once selected.");
        navigate("/login");
      } else {
        alert("Error saving role!");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Select Your Role</h2>
      <p>Choose whether you are a Freelancer or a Client.</p>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
        <button
          style={{
            padding: "15px 25px",
            background: role === "freelancer" ? "#007bff" : "#f0f0f0",
            color: role === "freelancer" ? "white" : "black",
            borderRadius: "10px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
          onClick={() => setRole("freelancer")}
        >
          Freelancer 🧑‍💻
        </button>

        <button
          style={{
            padding: "15px 25px",
            background: role === "client" ? "#007bff" : "#f0f0f0",
            color: role === "client" ? "white" : "black",
            borderRadius: "10px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
          onClick={() => setRole("client")}
        >
          Client 💼
        </button>
      </div>

      <button
        onClick={handleSaveRole}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "12px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Save Role
      </button>
    </div>
  );
}
