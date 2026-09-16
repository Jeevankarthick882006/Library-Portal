// src/services/api.js - Centralized Axios API Client
import axios from 'axios';

// Create an Axios instance with base URL pointing to Express backend
const api = axios.create({
  baseURL: '/api', // Vite proxy forwards this to http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: automatically attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle common auth errors like expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or unauthorized on private endpoint, clear stale data
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
