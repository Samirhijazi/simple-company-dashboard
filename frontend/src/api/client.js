import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the mock auth token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("dashboard_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email, password) =>
    client
      .post("/auth/login", { email, password })
      .then((res) => res.data.data),
};

export default client;
