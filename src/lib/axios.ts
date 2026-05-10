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

// ─── RBAC Pre-flight Cache ─────────────────────────────────────────────────────
/**
 * Cached backend permissions for pre-flight checks.
 * Set by usePermissions hook after loading RBAC config.
 * Structure: { backendPermKey: { allowed, scope } }
 */
let cachedBackendPerms: Record<string, { allowed: boolean; scope: string }> = {};
let cachedBindingMap: Record<string, Array<{ backendKey: string; roles: string[] }>> = {};
let cachedUserRole: string = '';

/** Called by usePermissions to inject RBAC caches into axios */
export const setRbacCache = (
  backendPerms: Record<string, { allowed: boolean; scope: string }>,
  bindingMap: Record<string, Array<{ backendKey: string; roles: string[] }>>,
  role: string,
) => {
  cachedBackendPerms = backendPerms;
  cachedBindingMap = bindingMap;
  cachedUserRole = role;
};

/**
 * Pre-flight RBAC check: reads `_frontendApiKey` from the request config
 * and checks the cached binding map to see if the current role is allowed.
 * Returns false (block) if the role is explicitly denied.
 */
const checkRbacPreflight = (config: any): boolean => {
  const frontendApiKey: string | undefined = config?._frontendApiKey;
  if (!frontendApiKey || !cachedUserRole) return true;
  if (Object.keys(cachedBindingMap).length === 0) return true;

  const bindings = cachedBindingMap[frontendApiKey];
  if (!bindings || bindings.length === 0) return true; // No binding → allow

  // Every binding must include the current role
  const allowed = bindings.every(b => b.roles.includes(cachedUserRole));
  if (!allowed) {
    console.warn(`[RBAC pre-flight] Blocked: ${frontendApiKey} for role "${cachedUserRole}"`);
  }
  return allowed;
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

    // RBAC pre-flight check (advisory — backend is authoritative)
    if (!checkRbacPreflight(config)) {
      loadingCallbacks?.stop();
      return Promise.reject(new axios.Cancel('RBAC pre-flight: permission denied'));
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
