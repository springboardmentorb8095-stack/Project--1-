import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ProjectForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [status, setStatus] = useState('open');
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
      title: title.trim(),
      description: description.trim(),
      budget: parseFloat(budget),
      duration_weeks: parseInt(durationWeeks),
      skills_required: skillsRequired
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(n => !isNaN(n)),
      status,
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/projects/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Project created successfully!');
      setTitle('');
      setDescription('');
      setBudget('');
      setDurationWeeks('');
      setSkillsRequired('');
      setStatus('open');
    } catch (err) {
      console.error("Error creating project:", err.response?.data || err.message);
      toast.error('❌ Failed to create project');
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    },
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '30px',
      maxWidth: '600px',
      width: '100%',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#333'
    },
    heading: {
      textAlign: 'center',
      marginBottom: '24px',
      fontSize: '24px',
      fontWeight: '600',
      color: '#4f46e5'
    },
    label: {
      fontWeight: '500',
      marginBottom: '6px',
      display: 'block',
      fontSize: '15px'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      marginBottom: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px',
      marginBottom: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px'
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#4f46e5',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.formCard}>
        <h2 style={styles.heading}>Create New Project</h2>

        <label style={styles.label}>Title</label>
        <input style={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" required />

        <label style={styles.label}>Description</label>
        <textarea style={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} placeholder="Project Description" rows={4} required />

        <label style={styles.label}>Budget</label>
        <input style={styles.input} value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budget in ₹" type="number" required />

        <label style={styles.label}>Duration (weeks)</label>
        <input style={styles.input} value={durationWeeks} onChange={e => setDurationWeeks(e.target.value)} placeholder="Duration in weeks" type="number" required />

        <label style={styles.label}>Skill IDs</label>
        <input style={styles.input} value={skillsRequired} onChange={e => setSkillsRequired(e.target.value)} placeholder="Comma-separated Skill IDs (e.g. 1,2)" />

        <label style={styles.label}>Status</label>
        <select style={styles.select} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <button type="submit" style={styles.button}>Create Project</button>
      </form>
    </div>
  );
}

export default ProjectForm;






/*import React, { useState } from 'react';
import axios from 'axios';

function ProjectForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [status, setStatus] = useState('open');

  const token = localStorage.getItem('access');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      budget: parseFloat(budget),
      duration_weeks: parseInt(durationWeeks),
      skills_required: skillsRequired.split(',').map(id => parseInt(id.trim())),
      status,
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/projects/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Project created successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Error creating project');
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '40px auto',
      padding: '30px',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#333'
    },
    heading: {
      textAlign: 'center',
      marginBottom: '24px',
      fontSize: '24px',
      fontWeight: '600',
      color: '#0078D4'
    },
    label: {
      fontWeight: '500',
      marginBottom: '6px',
      display: 'block',
      fontSize: '15px'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      marginBottom: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px',
      marginBottom: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px'
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#0078D4',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <h2 style={styles.heading}>Create New Project</h2>

      <label style={styles.label}>Title</label>
      <input style={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" />

      <label style={styles.label}>Description</label>
      <textarea style={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} placeholder="Project Description" rows={4} />

      <label style={styles.label}>Budget</label>
      <input style={styles.input} value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budget in ₹" type="number" />

      <label style={styles.label}>Duration (weeks)</label>
      <input style={styles.input} value={durationWeeks} onChange={e => setDurationWeeks(e.target.value)} placeholder="Duration in weeks" type="number" />

      <label style={styles.label}>Skill IDs</label>
      <input style={styles.input} value={skillsRequired} onChange={e => setSkillsRequired(e.target.value)} placeholder="Comma-separated Skill IDs (e.g. 1,2)" />

      <label style={styles.label}>Status</label>
      <select style={styles.select} value={status} onChange={e => setStatus(e.target.value)}>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>

      <button type="submit" style={styles.button}>Create Project</button>
    </form>
  );
}

export default ProjectForm;
*/





// ProjectForm.js
/*import React, { useState } from 'react';
import axios from 'axios';

function ProjectForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [status, setStatus] = useState('open');

  const token = localStorage.getItem('access');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      budget: parseFloat(budget),
      duration_weeks: parseInt(durationWeeks),
      skills_required: skillsRequired.split(',').map(id => parseInt(id.trim())),
      status,
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/projects/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Project created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating project');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budget" type="number" />
      <input value={durationWeeks} onChange={e => setDurationWeeks(e.target.value)} placeholder="Duration (weeks)" type="number" />
      <input value={skillsRequired} onChange={e => setSkillsRequired(e.target.value)} placeholder="Skill IDs (e.g. 1,2)" />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
      <button type="submit">Create Project</button>
    </form>
  );
}

export default ProjectForm;*/
