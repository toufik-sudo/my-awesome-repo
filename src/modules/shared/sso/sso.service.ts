/**
 * SSO Service - Core authentication logic
 * Handles OIDC authorization code flow with PKCE
 */

import { api } from '@/lib/axios';
import { API_BASE } from '@/constants/api.constants';
import { ssoConfig, isSSOConfigValid } from './sso.config';
import { SSO_OIDC_ENDPOINTS, SSO_STORAGE_KEYS, SSO_ERROR_CODES } from './sso.constants';
import type {
  SSOTokens,
  SSOUserInfo,
  SSOAuthState,
  SSOCallbackResult,
  SSOProviderName,
  SSOProviderConfig,
} from './sso.types';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateNonce,
  generateState,
  buildAuthorizationUrl,
  parseQueryString,
} from './sso.utils';

/**
 * Get provider-specific configuration
 */
const getProviderConfig = (provider: SSOProviderName): SSOProviderConfig => {
  const key = provider.toUpperCase() as keyof typeof SSO_OIDC_ENDPOINTS;
  const endpoints = SSO_OIDC_ENDPOINTS[key];

  if (!endpoints) {
    throw new Error(`${SSO_ERROR_CODES.PROVIDER_NOT_SUPPORTED}: ${provider}`);
  }

  return {
    name: provider,
    ...endpoints,
    clientId: ssoConfig.clientId,
    scope: ssoConfig.scope,
  };
};

/**
 * Store auth state for callback verification
 */
const storeAuthState = (authState: SSOAuthState): void => {
  sessionStorage.setItem(SSO_STORAGE_KEYS.SSO_STATE, JSON.stringify(authState));
};

/**
 * Retrieve and clear stored auth state
 */
const retrieveAuthState = (): SSOAuthState | null => {
  const stored = sessionStorage.getItem(SSO_STORAGE_KEYS.SSO_STATE);
  if (!stored) return null;

  try {
    const authState: SSOAuthState = JSON.parse(stored);
    // Validate timestamp (10 min expiry)
    if (Date.now() - authState.timestamp > 10 * 60 * 1000) {
      sessionStorage.removeItem(SSO_STORAGE_KEYS.SSO_STATE);
      return null;
    }
    return authState;
  } catch {
    sessionStorage.removeItem(SSO_STORAGE_KEYS.SSO_STATE);
    return null;
  }
};

/**
 * Store SSO tokens
 */
const storeTokens = (tokens: SSOTokens): void => {
  localStorage.setItem(SSO_STORAGE_KEYS.SSO_TOKENS, JSON.stringify(tokens));
};

/**
 * Get stored SSO tokens
 */
