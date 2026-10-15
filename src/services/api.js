import axios from 'axios';
import { useUserStore } from '../stores/userStore';

function resolveApiBaseUrl() {
  const configuredDevBase = import.meta.env.VITE_API_URL;
  const configuredProdBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

  // In development, avoid forcing production domain from .env (CORS on LAN).
  if (import.meta.env.DEV) {
    if (configuredDevBase) {
      return configuredDevBase.endsWith('/api')
        ? configuredDevBase
        : `${configuredDevBase.replace(/\/+$/, '')}/api`;
    }

    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol || 'http:';
      const host = window.location.hostname || 'localhost';
      return `${protocol}//${host}:3000/api`;
    }

    return 'http://localhost:3000/api';
  }

  const configuredBase = configuredProdBase;
  if (configuredBase) {
    return configuredBase.endsWith('/api') ? configuredBase : `${configuredBase.replace(/\/+$/, '')}/api`;
  }

  // Same-domain default (Vercel full-stack: frontend + /api on one domain).
  // No VITE_* needed. Avoids CORS and :3000 fallback in prod.
  return '/api';
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    const requestUrl = String(error?.config?.url || '');

    // Only hard-logout when identity check fails.
    // Other 401s should be handled by caller to avoid silent login loops.
    const shouldForceLogout = requestUrl.includes('/auth/me');
    if (!shouldForceLogout) {
      return Promise.reject(error);
    }

    const userStore = useUserStore();
    userStore.logout();
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
