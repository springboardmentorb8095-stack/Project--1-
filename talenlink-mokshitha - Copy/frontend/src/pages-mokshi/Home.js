import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🌟 Welcome to TalentLink</h1>
        <p>Your bridge between Freelancers and Clients 🚀</p>
      </header>

      <div className="home-content">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1162/1162499.png"
          alt="TalentLink illustration"
          className="home-illustration"
        />

        <div className="home-buttons">
          <button onClick={() => navigate("/register")} className="home-btn register">
            📝 Register
          </button>
          <button onClick={() => navigate("/login")} className="home-btn login">
            🔐 Login
          </button>
        </div>
      </div>

      <footer className="home-footer">
        <p>Made with ❤️ by Subbu & Mokshitha | TalentLink © 2025</p>
      </footer>
    </div>
  );
}
