import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileContract, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';

const CreateContractForm = () => {
  const [formData, setFormData] = useState({
    proposal_id: '',
    start_date: '',
    terms: '',
  });

  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('access');
    const isJWT = /^ey[\w-]+\.[\w-]+\.[\w-]+$/.test(storedToken);
    if (storedToken && isJWT) {
      setToken(storedToken);
      setTokenValid(true);
    } else {
      console.warn("Invalid or missing token");
      setTokenValid(false);
    }
  }, []);

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .contract-form-wrapper {
        background: linear-gradient(to right, #667eea, #764ba2);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
      }
      .contract-form {
        background-color: #fff;
        max-width: 500px;
        width: 100%;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        animation: fadeIn 0.6s ease-in-out;
      }
      .contract-form h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #4c1d95;
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .contract-form label {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
        display: block;
      }
      .contract-form input,
      .contract-form textarea {
        width: 100%;
        padding: 0.75rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 1rem;
      }
      .contract-form button {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: none;
        border-radius: 8px;
        background-color: #4c1d95;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;
      }
      .contract-form button:hover {
        background-color: #5b21b6;
      }
    `;
    document.head.appendChild(styleTag);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tokenValid) {
      alert("Authentication token is missing or invalid. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/contracts/',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Contract created:", response.data);
      alert("✅ Contract created successfully!");
      setFormData({
        proposal_id: '',
        start_date: '',
        terms: '',
      });
    } catch (error) {
      console.error("Error creating contract:", error.response?.data || error.message);
      alert("❌ Failed to create contract: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contract-form-wrapper">
      <form onSubmit={handleSubmit} className="contract-form">
        <h3><FaFileContract /> Create Contract</h3>

        <label><FaClipboardList /> Proposal ID</label>
        <input
          name="proposal_id"
          placeholder="Enter Accepted Proposal ID"
          value={formData.proposal_id}
          onChange={handleChange}
          required
        />

        <label><FaCalendarAlt /> Start Date</label>
        <input
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />

        <label><FaClipboardList /> Contract Terms</label>
        <textarea
          name="terms"
          placeholder="Enter contract terms..."
          value={formData.terms}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={!tokenValid || loading}>
          {loading ? 'Creating...' : 'Create Contract'}
        </button>
      </form>
    </div>
  );
};

export default CreateContractForm;
