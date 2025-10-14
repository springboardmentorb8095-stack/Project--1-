import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        original.headers.Authorization = `Bearer ${access}`;
        return api(original);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    profile: '/auth/profile/',
    refresh: '/auth/token/refresh/',
  },
  profiles: {
    list: '/profiles/',
    me: '/profiles/me/',
    detail: (id) => `/profiles/${id}/`,
    skills: '/profiles/skills/',
  },
  projects: {
    list: '/projects/',
    detail: (id) => `/projects/${id}/`,
    myProjects: '/projects/my-projects/',
  },
  proposals: {
    list: '/proposals/',
    detail: (id) => `/proposals/${id}/`,
    accept: (id) => `/proposals/${id}/accept/`,
    reject: (id) => `/proposals/${id}/reject/`,
    byProject: (projectId) => `/proposals/project/${projectId}/`,
  },
};
