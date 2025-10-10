import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
  if (!validateForm()) return;

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/register/', {
      username,
      email,
      password,
    });
    toast.success(response.data.message || 'Registration successful!');
  } catch (error) {
    toast.error('Registration failed: ' + (error.response?.data?.error || error.message));
  }
};


  return (
    <div className="vh-100 d-flex justify-content-center align-items-center" style={{
      background: 'linear-gradient(to right, #6a11cb, #2575fc)',
    }}>
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4 text-primary">Create Account</h3>

        <div className="mb-3">
          <label className="form-label"><FaUser /> Username</label>
          <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
          {errors.username && <small className="text-danger">{errors.username}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label"><FaEnvelope /> Email</label>
          <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label"><FaLock /> Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
          {errors.password && <small className="text-danger">{errors.password}</small>}
        </div>

        <button className="btn btn-primary w-100" onClick={handleRegister}>Register</button>
        <p className="text-center mt-3 text-muted">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;