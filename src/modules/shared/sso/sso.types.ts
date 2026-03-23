/**
 * SSO Module Types
 */

export interface SSOConfig {
  enabled: boolean;
  authority: string;
  clientId: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  scope: string;
  responseType: string;
  tokenExpirySeconds: number;
  tokenRenewThresholdSeconds: number;
  silentRenew: boolean;
  providers: SSOProviderName[];
  userClaims: string[];
}

export type SSOProviderName = 'google' | 'microsoft' | 'apple' | 'facebook' | 'github';

export interface SSOProviderConfig {
  name: SSOProviderName;
  authority: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userinfoEndpoint: string;
  jwksUri: string;
  clientId?: string;
  scope?: string;
  additionalParams?: Record<string, string>;
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
  phoneNbr?: string;
  roles?: string[];
  picture?: string;
  emailVerified?: boolean;
  [key: string]: unknown;
}

export interface SSOAuthState {
  state: string;
  nonce: string;
  codeVerifier: string;
  provider: SSOProviderName;
  redirectUri: string;
  timestamp: number;
}

export interface SSOCallbackResult {
  success: boolean;
  tokens?: SSOTokens;
  userInfo?: SSOUserInfo;
  error?: string;
  errorDescription?: string;
}

/**
 * SSO Module Input/Output interfaces for reusability
 */
export interface SSOModuleInput {
  /** Called when SSO login is initiated */
  onLoginStart?: () => void;
  /** Called when SSO login succeeds */
  onLoginSuccess?: (userInfo: SSOUserInfo, tokens: SSOTokens) => void;
  /** Called when SSO login fails */
  onLoginError?: (error: string) => void;
  /** Called when SSO logout completes */
  onLogout?: () => void;
  /** Called when token is silently renewed */
  onTokenRenewed?: (tokens: SSOTokens) => void;
  /** Called when token renewal fails */
  onTokenExpired?: () => void;
  /** Custom user info mapper */
  mapUserInfo?: (claims: Record<string, unknown>) => SSOUserInfo;
}

export interface SSOModuleOutput {
  /** Whether SSO is enabled */
  isEnabled: boolean;
  /** Whether user is authenticated via SSO */
  isAuthenticated: boolean;
  /** Whether SSO operation is in progress */
  isLoading: boolean;
  /** Current SSO user info */
  userInfo: SSOUserInfo | null;
  /** Current SSO tokens */
  tokens: SSOTokens | null;
  /** Available SSO providers */
  providers: SSOProviderName[];
  /** Initiate SSO login with a provider */
  login: (provider: SSOProviderName) => Promise<void>;
  /** Logout from SSO */
  logout: () => Promise<void>;
  /** Get current access token */
  getAccessToken: () => string | null;
  /** Check if tokens are still valid */
  isTokenValid: () => boolean;
  /** Force token refresh */
  refreshToken: () => Promise<SSOTokens | null>;
}
