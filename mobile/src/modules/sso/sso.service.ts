/**
 * Mobile SSO Service — OIDC Authorization Code + PKCE via expo-auth-session.
 *
 * Mirrors the web flow in src/modules/shared/sso/sso.service.ts:
 *  - Performs PKCE locally
 *  - Sends the auth code to the backend `/auth/sso/token` for exchange
 *  - Backend returns the platform JWT (access_token + refreshToken)
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/lib/axios';
import { AUTH_API, STORAGE_KEYS } from '@/constants/api.constants';
import {
  ssoConfig,
  ssoProviderClientIds,
  ssoProviderScopes,
  isSSOConfigValid,
} from './sso.config';
import {
  SSO_OIDC_ENDPOINTS,
  SSO_STORAGE_KEYS,
  SSO_ERROR_CODES,
} from './sso.constants';
import type {
  SSOProviderName,
  SSOTokens,
  SSOUserInfo,
  SSOCallbackResult,
} from './sso.types';

WebBrowser.maybeCompleteAuthSession();

const getEndpoints = (provider: SSOProviderName) => {
  const key = provider.toUpperCase() as keyof typeof SSO_OIDC_ENDPOINTS;
  const endpoints = SSO_OIDC_ENDPOINTS[key];
  if (!endpoints) {
    throw new Error(`${SSO_ERROR_CODES.PROVIDER_NOT_SUPPORTED}: ${provider}`);
  }
  return endpoints;
};

const buildRedirectUri = (): string =>
  AuthSession.makeRedirectUri({
    scheme: ssoConfig.redirectScheme,
    path: ssoConfig.redirectPath,
  });

const storeTokens = async (tokens: SSOTokens) => {
  await SecureStore.setItemAsync(SSO_STORAGE_KEYS.SSO_TOKENS, JSON.stringify(tokens));
};

const getStoredTokens = async (): Promise<SSOTokens | null> => {
  const raw = await SecureStore.getItemAsync(SSO_STORAGE_KEYS.SSO_TOKENS);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SSOTokens;
  } catch {
    return null;
  }
};

const storeUserInfo = async (info: SSOUserInfo) => {
  await SecureStore.setItemAsync(SSO_STORAGE_KEYS.SSO_USER, JSON.stringify(info));
};

const getStoredUserInfo = async (): Promise<SSOUserInfo | null> => {
  const raw = await SecureStore.getItemAsync(SSO_STORAGE_KEYS.SSO_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SSOUserInfo;
  } catch {
    return null;
  }
};

const clearSSOStorage = async () => {
  await SecureStore.deleteItemAsync(SSO_STORAGE_KEYS.SSO_TOKENS);
  await SecureStore.deleteItemAsync(SSO_STORAGE_KEYS.SSO_USER);
};

const mapClaimsToUserInfo = (claims: Record<string, any>): SSOUserInfo => ({
  sub: claims.sub || claims.id || '',
  email: claims.email,
  name: claims.name || claims.given_name,
  picture: claims.picture,
  emailVerified: claims.email_verified,
  roles: claims.roles || claims.groups,
});

export const ssoService = {
  isEnabled(): boolean {
    return ssoConfig.enabled && isSSOConfigValid();
  },

  getProviders(): SSOProviderName[] {
    return ssoConfig.providers.filter(p => !!ssoProviderClientIds[p]);
  },

  getRedirectUri(): string {
    return buildRedirectUri();
  },

  /**
   * Run the full PKCE flow inside an in-app browser.
   * Returns the SSO callback result; on success the platform JWT
   * issued by the backend is also written to SecureStore so the
   * existing axios interceptor picks it up automatically.
   */
  async login(provider: SSOProviderName): Promise<SSOCallbackResult> {
    if (!this.isEnabled()) {
      return { success: false, error: SSO_ERROR_CODES.CONFIG_MISSING };
    }
    const clientId = ssoProviderClientIds[provider];
    if (!clientId) {
      return { success: false, error: SSO_ERROR_CODES.CONFIG_MISSING };
    }

    const endpoints = getEndpoints(provider);
    const redirectUri = buildRedirectUri();
    const scopes = (ssoProviderScopes[provider] || 'openid profile email').split(' ');

    const extraParams: Record<string, string> = {};
    if (provider === 'google') {
      extraParams.access_type = 'offline';
      extraParams.prompt = 'consent';
    } else if (provider === 'apple') {
      extraParams.response_mode = 'form_post';
    } else if (provider === 'facebook') {
      extraParams.auth_type = 'rerequest';
    }

    const request = new AuthSession.AuthRequest({
      clientId,
      scopes,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: provider !== 'instagram',
      extraParams,
    });

    try {
      const result = await request.promptAsync({
        authorizationEndpoint: endpoints.authorizationEndpoint,
      });

      if (result.type === 'cancel' || result.type === 'dismiss') {
        return { success: false, error: SSO_ERROR_CODES.USER_CANCELLED };
      }
      if (result.type !== 'success' || !result.params.code) {
        return {
          success: false,
          error: SSO_ERROR_CODES.INVALID_STATE,
          errorDescription: (result as any).params?.error_description,
        };
      }

      // Exchange the code via our backend (same endpoint as web).
      const tokenResponse = await api.post<{
        access_token: string;
        id_token?: string;
        refresh_token?: string;
        expires_in?: number;
        token_type?: string;
        scope?: string;
        // Platform JWT issued after social login
        platform_access_token?: string;
        platform_refresh_token?: string;
        user?: Record<string, any>;
      }>(`${AUTH_API.SOCIAL(provider)}`, {
        code: result.params.code,
        codeVerifier: request.codeVerifier,
        redirectUri,
        provider,
      });

      const data = tokenResponse.data;
      const expiresIn = data.expires_in || ssoConfig.tokenExpirySeconds;

      const tokens: SSOTokens = {
        accessToken: data.access_token,
        idToken: data.id_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + expiresIn * 1000,
        tokenType: data.token_type || 'Bearer',
        scope: data.scope,
      };
      await storeTokens(tokens);

      // Persist platform JWT so the axios interceptor authenticates
      // subsequent calls (mirrors password login behaviour).
      if (data.platform_access_token) {
        await SecureStore.setItemAsync(STORAGE_KEYS.JWT_TOKEN, data.platform_access_token);
      }
      if (data.platform_refresh_token) {
        await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, data.platform_refresh_token);
      }

      const userInfo = mapClaimsToUserInfo(data.user || {});
      if (userInfo.sub) await storeUserInfo(userInfo);

      return { success: true, tokens, userInfo };
    } catch (error: any) {
      await clearSSOStorage();
      return {
        success: false,
        error: SSO_ERROR_CODES.TOKEN_EXCHANGE_FAILED,
        errorDescription: error?.response?.data?.message || error?.message,
      };
    }
  },

  async logout(): Promise<void> {
    const tokens = await getStoredTokens();
    await clearSSOStorage();
    try {
      await api.post(`${AUTH_API.LOGOUT}`, { idToken: tokens?.idToken });
    } catch {
      // best effort
    }
  },

  async getAccessToken(): Promise<string | null> {
    const tokens = await getStoredTokens();
    if (!tokens) return null;
    if (Date.now() >= tokens.expiresAt) return null;
    return tokens.accessToken;
  },

  async getUserInfo(): Promise<SSOUserInfo | null> {
    return getStoredUserInfo();
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    const info = await getStoredUserInfo();
    return !!token && !!info;
  },
};
