import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";  // 👈 correct path
import LoginPage from "./pages/LoginPage";        // 👈 correct path

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h2>🔑 Auth Demo</h2>

        {/* Navigation Links */}
        <nav>
          <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
          <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
          <Link to="/login">Login</Link>
        </nav>

        <hr />

        <Routes>
          {/* Home page */}
          <Route path="/" element={<h3>Welcome! Please choose Register or Login.</h3>} />

          {/* Register page */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Login page */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
