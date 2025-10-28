import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaUser, FaProjectDiagram, FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('access');

  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`
  }), [token]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/contracts/', { headers })
      .then(res => setContracts(res.data))
      .catch(err => console.error('Error fetching contracts:', err));
  }, [headers]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${id}/`,
        { status: newStatus },
        { headers }
      );
      setContracts(prev =>
        prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
      );
      toast.success('Status updated successfully!');
    } catch (err) {
      toast.error('Failed to update status.');
      console.error('Error updating status:', err.response?.data || err.message);
    }
  };

  const statusColors = {
    draft: '#facc15',
    active: '#4ade80',
    completed: '#60a5fa',
    cancelled: '#f87171',
  };

  const filteredContracts = contracts.filter(contract =>
    contract.project_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    wrapper: {
      padding: '32px',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    container: {
      width: '100%',
      maxWidth: '1200px',
    },
    heading: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '24px',
      color: '#1f2937',
    },
    overviewPanel: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
    },
    overviewTile: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
      textAlign: 'center',
      fontWeight: '600',
      color: '#374151',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      backgroundColor: '#ffffff',
      padding: '16px',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    searchInput: {
      padding: '10px 14px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      width: '100%',
      maxWidth: '300px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '20px',
    },
    card: {
      background: '#ffffff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
      borderLeft: '6px solid transparent',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
    },
    label: {
      fontWeight: '600',
      marginRight: '6px',
      color: '#374151',
    },
    badge: (status) => ({
      backgroundColor: statusColors[status],
      padding: '4px 10px',
      borderRadius: '12px',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '0.85rem',
    }),
    select: {
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      backgroundColor: '#f3f4f6',
    },
    emptyState: {
      textAlign: 'center',
      marginTop: '60px',
      color: '#6b7280',
    },
    illustration: {
      width: '180px',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h3 style={styles.heading}>📄 My Contracts</h3>

        <div style={styles.overviewPanel}>
          <div style={styles.overviewTile}>Total: {contracts.length}</div>
          <div style={styles.overviewTile}>Active: {contracts.filter(c => c.status === 'active').length}</div>
          <div style={styles.overviewTile}>Completed: {contracts.filter(c => c.status === 'completed').length}</div>
          <div style={styles.overviewTile}>Cancelled: {contracts.filter(c => c.status === 'cancelled').length}</div>
        </div>

        <div style={styles.searchBar}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search by project title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {filteredContracts.length === 0 ? (
          <div style={styles.emptyState}>
            <img
              src="https://undraw.co/api/illustrations/contract.svg"
              alt="No contracts"
              style={styles.illustration}
            />
            <p>No contracts found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredContracts.map(contract => (
              <div
                key={contract.id}
                style={{
                  ...styles.card,
                  borderLeft: `6px solid ${statusColors[contract.status]}`,
                }}
              >
                <div style={styles.row}>
                  <div>
                    <div><FaProjectDiagram /> <span style={styles.label}>Project:</span> {contract.project_title || 'N/A'}</div>
                    <div><FaUser /> <span style={styles.label}>Freelancer:</span> {contract.freelancer || 'N/A'}</div>
                    <div><FaUser /> <span style={styles.label}>Client:</span> {contract.client || 'N/A'}</div>
                    <div>
                      <span style={styles.label}>Status:</span>
                      <span style={styles.badge(contract.status)}>{contract.status}</span>
                    </div>
                  </div>
                  <div>
                    <select
                      style={styles.select}
                      value={contract.status}
                      onChange={(e) => updateStatus(contract.id, e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ContractsPage;



/*import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaUser, FaProjectDiagram, FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('access');

  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`
  }), [token]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/contracts/', { headers })
      .then(res => setContracts(res.data))
      .catch(err => console.error('Error fetching contracts:', err));
  }, [headers]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${id}/`,
        { status: newStatus },
        { headers }
      );
      setContracts(prev =>
        prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
      );
      toast.success('Status updated successfully!');
    } catch (err) {
      toast.error('Failed to update status.');
      console.error('Error updating status:', err.response?.data || err.message);
    }
  };

  const statusColors = {
    draft: '#facc15',
    active: '#4ade80',
    completed: '#60a5fa',
    cancelled: '#f87171',
  };

  const filteredContracts = contracts.filter(contract =>
    contract.project_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    wrapper: {
      padding: '24px',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
    },
    heading: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#1f2937',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      gap: '8px',
    },
    searchInput: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      width: '100%',
      maxWidth: '300px',
    },
    analytics: {
      marginBottom: '24px',
      backgroundColor: '#fff',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      color: '#374151',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '16px',
    },
    card: {
      background: '#ffffff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
      borderLeft: '6px solid transparent',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
    },
    label: {
      fontWeight: '600',
      marginRight: '6px',
      color: '#374151',
    },
    badge: (status) => ({
      backgroundColor: statusColors[status],
      padding: '4px 10px',
      borderRadius: '12px',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '0.85rem',
    }),
    select: {
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      backgroundColor: '#f3f4f6',
    },
    emptyState: {
      textAlign: 'center',
      marginTop: '60px',
      color: '#6b7280',
    },
    illustration: {
      width: '180px',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>📄 My Contracts</h3>

      <div style={styles.analytics}>
        <strong>Overview:</strong>
        <p>Total: {contracts.length} | Active: {contracts.filter(c => c.status === 'active').length} | Completed: {contracts.filter(c => c.status === 'completed').length}</p>
      </div>

      <div style={styles.searchBar}>
        <FaSearch />
        <input
          type="text"
          placeholder="Search by project title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {filteredContracts.length === 0 ? (
        <div style={styles.emptyState}>
          <img
            src="https://undraw.co/api/illustrations/contract.svg"
            alt="No contracts"
            style={styles.illustration}
          />
          <p>No contracts found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredContracts.map(contract => (
            <div
              key={contract.id}
              style={{
                ...styles.card,
                borderLeft: `6px solid ${statusColors[contract.status]}`,
              }}
            >
              <div style={styles.row}>
                <div>
                  <div><FaProjectDiagram /> <span style={styles.label}>Project:</span> {contract.project_title || 'N/A'}</div>
                  <div><FaUser /> <span style={styles.label}>Freelancer:</span> {contract.freelancer || 'N/A'}</div>
                  <div><FaUser /> <span style={styles.label}>Client:</span> {contract.client || 'N/A'}</div>
                  <div>
                    <span style={styles.label}>Status:</span>
                    <span style={styles.badge(contract.status)}>{contract.status}</span>
                  </div>
                </div>
                <div>
                  <select
                    style={styles.select}
                    value={contract.status}
                    onChange={(e) => updateStatus(contract.id, e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ContractsPage;*/



/*import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaUser, FaProjectDiagram } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const token = localStorage.getItem('access');

  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`
  }), [token]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/contracts/', { headers })
      .then(res => setContracts(res.data))
      .catch(err => console.error('Error fetching contracts:', err));
  }, [headers]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${id}/`,
        { status: newStatus },
        { headers }
      );
      setContracts(prev =>
        prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
      );
      toast.success('Status updated successfully!');
    } catch (err) {
      toast.error('Failed to update status.');
      console.error('Error updating status:', err.response?.data || err.message);
    }
  };

  const statusColors = {
    draft: '#facc15',
    active: '#4ade80',
    completed: '#60a5fa',
    cancelled: '#f87171',
  };

  const styles = {
    wrapper: {
      padding: '24px',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
    },
    heading: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#1f2937',
    },
    card: {
      background: '#ffffff',
      padding: '20px',
      marginBottom: '16px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s ease',
    },
    cardHover: {
      transform: 'scale(1.01)',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    label: {
      fontWeight: '600',
      marginRight: '6px',
      color: '#374151',
    },
    badge: (status) => ({
      backgroundColor: statusColors[status],
      padding: '4px 10px',
      borderRadius: '12px',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '0.85rem',
    }),
    select: {
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      backgroundColor: '#f3f4f6',
    },
    emptyState: {
      textAlign: 'center',
      marginTop: '60px',
      color: '#6b7280',
    },
    illustration: {
      width: '180px',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>📄 My Contracts</h3>
      {contracts.length === 0 ? (
        <div style={styles.emptyState}>
          <img
            src="https://undraw.co/api/illustrations/contract.svg"
            alt="No contracts"
            style={styles.illustration}
          />
          <p>No contracts found. Once you start collaborating, they’ll appear here!</p>
        </div>
      ) : (
        contracts.map(contract => (
          <div
            key={contract.id}
            style={{
              ...styles.card,
              borderLeft: `6px solid ${statusColors[contract.status]}`,
            }}
          >
            <div style={styles.row}>
              <div>
                <div><FaProjectDiagram /> <span style={styles.label}>Project:</span> {contract.project_title || 'N/A'}</div>
                <div><FaUser /> <span style={styles.label}>Freelancer:</span> {contract.freelancer || 'N/A'}</div>
                <div><FaUser /> <span style={styles.label}>Client:</span> {contract.client || 'N/A'}</div>
                <div>
                  <span style={styles.label}>Status:</span>
                  <span style={styles.badge(contract.status)}>{contract.status}</span>
                </div>
              </div>
              <div>
                <select
                  style={styles.select}
                  value={contract.status}
                  onChange={(e) => updateStatus(contract.id, e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ContractsPage;*/




/*import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const token = localStorage.getItem('access');

  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`
  }), [token]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/contracts/', { headers })
      .then(res => setContracts(res.data))
      .catch(err => console.error('Error fetching contracts:', err));
  }, [headers]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${id}/`,
        { status: newStatus },
        { headers }
      );
      setContracts(prev =>
        prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error('Error updating status:', err.response?.data || err.message);
    }
  };

  const styles = {
    wrapper: {
      padding: '20px',
      fontFamily: 'Segoe UI, sans-serif',
    },
    card: {
      background: '#f3f4f6',
      padding: '16px',
      marginBottom: '12px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontWeight: '600',
      marginRight: '8px',
    },
    select: {
      padding: '6px',
      borderRadius: '6px',
    },
  };

  return (
    <div style={styles.wrapper}>
      <h3>My Contracts</h3>
      {contracts.length === 0 ? (
        <p>No contracts found.</p>
      ) : (
        contracts.map(contract => (
          <div key={contract.id} style={styles.card}>
            <div style={styles.row}>
              <div>
                <div><span style={styles.label}>Project:</span> {contract.project_title || 'N/A'}</div>
                <div><span style={styles.label}>Freelancer:</span> {contract.freelancer || 'N/A'}</div>
                <div><span style={styles.label}>Client:</span> {contract.client || 'N/A'}</div>
                <div><span style={styles.label}>Status:</span> {contract.status}</div>
              </div>
              <div>
                <select
                  style={styles.select}
                  value={contract.status}
                  onChange={(e) => updateStatus(contract.id, e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ContractsPage;*/
