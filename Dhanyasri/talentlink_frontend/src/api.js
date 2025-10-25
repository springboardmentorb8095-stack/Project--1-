import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/accounts/",
});

// Refresh function
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return false;

  try {
    const res = await axios.post(`${API.defaults.baseURL}token/refresh/`, {
      refresh: refreshToken,
    });
    localStorage.setItem("access_token", res.data.access);
    return res.data.access;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// Add JWT token automatically if available
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("access_token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

// Handle expired token automatically
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Only handle 401 errors and prevent infinite loop
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest); // retry original request
      }
    }

    return Promise.reject(err);
  }
);

export default API;
