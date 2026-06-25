import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finlearnx_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 — use custom event so React Router handles the redirect
// NEVER use window.location.href inside an axios interceptor during React render
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('finlearnx_token');
      localStorage.removeItem('finlearnx_user');
      // Dispatch event — handled by AuthContext, not here
      window.dispatchEvent(new CustomEvent('flx_unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