const getStoredTokens = (): SSOTokens | null => {
  const stored = localStorage.getItem(SSO_STORAGE_KEYS.SSO_TOKENS);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * Store SSO user info
 */
const storeUserInfo = (userInfo: SSOUserInfo): void => {
  localStorage.setItem(SSO_STORAGE_KEYS.SSO_USER, JSON.stringify(userInfo));
};

/**
 * Get stored SSO user info
 */
const getStoredUserInfo = (): SSOUserInfo | null => {
  const stored = localStorage.getItem(SSO_STORAGE_KEYS.SSO_USER);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * Clear all SSO storage
 */
const clearSSOStorage = (): void => {
  localStorage.removeItem(SSO_STORAGE_KEYS.SSO_TOKENS);
  localStorage.removeItem(SSO_STORAGE_KEYS.SSO_USER);
  sessionStorage.removeItem(SSO_STORAGE_KEYS.SSO_STATE);
  sessionStorage.removeItem(SSO_STORAGE_KEYS.SSO_NONCE);
  sessionStorage.removeItem(SSO_STORAGE_KEYS.SSO_CODE_VERIFIER);
};

/**
 * Map OIDC claims to app user info
 */
const mapClaimsToUserInfo = (
  claims: Record<string, unknown>,
  customMapper?: (claims: Record<string, unknown>) => SSOUserInfo
): SSOUserInfo => {
  if (customMapper) {
    return customMapper(claims);
  }

  return {
    sub: (claims.sub as string) || '',
    email: (claims.email as string) || undefined,
    name: (claims.name as string) || (claims.given_name as string) || undefined,
    phoneNbr: (claims.phone_number as string) || undefined,
    roles: (claims.roles as string[]) || (claims.groups as string[]) || undefined,
    picture: (claims.picture as string) || undefined,
    emailVerified: (claims.email_verified as boolean) || undefined,
  };
};

export const ssoService = {
  /**
   * Check if SSO is enabled and properly configured
   */
  isEnabled(): boolean {
    return ssoConfig.enabled && isSSOConfigValid();
  },

  /**
   * Get list of available SSO providers
   */
  getProviders(): SSOProviderName[] {
    return ssoConfig.providers;
  },

  /**
   * Initiate SSO login flow with PKCE
   */
  async initiateLogin(provider: SSOProviderName): Promise<void> {
    if (!this.isEnabled()) {
      throw new Error(SSO_ERROR_CODES.CONFIG_MISSING);
    }

    const providerConfig = getProviderConfig(provider);
    const state = generateState();
    const nonce = generateNonce();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store auth state for callback verification
    const authState: SSOAuthState = {
      state,
      nonce,
      codeVerifier,
      provider,
      redirectUri: ssoConfig.redirectUri,
      timestamp: Date.now(),
    };
    storeAuthState(authState);

    // Build authorization URL
    const params: Record<string, string> = {
      client_id: providerConfig.clientId || ssoConfig.clientId,
      redirect_uri: ssoConfig.redirectUri,
      response_type: ssoConfig.responseType,
      scope: providerConfig.scope || ssoConfig.scope,
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    };

    // Provider-specific params
    if (provider === 'google') {
      params.access_type = 'offline';
      params.prompt = 'consent';
    }

    const authUrl = buildAuthorizationUrl(
      providerConfig.authorizationEndpoint,
      params
    );

    // Redirect to provider
    window.location.href = authUrl;
  },

  /**
   * Handle the SSO callback after provider redirect
   */
  async handleCallback(
    customMapper?: (claims: Record<string, unknown>) => SSOUserInfo
  ): Promise<SSOCallbackResult> {
    const params = parseQueryString(window.location.search);

    // Check for errors
    if (params.error) {
      clearSSOStorage();
      return {
        success: false,
        error: params.error,
        errorDescription: params.error_description || 'SSO authentication failed',
      };
    }

    const { code, state } = params;
    if (!code || !state) {
      clearSSOStorage();
      return {
        success: false,
        error: SSO_ERROR_CODES.INVALID_STATE,
        errorDescription: 'Missing authorization code or state parameter',
      };
    }

    // Verify state
    const storedAuthState = retrieveAuthState();
    if (!storedAuthState || storedAuthState.state !== state) {
      clearSSOStorage();
      return {
        success: false,
        error: SSO_ERROR_CODES.INVALID_STATE,
        errorDescription: 'State mismatch - possible CSRF attack',
      };
    }

    try {
      // Exchange code for tokens via backend
      const tokenResponse = await api.post<{
        access_token: string;
        id_token?: string;
        refresh_token?: string;
        expires_in?: number;
        token_type?: string;
        scope?: string;
      }>(`${API_BASE.API_AUTH}/sso/token`, {
        code,
        codeVerifier: storedAuthState.codeVerifier,
        redirectUri: ssoConfig.redirectUri,
        provider: storedAuthState.provider,
      });

      const tokenData = tokenResponse.data;
      const expiresIn = tokenData.expires_in || ssoConfig.tokenExpirySeconds;

      const tokens: SSOTokens = {
        accessToken: tokenData.access_token,
        idToken: tokenData.id_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: Date.now() + expiresIn * 1000,
        tokenType: tokenData.token_type || 'Bearer',
        scope: tokenData.scope,
      };

      storeTokens(tokens);

      // Fetch user info from backend (which validates and enriches)
      const userInfoResponse = await api.get<Record<string, unknown>>(
        `${API_BASE.API_AUTH}/sso/userinfo`,
        {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        }
      );

      const userInfo = mapClaimsToUserInfo(userInfoResponse.data, customMapper);
      storeUserInfo(userInfo);

      // Clear auth state
      sessionStorage.removeItem(SSO_STORAGE_KEYS.SSO_STATE);

      return { success: true, tokens, userInfo };
    } catch (error: any) {
      clearSSOStorage();
      return {
        success: false,
        error: SSO_ERROR_CODES.TOKEN_EXCHANGE_FAILED,
        errorDescription: error.message || 'Token exchange failed',
      };
    }
  },

  /**
   * Logout from SSO
   */
  async logout(): Promise<void> {
    const tokens = getStoredTokens();
    clearSSOStorage();

    // Notify backend
    try {
      await api.post(`${API_BASE.API_AUTH}/sso/logout`, {
        idToken: tokens?.idToken,
      });
    } catch {
      // Best effort logout
    }
  },

  /**
   * Get the current access token if valid
   */
  getAccessToken(): string | null {
    const tokens = getStoredTokens();
    if (!tokens) return null;
    if (Date.now() >= tokens.expiresAt) return null;
    return tokens.accessToken;
  },

  /**
   * Check if current tokens are still valid
   */
  isTokenValid(): boolean {
    const tokens = getStoredTokens();
    if (!tokens) return false;
    return Date.now() < tokens.expiresAt;
  },

  /**
   * Check if token should be renewed
   */
  shouldRenewToken(): boolean {
    const tokens = getStoredTokens();
    if (!tokens) return false;
    const timeToExpiry = (tokens.expiresAt - Date.now()) / 1000;
    return timeToExpiry <= ssoConfig.tokenRenewThresholdSeconds;
  },

  /**
   * Silently renew the token
   */
  async renewToken(): Promise<SSOTokens | null> {
    const tokens = getStoredTokens();
    if (!tokens?.refreshToken) return null;

    try {
      const response = await api.post<{
        access_token: string;
        id_token?: string;
        refresh_token?: string;
        expires_in?: number;
        token_type?: string;
      }>(`${API_BASE.API_AUTH}/sso/refresh`, {
        refreshToken: tokens.refreshToken,
      });

      const newTokens: SSOTokens = {
        accessToken: response.data.access_token,
        idToken: response.data.id_token || tokens.idToken,
        refreshToken: response.data.refresh_token || tokens.refreshToken,
        expiresAt: Date.now() + (response.data.expires_in || ssoConfig.tokenExpirySeconds) * 1000,
        tokenType: response.data.token_type || 'Bearer',
        scope: tokens.scope,
      };

      storeTokens(newTokens);
      return newTokens;
    } catch {
      clearSSOStorage();
      return null;
    }
  },

  /**
   * Get stored tokens
   */
  getTokens(): SSOTokens | null {
    return getStoredTokens();
  },

  /**
   * Get stored user info
   */
  getUserInfo(): SSOUserInfo | null {
    return getStoredUserInfo();
  },

  /**
   * Check if user is authenticated via SSO
   */
  isAuthenticated(): boolean {
    return this.isTokenValid() && !!this.getUserInfo();
  },
};
