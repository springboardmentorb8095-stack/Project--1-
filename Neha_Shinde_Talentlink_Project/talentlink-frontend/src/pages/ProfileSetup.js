import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  FaUserTie, FaInfoCircle, FaMoneyBillWave,
  FaCheckCircle, FaTools
} from 'react-icons/fa';

function ProfileSetup() {
  const [role, setRole] = useState('freelancer');
  const [bio, setBio] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [availability, setAvailability] = useState(true);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [token, setToken] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('access');
    const isJWT = /^ey[\w-]+\.[\w-]+\.[\w-]+$/.test(storedToken);
    if (storedToken && isJWT) {
      setToken(storedToken);
    } else {
      console.warn("Invalid or missing token");
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const checkExistingProfile = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/profiles/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(res.data) && res.data.length > 0) {
          localStorage.setItem('role', res.data[0].role);
          toast.info("Profile already exists. Redirecting to dashboard...");
          setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
        }
      } catch (err) {
        console.error("Error checking profile:", err);
        toast.error("Failed to load profile.");
      }
    };

    checkExistingProfile();
  }, [token, navigate]);

  const handleSkillInput = (e) => {
    const parsed = e.target.value
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
    setSkillInput(e.target.value);
    setSkills(parsed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Authentication token is missing or invalid. Please log in again.");
      return;
    }

    const profileData = {
      role,
      bio,
      portfolio,
      hourly_rate: parseFloat(hourlyRate),
      availability,
      skills,
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/profiles/', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile created successfully!');
      setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
    } catch (error) {
      toast.error('Error creating profile: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center" style={{
      background: 'linear-gradient(to right, #43cea2, #185a9d)',
    }}>
      <div className="card p-4 shadow-lg animate__animated animate__fadeIn" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="text-center text-primary mb-3">Complete Your Profile</h3>
        <p className="text-muted text-center mb-4">Let clients know who you are and what you offer</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label"><FaUserTie /> Role</label>
            <select className="form-select" value={role} onChange={e => setRole(e.target.value)} required>
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label"><FaInfoCircle /> Bio</label>
            <textarea className="form-control" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about your experience..." required />
          </div>

          <div className="mb-3">
            <label className="form-label"><FaInfoCircle /> Portfolio</label>
            <input type="text" className="form-control" value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="Paste your portfolio URL or description" />
          </div>

          <div className="mb-3">
            <label className="form-label"><FaMoneyBillWave /> Hourly Rate (₹)</label>
            <input type="number" className="form-control" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="e.g. 500" required />
          </div>

          <div className="mb-3">
            <label className="form-label"><FaCheckCircle /> Availability</label>
            <select className="form-select" value={availability ? 'true' : 'false'} onChange={e => setAvailability(e.target.value === 'true')}>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label"><FaTools /> Skills</label>
            <input type="text" className="form-control" value={skillInput} onChange={handleSkillInput} placeholder="e.g. 1, 2, 3" />
            <small className="text-muted">Enter skill IDs separated by commas</small>
            {skills.length > 0 && (
              <div className="mt-2">
                <strong>Parsed Skills:</strong>
                <div className="mt-1">
                  {skills.map((skill, index) => (
                    <span key={index} className="badge bg-primary me-2 mb-2">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">Create Profile</button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
