import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      // ✅ Store tokens
      localStorage.setItem('access', accessToken);
      localStorage.setItem('refresh', refreshToken);
      console.log("Access token stored:", accessToken);
      toast.success('Login successful!');

      // ✅ Check if profile exists
      try {
        const profileRes = await axios.get('http://127.0.0.1:8000/api/profiles/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (Array.isArray(profileRes.data) && profileRes.data.length > 0) {
          toast.info('Welcome back!');
          navigate('/dashboard');
        } else {
          toast.info('No profile found. Redirecting to setup...');
          navigate('/profile-setup');
        }
      } catch (profileError) {
        console.error("Error checking profile:", profileError);
        toast.error("Could not verify profile. Redirecting to setup...");
        navigate('/profile-setup');
      }

    } catch (error) {
      console.error("Login error:", error.response?.data);
      toast.error('Login failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center" style={{
      background: 'linear-gradient(to right,  #6a11cb, #2575fc)',
    }}>
      <div className="card p-4 shadow animate__animated animate__fadeIn" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4 text-danger">Login</h3>

        <div className="mb-3">
          <label className="form-label"><FaUser /> Username</label>
          <input
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            aria-label="Username"
          />
          {errors.username && <small className="text-danger">{errors.username}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label"><FaLock /> Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            aria-label="Password"
          />
          {errors.password && <small className="text-danger">{errors.password}</small>}
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center mt-3 text-muted">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
