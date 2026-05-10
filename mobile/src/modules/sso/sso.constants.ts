/**
 * Mobile SSO Constants — mirrors src/modules/shared/sso/sso.constants.ts
 */

export const SSO_STORAGE_KEYS = {
  SSO_STATE: 'sso_state',
  SSO_TOKENS: 'sso_tokens',
  SSO_USER: 'sso_user',
} as const;

export const SSO_EVENTS = {
  LOGIN_SUCCESS: 'sso:login:success',
  LOGIN_ERROR: 'sso:login:error',
  LOGOUT: 'sso:logout',
} as const;

export const SSO_OIDC_ENDPOINTS = {
  GOOGLE: {
    authority: 'https://accounts.google.com',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userinfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
  },
  MICROSOFT: {
    authority: 'https://login.microsoftonline.com/common/v2.0',
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userinfoEndpoint: 'https://graph.microsoft.com/oidc/userinfo',
  },
  APPLE: {
    authority: 'https://appleid.apple.com',
    authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
    tokenEndpoint: 'https://appleid.apple.com/auth/token',
    userinfoEndpoint: '',
  },
  FACEBOOK: {
    authority: 'https://www.facebook.com',
    authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userinfoEndpoint: 'https://graph.facebook.com/me?fields=id,name,email,picture',
  },
  GITHUB: {
    authority: 'https://github.com',
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    userinfoEndpoint: 'https://api.github.com/user',
  },
  INSTAGRAM: {
    authority: 'https://api.instagram.com',
    authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
    tokenEndpoint: 'https://api.instagram.com/oauth/access_token',
    userinfoEndpoint: 'https://graph.instagram.com/me?fields=id,username,account_type',
  },
  TIKTOK: {
    authority: 'https://www.tiktok.com',
    authorizationEndpoint: 'https://www.tiktok.com/v2/auth/authorize/',
    tokenEndpoint: 'https://open.tiktokapis.com/v2/oauth/token/',
    userinfoEndpoint: 'https://open.tiktokapis.com/v2/user/info/',
  },
} as const;

export const SSO_ERROR_CODES = {
  INVALID_STATE: 'SSO_INVALID_STATE',
  TOKEN_EXCHANGE_FAILED: 'SSO_TOKEN_EXCHANGE_FAILED',
  PROVIDER_NOT_SUPPORTED: 'SSO_PROVIDER_NOT_SUPPORTED',
  CONFIG_MISSING: 'SSO_CONFIG_MISSING',
  USER_CANCELLED: 'SSO_USER_CANCELLED',
} as const;
