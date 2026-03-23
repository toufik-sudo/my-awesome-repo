/**
 * SSO Utility functions
 * PKCE, state, nonce generation and crypto helpers
 */

/**
 * Generate a cryptographically random string
 */
export const generateRandomString = (length = 64): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(36).padStart(2, '0'))
    .join('')
    .substring(0, length);
};

/**
 * Generate PKCE code verifier
 */
export const generateCodeVerifier = (): string => {
  return generateRandomString(128);
};

/**
 * Generate PKCE code challenge from verifier (S256)
 */
export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Generate a nonce for OIDC
 */
export const generateNonce = (): string => {
  return generateRandomString(32);
};

/**
 * Generate a state parameter for OIDC
 */
export const generateState = (): string => {
  return generateRandomString(32);
};

/**
 * Parse URL hash fragment into key-value pairs
 */
export const parseHashFragment = (hash: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const fragment = hash.startsWith('#') ? hash.substring(1) : hash;
  const searchParams = new URLSearchParams(fragment);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

/**
 * Parse URL query string into key-value pairs
 */
export const parseQueryString = (search: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

/**
 * Build authorization URL with proper parameters
 */
export const buildAuthorizationUrl = (
  endpoint: string,
  params: Record<string, string>
): string => {
  const url = new URL(endpoint);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
};
