/**
 * Mobile SSO Configuration — read from Expo public env vars.
 *
 * Public envs use `EXPO_PUBLIC_*` so they're inlined at bundle time.
 */

import Constants from 'expo-constants';
import type { SSOConfig, SSOProviderName } from './sso.types';

const env = (process.env || {}) as Record<string, string | undefined>;

const parseProviders = (value: string | undefined): SSOProviderName[] => {
  if (!value) return [];
  return value.split(',').map(p => p.trim().toLowerCase()) as SSOProviderName[];
};

const scheme = (Constants.expoConfig?.scheme as string) || 'huggithub';

export const ssoConfig: SSOConfig = {
  enabled: env.EXPO_PUBLIC_SSO_ENABLED === 'true',
  providers: parseProviders(env.EXPO_PUBLIC_SSO_PROVIDERS),
  redirectScheme: scheme,
  redirectPath: env.EXPO_PUBLIC_SSO_REDIRECT_PATH || 'oauth-callback',
  tokenExpirySeconds: parseInt(env.EXPO_PUBLIC_SSO_TOKEN_EXPIRY_SECONDS || '3600', 10),
};

export const ssoProviderClientIds: Record<SSOProviderName, string> = {
  google: env.EXPO_PUBLIC_SSO_GOOGLE_CLIENT_ID || '',
  microsoft: env.EXPO_PUBLIC_SSO_MICROSOFT_CLIENT_ID || '',
  apple: env.EXPO_PUBLIC_SSO_APPLE_CLIENT_ID || '',
  facebook: env.EXPO_PUBLIC_SSO_FACEBOOK_CLIENT_ID || '',
  github: env.EXPO_PUBLIC_SSO_GITHUB_CLIENT_ID || '',
  instagram: env.EXPO_PUBLIC_SSO_INSTAGRAM_CLIENT_ID || '',
  tiktok: env.EXPO_PUBLIC_SSO_TIKTOK_CLIENT_ID || '',
};

export const ssoProviderScopes: Record<SSOProviderName, string> = {
  google: 'openid profile email',
  microsoft: 'openid profile email',
  apple: 'name email',
  facebook: 'public_profile email',
  github: 'read:user user:email',
  instagram: 'user_profile',
  tiktok: 'user.info.basic',
};

export const isSSOConfigValid = (): boolean => {
  if (!ssoConfig.enabled) return false;
  if (!ssoConfig.providers.length) return false;
  return ssoConfig.providers.some(p => !!ssoProviderClientIds[p]);
};
