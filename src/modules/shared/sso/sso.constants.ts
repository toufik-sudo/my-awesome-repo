/**
 * SSO Module Constants
 */

export const SSO_STORAGE_KEYS = {
  SSO_STATE: 'sso_state',
  SSO_NONCE: 'sso_nonce',
  SSO_CODE_VERIFIER: 'sso_code_verifier',
  SSO_TOKENS: 'sso_tokens',
  SSO_USER: 'sso_user',
} as const;

export const SSO_ROUTES = {
  CALLBACK: '/auth/sso/callback',
  LOGOUT_CALLBACK: '/auth/sso/logout',
} as const;

export const SSO_EVENTS = {
  LOGIN_SUCCESS: 'sso:login:success',
  LOGIN_ERROR: 'sso:login:error',
  LOGOUT: 'sso:logout',
  TOKEN_RENEWED: 'sso:token:renewed',
  TOKEN_EXPIRED: 'sso:token:expired',
  SESSION_ENDED: 'sso:session:ended',
} as const;

export const SSO_PROVIDERS = {
  GOOGLE: 'google',
  MICROSOFT: 'microsoft',
  APPLE: 'apple',
  FACEBOOK: 'facebook',
  GITHUB: 'github',
} as const;

export const SSO_OIDC_ENDPOINTS = {
  GOOGLE: {
    authority: 'https://accounts.google.com',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userinfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
  },
  MICROSOFT: {
    authority: 'https://login.microsoftonline.com/common/v2.0',
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userinfoEndpoint: 'https://graph.microsoft.com/oidc/userinfo',
    jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
  },
  APPLE: {
    authority: 'https://appleid.apple.com',
    authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
    tokenEndpoint: 'https://appleid.apple.com/auth/token',
    userinfoEndpoint: '',
    jwksUri: 'https://appleid.apple.com/auth/keys',
  },
  FACEBOOK: {
    authority: 'https://www.facebook.com',
    authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userinfoEndpoint: 'https://graph.facebook.com/me?fields=id,name,email,picture',
    jwksUri: '',
  },
  GITHUB: {
    authority: 'https://github.com',
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    userinfoEndpoint: 'https://api.github.com/user',
    jwksUri: '',
  },
} as const;

export const SSO_ERROR_CODES = {
  INVALID_STATE: 'SSO_INVALID_STATE',
  TOKEN_EXCHANGE_FAILED: 'SSO_TOKEN_EXCHANGE_FAILED',
  USERINFO_FAILED: 'SSO_USERINFO_FAILED',
  PROVIDER_NOT_SUPPORTED: 'SSO_PROVIDER_NOT_SUPPORTED',
  CONFIG_MISSING: 'SSO_CONFIG_MISSING',
  PKCE_FAILED: 'SSO_PKCE_FAILED',
  SILENT_RENEW_FAILED: 'SSO_SILENT_RENEW_FAILED',
} as const;
