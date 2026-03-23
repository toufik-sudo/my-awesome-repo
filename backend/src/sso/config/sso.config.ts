import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';

export interface SSOConfigType {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  authority: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  scope: string;
  responseType: string;
  tokenExpirySeconds: number;
  providers: string[];
  userClaims: string[];
}

export default registerAs('sso', (): SSOConfigType => ({
  enabled: process.env.SSO_ENABLED === 'true',
  clientId: process.env.SSO_OIDC_CLIENT_ID || '',
  clientSecret: process.env.SSO_OIDC_CLIENT_SECRET || '',
  authority: process.env.SSO_OIDC_AUTHORITY || '',
  redirectUri: process.env.SSO_OIDC_REDIRECT_URI || '',
  postLogoutRedirectUri: process.env.SSO_OIDC_POST_LOGOUT_REDIRECT_URI || '',
  scope: process.env.SSO_OIDC_SCOPE || 'openid profile email',
  responseType: process.env.SSO_OIDC_RESPONSE_TYPE || 'code',
  tokenExpirySeconds: parseInt(process.env.SSO_TOKEN_EXPIRY_SECONDS || '3600', 10),
  providers: (process.env.SSO_PROVIDERS || '').split(',').map(p => p.trim().toLowerCase()).filter(Boolean),
  userClaims: (process.env.SSO_USER_CLAIMS || 'email,name,sub').split(',').map(c => c.trim()).filter(Boolean),
}));
