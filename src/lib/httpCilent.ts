import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
//   baseURL: 'https://dev.ryzer.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token to Requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Fetch token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry & Errors




export default api;
