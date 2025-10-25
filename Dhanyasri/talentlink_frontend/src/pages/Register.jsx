import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Register.module.css";

const API_URL = "http://127.0.0.1:8000/api/accounts";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "freelancer",
  });
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Keep only password match check
    if (form.password !== form.password2) {
      setError("Passwords do not match!");
      return;
    }

    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      password2: form.password2,
      is_client: form.role === "client",
      is_freelancer: form.role === "freelancer",
    };

    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registration successful! Please login.");
        navigate("/login");
      } else {
        console.error("Backend error:", data);
        if (data.username) setError(`Username: ${data.username}`);
        else if (data.email) setError(`Email: ${data.email}`);
        else setError(data.detail || JSON.stringify(data));
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>Create an Account</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles["form-group"]}>
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={form.password2}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn}>
            REGISTER
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
