import api, { endpoints } from './api';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post(endpoints.auth.login, {
        email,
        password,
      });

      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      return user;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  async register(userData) {
    try {
      const response = await api.post(endpoints.auth.register, userData);

      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      return user;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get(endpoints.auth.profile);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get user data' };
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};
