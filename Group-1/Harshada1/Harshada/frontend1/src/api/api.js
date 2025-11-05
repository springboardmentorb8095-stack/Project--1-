// 📁 src/api/api.js
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

// 🌐 Axios instance setup
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
});

// 🧠 Automatically include access token in headers
API.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// 🔁 Handle expired tokens globally
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccess = await refreshToken(localStorage.getItem("refresh"));

      if (newAccess) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        showToast("🔁 Session refreshed successfully!", "success");
        return API(originalRequest);
      } else {
        showToast("⚠️ Session expired. Please log in again.", "error");
        handleLogout();
      }
    }

    showToast("❌ Request failed. Please try again later.", "error");
    return Promise.reject(error);
  }
);

//
// ✨ API WRAPPERS
//

// 🔐 LOGIN
export async function loginUser(username, password) {
  try {
    const res = await API.post("/token/", { username, password });
    const data = res.data;

    if (data.access && data.refresh) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify({ username }));
      showToast("✅ Login successful!", "success");
    }

    return data;
  } catch (err) {
    showToast("❌ Invalid username or password!", "error");
    throw err;
  }
}

// 🔑 Forgot Password
export async function forgotPassword(emailOrMobile) {
  try {
    const res = await API.post("/forgot-password/", {
      identifier: emailOrMobile,
    });
    showToast("📧 Reset link sent successfully!", "success");
    return res.data;
  } catch (err) {
    showToast("⚠️ Could not send reset link!", "error");
    throw err;
  }
}

// 🤝 Contracts
export const createContract = async (proposalId) => {
  try {
    const res = await API.post("/contracts/", { proposal: proposalId });
    showToast("📜 Contract created successfully!", "success");
    return res.data;
  } catch (err) {
    showToast("❌ Failed to create contract!", "error");
    throw err;
  }
};

export const getContracts = async () => {
  try {
    const res = await API.get("/contracts/");
    return res.data;
  } catch (err) {
    showToast("⚠️ Failed to load contracts.", "error");
    throw err;
  }
};

// 💬 Messaging
export const sendMessage = async (contractId, content) => {
  try {
    const res = await API.post("/messages/", { contract: contractId, content });
    return res.data;
  } catch (err) {
    showToast("❌ Failed to send message.", "error");
    throw err;
  }
};

export const getMessages = async (contractId) => {
  try {
    const res = await API.get(`/messages/?contract=${contractId}`);
    return res.data;
  } catch (err) {
    showToast("⚠️ Failed to load messages.", "error");
    throw err;
  }
};

//
// 🔁 TOKEN MANAGEMENT
//
export async function refreshToken(refreshToken) {
  if (!refreshToken) return null;
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
      refresh: refreshToken,
    });

    if (res.data.access) {
      localStorage.setItem("access", res.data.access);
      console.log("🔄 Access token refreshed");
      return res.data.access;
    }
  } catch (err) {
    console.warn("⚠️ Token refresh failed:", err.message);
    showToast("⚠️ Token refresh failed. Please log in again.", "error");
    return null;
  }
}

//
// 🚪 LOGOUT
//
export function handleLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");

  showToast("👋 Logged out successfully!", "info");

  setTimeout(() => {
    window.location.href = "/login";
  }, 1200);
}

//
// 🧩 GENERIC FETCH HELPER
//
export async function apiFetch(url, options = {}) {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (access) headers["Authorization"] = `Bearer ${access}`;

  let response = await fetch(`http://127.0.0.1:8000/api/${url}`, {
    ...options,
    headers,
  });

  // Retry with new token if unauthorized
  if (response.status === 401 && refresh) {
    const newAccess = await refreshToken(refresh);
    if (newAccess) {
      headers["Authorization"] = `Bearer ${newAccess}`;
      response = await fetch(`http://127.0.0.1:8000/api/${url}`, {
        ...options,
        headers,
      });
    } else {
      handleLogout();
    }
  }

  if (response.status === 401) handleLogout();

  try {
    return await response.json();
  } catch (err) {
    console.error("⚠️ Failed to parse JSON:", err);
    return null;
  }
}

//
// ⚙️ UTILITIES
//
export const isLoggedIn = () => !!localStorage.getItem("access");

export const getCurrentUser = () =>
  JSON.parse(localStorage.getItem("user") || "{}");

// 🌈 Toastify Helper
export function showToast(message, type = "info") {
  Toastify({
    text: message,
    duration: 2500,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background:
        type === "error"
          ? "linear-gradient(to right, #ef4444, #dc2626)"
          : type === "success"
          ? "linear-gradient(to right, #16a34a, #22c55e)"
          : "linear-gradient(to right, #2563eb, #4f46e5)",
      borderRadius: "8px",
      fontWeight: "500",
    },
  }).showToast();
}
