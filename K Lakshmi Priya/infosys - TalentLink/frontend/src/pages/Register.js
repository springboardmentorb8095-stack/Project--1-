import { useState } from "react";
import api from "../api/axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("register/", formData);
      alert("Registered successfully! Please login.");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Register</h2>

      <label htmlFor="username">Username</label>
      <input
        id="username"
        name="username"
        placeholder="Enter your username"
        value={formData.username}
        onChange={handleChange}
        required
        autoComplete="username"
      />
      <br/>
      <br/>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
      />
      <br/>
      <br/>

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        required
        autoComplete="new-password"
        minLength={6}
      />
      <br/>
      <br/>

      <label htmlFor="role">Register as</label>
      <select
        id="role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
      </select>
<br/>
      <br/>
      <button type="submit" style={{ marginTop: "1rem" }}>
        Register
      </button>
    </form>
  );
}

export default Register;
