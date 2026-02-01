// -----------------------------------------------------------------------------
// API Utilities
// Migrated from old_app/src/utils/api.ts
// -----------------------------------------------------------------------------

/**
 * Trims a suffix from a URL
 */
export const trimUrl = (url: string, suffix: string): string => {
  if (url.endsWith(suffix)) {
    return url.slice(0, -suffix.length);
  }
  return url;
};

/**
 * Builds query string from params object
 */
export const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

/**
 * Joins URL parts with proper slashes
 */
export const joinUrl = (...parts: string[]): string => {
  return parts
    .map((part, index) => {
      if (index === 0) {
        return part.replace(/\/$/, '');
      }
      return part.replace(/^\//, '').replace(/\/$/, '');
    })
    .join('/');
};

/**
 * Extract error code from API response
 */
export const extractErrorCode = (response: unknown): string | null => {
  if (!response || typeof response !== 'object') {
    return null;
  }
  
  const resp = response as { data?: { code?: string; errorCode?: string; message?: string } };
  
  return resp.data?.code || resp.data?.errorCode || resp.data?.message || null;
};

/**
 * Extract error message from API response
 */
export const extractErrorMessage = (response: unknown): string | null => {
  if (!response || typeof response !== 'object') {
    return null;
  }
  
  const resp = response as { data?: { message?: string; error?: string } };
  
  return resp.data?.message || resp.data?.error || null;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }
  
  const err = error as { message?: string; code?: string };
  
  return err.message === 'Network Error' || err.code === 'NETWORK_ERROR';
};

/**
 * Format API error for display
 */
export const formatApiError = (error: unknown, defaultMessage = 'An error occurred'): string => {
  const message = extractErrorMessage(error);
  return message || defaultMessage;
};

/**
 * Check if response is a 404 Not Found error
 */
export const isNotFound = (response: unknown): boolean => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  const resp = response as { status?: number };
  return resp.status === 404;
};

/**
 * Check if response is a 403 Forbidden error
 */
export const isForbidden = (response: unknown): boolean => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  const resp = response as { status?: number };
  return resp.status === 403;
};
