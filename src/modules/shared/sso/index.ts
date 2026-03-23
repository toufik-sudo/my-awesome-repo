/**
 * SSO Module - Public API
 * 
 * Usage:
 *   import { useSSO, SSOLoginButtons, ssoConfig, ssoService } from '@/modules/shared/sso';
 * 
 * Input/Output pattern:
 *   const sso = useSSO({
 *     onLoginSuccess: (userInfo, tokens) => { ... },
 *     onLoginError: (error) => { ... },
 *     onLogout: () => { ... },
 *     onTokenRenewed: (tokens) => { ... },
 *     onTokenExpired: () => { ... },
 *     mapUserInfo: (claims) => ({ ...customMapping }),
 *   });
 * 
 *   sso.login('google');
 *   sso.logout();
 *   sso.getAccessToken();
 *   sso.isAuthenticated;
 *   sso.userInfo;
 */

// Config
export { ssoConfig, isSSOConfigValid } from './sso.config';

// Service
export { ssoService } from './sso.service';

// Hook
export { useSSO } from './useSSO';

// Components
export { SSOLoginButtons } from './SSOLoginButtons';
export { default as SSOCallback } from './SSOCallback';

// Types
export type {
  SSOConfig,
  SSOProviderName,
  SSOProviderConfig,
  SSOTokens,
  SSOUserInfo,
  SSOAuthState,
  SSOCallbackResult,
  SSOModuleInput,
  SSOModuleOutput,
} from './sso.types';

// Constants
export {
  SSO_STORAGE_KEYS,
  SSO_ROUTES,
  SSO_EVENTS,
  SSO_PROVIDERS,
  SSO_OIDC_ENDPOINTS,
  SSO_ERROR_CODES,
} from './sso.constants';
