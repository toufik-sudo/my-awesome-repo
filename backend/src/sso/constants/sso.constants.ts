/**
 * SSO Module Constants
 */

// SSO Status Messages
export const SSO_TOKEN_EXCHANGE_OK = 'SSO_TOKEN_EXCHANGE_OK';
export const SSO_TOKEN_EXCHANGE_KO = 'SSO_TOKEN_EXCHANGE_KO';
export const SSO_TOKEN_REFRESH_OK = 'SSO_TOKEN_REFRESH_OK';
export const SSO_TOKEN_REFRESH_KO = 'SSO_TOKEN_REFRESH_KO';
export const SSO_USERINFO_OK = 'SSO_USERINFO_OK';
export const SSO_USERINFO_KO = 'SSO_USERINFO_KO';
export const SSO_LOGOUT_OK = 'SSO_LOGOUT_OK';
export const SSO_LOGOUT_KO = 'SSO_LOGOUT_KO';

// SSO Error Messages
export const SSO_DISABLED = 'SSO_DISABLED';
export const SSO_PROVIDER_NOT_SUPPORTED = 'SSO_PROVIDER_NOT_SUPPORTED';
export const SSO_CODE_MISSING = 'SSO_CODE_MISSING';
export const SSO_CODE_VERIFIER_MISSING = 'SSO_CODE_VERIFIER_MISSING';
export const SSO_REFRESH_TOKEN_MISSING = 'SSO_REFRESH_TOKEN_MISSING';
export const SSO_INVALID_TOKEN = 'SSO_INVALID_TOKEN';
export const SSO_CONFIG_MISSING = 'SSO_CONFIG_MISSING';

// SSO Exception Codes
export const SSO_TOKEN_EXCHANGE_KO_CODE = 6000;
export const SSO_TOKEN_REFRESH_KO_CODE = 6100;
export const SSO_USERINFO_KO_CODE = 6200;
export const SSO_PROVIDER_NOT_SUPPORTED_CODE = 6300;
export const SSO_DISABLED_CODE = 6400;

// SSO Provider Endpoints
export const SSO_PROVIDER_ENDPOINTS: Record<
  string,
  { tokenEndpoint: string; userinfoEndpoint: string; revokeEndpoint?: string }
> = {
  GOOGLE: {
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userinfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
    revokeEndpoint: 'https://oauth2.googleapis.com/revoke',
  },
  MICROSOFT: {
    tokenEndpoint:
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userinfoEndpoint: 'https://graph.microsoft.com/oidc/userinfo',
    revokeEndpoint: undefined,
  },
  APPLE: {
    tokenEndpoint: 'https://appleid.apple.com/auth/token',
    userinfoEndpoint: 'https://appleid.apple.com/auth/userinfo',
    revokeEndpoint: 'https://appleid.apple.com/auth/revoke',
  },
  FACEBOOK: {
    tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userinfoEndpoint: 'https://graph.facebook.com/me?fields=id,name,email,picture',
    revokeEndpoint: undefined,
  },
  GITHUB: {
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    userinfoEndpoint: 'https://api.github.com/user',
    revokeEndpoint: undefined,
  },
};
