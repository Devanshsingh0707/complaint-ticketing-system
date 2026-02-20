import axios from "axios";

// Create an axios instance with default settings
const api = axios.create({
  baseURL: "https://complaint-ticketing-system.onrender.com/api",
});

// This interceptor runs before every request
// It automatically adds the JWT token to every API call so we don't have to do it manually
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
