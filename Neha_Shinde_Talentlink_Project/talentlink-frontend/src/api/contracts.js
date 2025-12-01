import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const getAuthHeaders = (token) => {
  if (!token || !token.startsWith('ey')) {
    console.warn('Invalid or missing token');
    return null;
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const createContract = async (contractData, token) => {
  const headers = getAuthHeaders(token);
  if (!headers) throw new Error('Cannot create contract: missing token');

  try {
    const response = await axios.post(`${API_BASE}/contracts/`, contractData, { headers });
    return response.data;
  } catch (error) {
    console.error('Contract creation failed:', error.response?.data || error.message);
    throw error;
  }
};

export const getContracts = async (token) => {
  const headers = getAuthHeaders(token);
  if (!headers) throw new Error('Cannot fetch contracts: missing token');

  try {
    const response = await axios.get(`${API_BASE}/contracts/`, { headers });
    return response.data;
  } catch (error) {
    console.error('Fetching contracts failed:', error.response?.data || error.message);
    throw error;
  }
};
