/**
 * SSO Module Configuration
 * Reads all SSO settings from environment variables
 */

import type { SSOConfig, SSOProviderName } from './sso.types';

const parseProviders = (value: string): SSOProviderName[] => {
  if (!value) return [];
  return value.split(',').map(p => p.trim().toLowerCase()) as SSOProviderName[];
};

const parseClaims = (value: string): string[] => {
  if (!value) return ['email', 'name', 'sub'];
  return value.split(',').map(c => c.trim());
};

export const ssoConfig: SSOConfig = {
  enabled: import.meta.env.VITE_SSO_ENABLED === 'true',
  authority: import.meta.env.VITE_SSO_OIDC_AUTHORITY || '',
  clientId: import.meta.env.VITE_SSO_OIDC_CLIENT_ID || '',
  redirectUri: import.meta.env.VITE_SSO_OIDC_REDIRECT_URI || `${window.location.origin}/auth/sso/callback`,
  postLogoutRedirectUri: import.meta.env.VITE_SSO_OIDC_POST_LOGOUT_REDIRECT_URI || `${window.location.origin}/auth`,
  scope: import.meta.env.VITE_SSO_OIDC_SCOPE || 'openid profile email',
  responseType: import.meta.env.VITE_SSO_OIDC_RESPONSE_TYPE || 'code',
  tokenExpirySeconds: parseInt(import.meta.env.VITE_SSO_TOKEN_EXPIRY_SECONDS || '3600', 10),
  tokenRenewThresholdSeconds: parseInt(import.meta.env.VITE_SSO_TOKEN_RENEW_THRESHOLD_SECONDS || '300', 10),
  silentRenew: import.meta.env.VITE_SSO_SILENT_RENEW === 'true',
  providers: parseProviders(import.meta.env.VITE_SSO_PROVIDERS || ''),
  userClaims: parseClaims(import.meta.env.VITE_SSO_USER_CLAIMS || ''),
};

/**
 * Check if SSO is properly configured
 */
export const isSSOConfigValid = (): boolean => {
  if (!ssoConfig.enabled) return false;
  return !!(ssoConfig.clientId && ssoConfig.redirectUri && ssoConfig.providers.length > 0);
};
