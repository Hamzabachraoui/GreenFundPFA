import axios from 'axios';
import { authService } from './auth';
import { API_URL } from '../config';

declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};

// Vérifier si nous sommes dans un environnement navigateur
const isBrowser = typeof window !== 'undefined';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = authService.getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const tokens = await authService.refreshToken();
        
        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth and redirect to login
        authService.clearStoredUser();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const getAccessToken = () => {
  if (!isBrowser) return null;
  const token = localStorage.getItem('access_token');
  console.log('🔑 Getting access token:', !!token);
  return token;
};

export const getRefreshToken = () => {
  if (!isBrowser) return null;
  return localStorage.getItem('refresh_token');
};

export const setTokens = (access: string, refresh: string) => {
  if (!isBrowser) return;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
};

export const clearTokens = () => {
  if (!isBrowser) return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete api.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
  if (!isBrowser) return false;
  return !!getAccessToken();
};

export default api; 