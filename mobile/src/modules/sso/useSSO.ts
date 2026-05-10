/**
 * useSSO — React hook for the mobile SSO module.
 * Mirrors the public surface of src/modules/shared/sso/useSSO.ts.
 */

import { useCallback, useEffect, useState } from 'react';
import { ssoService } from './sso.service';
import { ssoConfig } from './sso.config';
import type {
  SSOModuleInput,
  SSOProviderName,
  SSOTokens,
  SSOUserInfo,
} from './sso.types';

export interface UseSSOOutput {
  isEnabled: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  providers: SSOProviderName[];
  userInfo: SSOUserInfo | null;
  tokens: SSOTokens | null;
  login: (provider: SSOProviderName) => Promise<void>;
  logout: () => Promise<void>;
}

export function useSSO(input?: SSOModuleInput): UseSSOOutput {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<SSOUserInfo | null>(null);
  const [tokens, setTokens] = useState<SSOTokens | null>(null);

  useEffect(() => {
    (async () => {
      const info = await ssoService.getUserInfo();
      const token = await ssoService.getAccessToken();
      setUserInfo(info);
      if (token && info) {
        setTokens({
          accessToken: token,
          expiresAt: 0,
          tokenType: 'Bearer',
        });
      }
    })();
  }, []);

  const login = useCallback(
    async (provider: SSOProviderName) => {
      setIsLoading(true);
      input?.onLoginStart?.();
      try {
        const result = await ssoService.login(provider);
        if (result.success && result.tokens && result.userInfo) {
          setTokens(result.tokens);
          setUserInfo(result.userInfo);
          input?.onLoginSuccess?.(result.userInfo, result.tokens);
        } else {
          input?.onLoginError?.(result.errorDescription || result.error || 'SSO login failed');
        }
      } catch (e: any) {
        input?.onLoginError?.(e?.message || 'SSO login failed');
      } finally {
        setIsLoading(false);
      }
    },
    [input],
  );

  const logout = useCallback(async () => {
    await ssoService.logout();
    setTokens(null);
    setUserInfo(null);
    input?.onLogout?.();
  }, [input]);

  return {
    isEnabled: ssoConfig.enabled && ssoService.isEnabled(),
    isLoading,
    isAuthenticated: !!userInfo && !!tokens,
    providers: ssoService.getProviders(),
    userInfo,
    tokens,
    login,
    logout,
  };
}
