import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import "./pages/Auth.css";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h2>🔑 My App</h2>
        <nav>
          <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
          <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
          <Link to="/login">Login</Link>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<h3>🏠 Welcome to Home Page</h3>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
