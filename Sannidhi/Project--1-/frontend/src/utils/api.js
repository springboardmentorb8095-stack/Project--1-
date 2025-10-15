// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(async (config) => {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (access) config.headers.Authorization = `Bearer ${access}`;

  const tokenData = parseJwt(access);
  const now = Date.now() / 1000;

  if (tokenData && tokenData.exp < now && refresh) {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh,
      });
      localStorage.setItem("access", res.data.access);
      config.headers.Authorization = `Bearer ${res.data.access}`;
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
  }

  return config;
});

function parseJwt(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export default api;
