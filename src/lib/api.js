import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    // We need to check if window is defined because Next.js does SSR
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for generic error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let message = 'An unexpected error occurred';

    if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') 
      }
      message = error.response.data?.message || error.response.data?.error || error.response.statusText || message;
    } else if (error.request) {
      // Request made but no response
      message = 'No response from server. Please check your connection.';
    } else {
      message = error.message;
    }

    console.error('API Error:', message, error);
    return Promise.reject(message);
  }
);

export default api;
