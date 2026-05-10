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
 * Per-provider client IDs and scope overrides.
 * Falls back to the shared VITE_SSO_OIDC_CLIENT_ID/SCOPE when an entry is missing.
 */
export const ssoProviderClientIds: Record<SSOProviderName, string> = {
  google: import.meta.env.VITE_SSO_GOOGLE_CLIENT_ID || ssoConfig.clientId,
  microsoft: import.meta.env.VITE_SSO_MICROSOFT_CLIENT_ID || ssoConfig.clientId,
  apple: import.meta.env.VITE_SSO_APPLE_CLIENT_ID || ssoConfig.clientId,
  facebook: import.meta.env.VITE_SSO_FACEBOOK_CLIENT_ID || ssoConfig.clientId,
  github: import.meta.env.VITE_SSO_GITHUB_CLIENT_ID || ssoConfig.clientId,
  instagram: import.meta.env.VITE_SSO_INSTAGRAM_CLIENT_ID || ssoConfig.clientId,
  tiktok: import.meta.env.VITE_SSO_TIKTOK_CLIENT_ID || ssoConfig.clientId,
};

export const ssoProviderScopes: Partial<Record<SSOProviderName, string>> = {
  google: 'openid profile email',
  microsoft: 'openid profile email',
  apple: 'name email',
  facebook: 'public_profile email',
  github: 'read:user user:email',
  instagram: 'user_profile',
  tiktok: 'user.info.basic',
};

/**
 * Check if SSO is properly configured
 */
/**
 * Check if SSO is properly configured (any provider with a client id)
 */
export const isSSOConfigValid = (): boolean => {
  if (!ssoConfig.enabled) return false;
  if (!ssoConfig.providers.length) return false;
  return ssoConfig.providers.some(p => !!ssoProviderClientIds[p]);
};
