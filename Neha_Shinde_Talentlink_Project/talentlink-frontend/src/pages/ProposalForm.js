import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ProposalForm({ projectId }) {
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [timelineWeeks, setTimelineWeeks] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('access');
    const isJWT = /^ey[\w-]+\.[\w-]+\.[\w-]+$/.test(storedToken);
    if (storedToken && isJWT) {
      setToken(storedToken);
    } else {
      toast.error("Missing or invalid token. Please log in.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      project: parseInt(projectId),
      proposed_rate: parseFloat(bidAmount),
      message: message.trim(),
      timeline_weeks: parseInt(timelineWeeks)
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/proposals/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Proposal submitted!');
      setBidAmount('');
      setMessage('');
      setTimelineWeeks('');
    } catch (err) {
      console.error("Error submitting proposal:", err.response?.data || err.message);
      toast.error('❌ Failed to submit proposal: ' + (err.response?.data?.detail || err.message));
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    marginBottom: '16px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontWeight: '600',
    marginBottom: '6px',
    display: 'block',
    fontSize: '15px'
  };

  const buttonStyle = {
    padding: '14px',
    backgroundColor: '#6a11cb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
      <div>
        <label style={labelStyle}>💰 Bid Amount</label>
        <input
          value={bidAmount}
          onChange={e => setBidAmount(e.target.value)}
          placeholder="Enter your bid in ₹"
          type="number"
          style={inputStyle}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>📝 Message</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Describe your approach or experience"
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>⏱ Timeline (weeks)</label>
        <input
          value={timelineWeeks}
          onChange={e => setTimelineWeeks(e.target.value)}
          placeholder="Estimated duration"
          type="number"
          style={inputStyle}
          required
        />
      </div>

      <button type="submit" style={buttonStyle}>Submit Proposal</button>
    </form>
  );
}

export default ProposalForm;



/*import React, { useState } from 'react';
import axios from 'axios';

function ProposalForm({ projectId }) {
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [timelineWeeks, setTimelineWeeks] = useState('');
  const token = localStorage.getItem('access');

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Access token:", token);

  const payload = {
    project: parseInt(projectId),
    proposed_rate: parseFloat(bidAmount),
    message,
    timeline_weeks: parseInt(timelineWeeks)
  };

  console.log("Submitting proposal payload:", payload);

  try {
    await axios.post('http://127.0.0.1:8000/api/proposals/', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Proposal submitted!');
  } catch (err) {
    console.error("Error response:", err.response?.data);
    alert('Error submitting proposal: ' + JSON.stringify(err.response?.data));
  }
};



  return (
    <form onSubmit={handleSubmit}>
      <input value={bidAmount} onChange={e => setBidAmount(e.target.value)} placeholder="Bid Amount" type="number" />
      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" />
      <input value={timelineWeeks} onChange={e => setTimelineWeeks(e.target.value)} placeholder="Timeline (weeks)" type="number" />
      <button type="submit">Submit Proposal</button>
    </form>
  );
}

export default ProposalForm;*/
