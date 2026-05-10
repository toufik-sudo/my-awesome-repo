/**
 * Mobile SSO Types — mirrors src/modules/shared/sso/sso.types.ts
 */

export type SSOProviderName =
  | 'google'
  | 'microsoft'
  | 'apple'
  | 'facebook'
  | 'github'
  | 'instagram'
  | 'tiktok';

export interface SSOConfig {
  enabled: boolean;
  providers: SSOProviderName[];
  redirectScheme: string;
  redirectPath: string;
  tokenExpirySeconds: number;
}

export interface SSOTokens {
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
  expiresAt: number;
  tokenType: string;
  scope?: string;
}

export interface SSOUserInfo {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
  roles?: string[];
  [key: string]: unknown;
}

export interface SSOCallbackResult {
  success: boolean;
  tokens?: SSOTokens;
  userInfo?: SSOUserInfo;
  error?: string;
  errorDescription?: string;
}

export interface SSOModuleInput {
  onLoginStart?: () => void;
  onLoginSuccess?: (userInfo: SSOUserInfo, tokens: SSOTokens) => void;
  onLoginError?: (error: string) => void;
  onLogout?: () => void;
}
