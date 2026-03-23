/**
 * SSO Hook - Provides SSO module input/output interface
 * Reusable hook with configurable callbacks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ssoService } from './sso.service';
import { ssoConfig } from './sso.config';
import { SSO_EVENTS } from './sso.constants';
import type {
  SSOModuleInput,
  SSOModuleOutput,
  SSOProviderName,
  SSOTokens,
  SSOUserInfo,
} from './sso.types';

export const useSSO = (input?: SSOModuleInput): SSOModuleOutput => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<SSOUserInfo | null>(ssoService.getUserInfo());
  const [tokens, setTokens] = useState<SSOTokens | null>(ssoService.getTokens());
  const renewalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isEnabled = ssoService.isEnabled();
  const isAuthenticated = ssoService.isAuthenticated();

  // Setup silent token renewal
  useEffect(() => {
    if (!isEnabled || !ssoConfig.silentRenew || !isAuthenticated) return;

    renewalTimerRef.current = setInterval(async () => {
      if (ssoService.shouldRenewToken()) {
        const newTokens = await ssoService.renewToken();
        if (newTokens) {
          setTokens(newTokens);
          input?.onTokenRenewed?.(newTokens);
          window.dispatchEvent(new CustomEvent(SSO_EVENTS.TOKEN_RENEWED));
        } else {
          setUserInfo(null);
          setTokens(null);
          input?.onTokenExpired?.();
          window.dispatchEvent(new CustomEvent(SSO_EVENTS.TOKEN_EXPIRED));
        }
      }
    }, 30000); // Check every 30s

    return () => {
      if (renewalTimerRef.current) {
        clearInterval(renewalTimerRef.current);
      }
    };
  }, [isEnabled, isAuthenticated, input]);

  const login = useCallback(async (provider: SSOProviderName) => {
    setIsLoading(true);
    input?.onLoginStart?.();
    try {
      await ssoService.initiateLogin(provider);
    } catch (error: any) {
      setIsLoading(false);
      input?.onLoginError?.(error.message);
      window.dispatchEvent(
        new CustomEvent(SSO_EVENTS.LOGIN_ERROR, { detail: error.message })
      );
    }
  }, [input]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await ssoService.logout();
      setUserInfo(null);
      setTokens(null);
      input?.onLogout?.();
      window.dispatchEvent(new CustomEvent(SSO_EVENTS.LOGOUT));
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  const getAccessToken = useCallback((): string | null => {
    return ssoService.getAccessToken();
  }, []);

  const isTokenValid = useCallback((): boolean => {
    return ssoService.isTokenValid();
  }, []);

  const refreshToken = useCallback(async (): Promise<SSOTokens | null> => {
    const newTokens = await ssoService.renewToken();
    if (newTokens) {
      setTokens(newTokens);
    }
    return newTokens;
  }, []);

  return {
    isEnabled,
    isAuthenticated,
    isLoading,
    userInfo,
    tokens,
    providers: ssoService.getProviders(),
    login,
    logout,
    getAccessToken,
    isTokenValid,
    refreshToken,
  };
};
