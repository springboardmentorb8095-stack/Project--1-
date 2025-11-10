import axios from "axios";


// ------------------------------
// ✅ BASE CONFIGURATION
// ------------------------------
const isDevelopment = import.meta.env.MODE === "development";

const myBaseUrl = isDevelopment
  ? import.meta.env.VITE_API_BASE_URL_LOCAL
  : import.meta.env.VITE_API_BASE_URL_DEPLOY;

console.log("🔍 API base URL:", myBaseUrl);

const API = axios.create({
  baseURL: myBaseUrl,
  headers: { "Content-Type": "application/json" },
});
// ------------------------------
// 🔁 REFRESH TOKEN FUNCTION
// ------------------------------
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await axios.post(
      `${API.defaults.baseURL}token/refresh/`,
      { refresh: refreshToken }
    );

    const newAccessToken = response.data.access;
    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("🔒 Token refresh failed:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// ------------------------------
// 🪪 REQUEST INTERCEPTOR
// ------------------------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------
// ⚠️ RESPONSE INTERCEPTOR (HANDLE 401)
// ------------------------------
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest); // Retry with new token
      }
    }

    return Promise.reject(error);
  }
);

// ------------------------------
// 📦 API ENDPOINT HELPERS
// ------------------------------

// ✅ Notifications
export const fetchNotifications = () => API.get("notifications/");
export const markNotificationAsRead = (id) =>
  API.patch(`notifications/${id}/`, { is_read: true });

// ✅ Projects
export const fetchProjects = () => API.get("projects/");
export const createProject = (data) => API.post("projects/", data);

// ✅ Proposals
export const fetchProposals = () => API.get("proposals/");
export const sendProposal = (data) => API.post("proposals/", data);
export const acceptProposal = (id) => API.post(`proposals/${id}/accept/`);

// ✅ Contracts
export const fetchContracts = () => API.get("contracts/");

// ✅ Messages
export const fetchMessages = (contractId) =>
  API.get(`messages/?contract=${contractId}`);
export const sendMessage = (data) => API.post("messages/", data);

// ✅ Authentication
export const registerUser = (data) => API.post("register/", data);
export const loginUser = (data) => API.post("login/", data);

// ------------------------------
// 🧩 EXPORT DEFAULT
// ------------------------------
export default API;
