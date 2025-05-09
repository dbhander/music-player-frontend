import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",   // point to your Spring Boot server + /api
  withCredentials: true,                   // if you ever need cookies
});

// (Optional) Attach JWT if you have a global interceptor:
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
