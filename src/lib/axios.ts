import axios from 'axios';
import { getStoredJWT, getStoredRefreshToken, isJWTExpired, clearJWT, storeJWT } from '@/utils/jwt';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8095/api';

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Loading state management
let loadingCallbacks: {
  start: (text?: string) => void;
  stop: () => void;
} | null = null;

export const setLoadingCallbacks = (callbacks: {
  start: (text?: string) => void;
  stop: () => void;
}) => {
  loadingCallbacks = callbacks;
};

// JWT expiration callback
let onJWTExpired: (() => void) | null = null;

export const setJWTExpiredCallback = (callback: () => void) => {
  onJWTExpired = callback;
};

// Track if a refresh is already in progress
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (!config.headers['x-no-loading']) {
      loadingCallbacks?.start();
    }

    const token = getStoredJWT();
    if (token && !isJWTExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    loadingCallbacks?.stop();
    return Promise.reject(error);
  }
);

// Response interceptor — silent refresh on 401
api.interceptors.response.use(
  (response) => {
    if (!response.config.headers['x-no-loading']) {
      loadingCallbacks?.stop();
    }
    return response;
  },
  async (error) => {
    loadingCallbacks?.stop();
    const originalRequest = error.config;

    // If 401 and not already retrying, attempt silent refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        clearJWT();
        onJWTExpired?.();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${apiUrl}/auth/refresh`, {
          refreshToken,
        });

        const { access_token, refreshToken: newRefreshToken } = response.data;
        storeJWT(access_token, newRefreshToken);

        isRefreshing = false;
        onRefreshed(access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        clearJWT();
        onJWTExpired?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
