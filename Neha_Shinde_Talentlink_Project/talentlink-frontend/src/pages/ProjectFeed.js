import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProjectFeed() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    skill: '',
    min_budget: '',
    max_budget: '',
    max_duration: ''
  });

  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('access');
    const isJWT = /^ey[\w-]+\.[\w-]+\.[\w-]+$/.test(storedToken);
    if (storedToken && isJWT) {
      setToken(storedToken);
    } else {
      console.warn("Missing or invalid token");
    }
  }, []);

  useEffect(() => {
    if (token) fetchProjects(); // initial load
  }, [token]);

  const fetchProjects = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const url = `http://127.0.0.1:8000/api/projects/${query ? '?' + query : ''}`;

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    const cleanFilters = {
      skill: filters.skill.trim(),
      min_budget: filters.min_budget || undefined,
      max_budget: filters.max_budget || undefined,
      max_duration: filters.max_duration || undefined
    };
    fetchProjects(cleanFilters);
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#fff'
    },
    heading: {
      textAlign: 'center',
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '30px',
      background: 'linear-gradient(to right, #ffffff, #d1d5db)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    filterWrapper: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '900px',
      margin: '0 auto 30px'
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    input: {
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
      width: '100%',
      boxSizing: 'border-box'
    },
    button: {
      padding: '12px',
      backgroundColor: '#6a11cb',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      width: '100%'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    card: {
      backgroundColor: '#ffffff',
      color: '#333',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#6a11cb'
    },
    detail: {
      marginBottom: '6px',
      fontSize: '15px',
      lineHeight: '1.4'
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Project Feed</h2>

      <div style={styles.filterWrapper}>
        <div style={styles.filterGrid}>
          <input
            style={styles.input}
            name="skill"
            value={filters.skill}
            onChange={handleInputChange}
            placeholder="Skill"
          />
          <input
            style={styles.input}
            name="min_budget"
            value={filters.min_budget}
            onChange={handleInputChange}
            placeholder="Min Budget"
            type="number"
          />
          <input
            style={styles.input}
            name="max_budget"
            value={filters.max_budget}
            onChange={handleInputChange}
            placeholder="Max Budget"
            type="number"
          />
          <input
            style={styles.input}
            name="max_duration"
            value={filters.max_duration}
            onChange={handleInputChange}
            placeholder="Max Duration (weeks)"
            type="number"
          />
        </div>
        <button style={styles.button} onClick={handleFilter}>Filter</button>
      </div>

      <div style={styles.grid}>
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} style={styles.card}>
              <h4 style={styles.title}>{project.title}</h4>
              <p style={styles.detail}><strong>Description:</strong> {project.description}</p>
              <p style={styles.detail}><strong>💰 Budget:</strong> ₹{project.budget}</p>
              <p style={styles.detail}><strong>⏱ Duration:</strong> {project.duration_weeks} weeks</p>
              <p style={styles.detail}><strong>📌 Status:</strong> {project.status}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#fff' }}>No projects found.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectFeed;




/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterBar from '../components/FilterBar';

function ProjectFeed() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('access');

  const fetchProjects = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const url = `http://127.0.0.1:8000/api/projects/${query ? '?' + query : ''}`;

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects(); // initial load
  }, []);

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#fff'
    },
    heading: {
      textAlign: 'center',
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '30px',
      background: 'linear-gradient(to right, #ffffff, #d1d5db)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    filterWrapper: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '0 auto 30px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    card: {
      backgroundColor: '#ffffff',
      color: '#333',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#6a11cb'
    },
    detail: {
      marginBottom: '6px',
      fontSize: '15px',
      lineHeight: '1.4'
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Project Feed</h2>

      <div style={styles.filterWrapper}>
        <FilterBar onFilter={fetchProjects} />
      </div>

      <div style={styles.grid}>
        {projects.map(project => (
          <div key={project.id} style={styles.card}>
            <h4 style={styles.title}>{project.title}</h4>
            <p style={styles.detail}><strong>Description:</strong> {project.description}</p>
            <p style={styles.detail}><strong>💰 Budget:</strong> ₹{project.budget}</p>
            <p style={styles.detail}><strong>⏱ Duration:</strong> {project.duration_weeks} weeks</p>
            <p style={styles.detail}><strong>📌 Status:</strong> {project.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectFeed;*/




/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterBar from '../components/FilterBar';

function ProjectFeed() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('access');

  const fetchProjects = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const url = `http://127.0.0.1:8000/api/projects/${query ? '?' + query : ''}`;

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects(); // initial load
  }, []);

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#fff'
    },
    heading: {
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: '600',
      marginBottom: '30px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginTop: '30px'
    },
    card: {
      backgroundColor: '#ffffff',
      color: '#333',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#6a11cb'
    },
    detail: {
      marginBottom: '6px',
      fontSize: '15px',
      lineHeight: '1.4'
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Project Feed</h2>
      <FilterBar onFilter={fetchProjects} />
      <div style={styles.grid}>
        {projects.map(project => (
          <div key={project.id} style={styles.card}>
            <h4 style={styles.title}>{project.title}</h4>
            <p style={styles.detail}><strong>Description:</strong> {project.description}</p>
            <p style={styles.detail}><strong>💰 Budget:</strong> ₹{project.budget}</p>
            <p style={styles.detail}><strong>⏱ Duration:</strong> {project.duration_weeks} weeks</p>
            <p style={styles.detail}><strong>📌 Status:</strong> {project.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectFeed;*/




/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterBar from '../components/FilterBar';

function ProjectFeed() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('access');

  const fetchProjects = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const url = `http://127.0.0.1:8000/api/projects/${query ? '?' + query : ''}`;

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects(); // initial load
  }, []);

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#fff'
    },
    heading: {
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: '600',
      marginBottom: '30px'
    },
    card: {
      backgroundColor: '#ffffff',
      color: '#333',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#4f46e5'
    },
    detail: {
      marginBottom: '6px',
      fontSize: '15px'
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Project Feed</h2>
      <FilterBar onFilter={fetchProjects} />
      {projects.map(project => (
        <div key={project.id} style={styles.card}>
          <h4 style={styles.title}>{project.title}</h4>
          <p style={styles.detail}>{project.description}</p>
          <p style={styles.detail}>💰 Budget: ₹{project.budget}</p>
          <p style={styles.detail}>⏱ Duration: {project.duration_weeks} weeks</p>
          <p style={styles.detail}>📌 Status: {project.status}</p>
        </div>
      ))}
    </div>
  );
}

export default ProjectFeed;
*/



// pages/ProjectFeed.js
/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterBar from '../components/FilterBar';

function ProjectFeed() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('access');

  const fetchProjects = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const url = `http://127.0.0.1:8000/api/projects/${query ? '?' + query : ''}`;

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects(); // initial load
  }, []);

  return (
    <div>
      <h2>Project Feed</h2>
      <FilterBar onFilter={fetchProjects} />
      {projects.map(project => (
        <div key={project.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h4>{project.title}</h4>
          <p>{project.description}</p>
          <p>Budget: ₹{project.budget}</p>
          <p>Duration: {project.duration_weeks} weeks</p>
          <p>Status: {project.status}</p>
        </div>
      ))}
    </div>
  );
}

export default ProjectFeed;*/
