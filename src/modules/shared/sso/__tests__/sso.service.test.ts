import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ssoService } from '@/modules/shared/sso/sso.service';

// Mock sso.config
vi.mock('@/modules/shared/sso/sso.config', () => ({
  ssoConfig: {
    enabled: true,
    authority: 'https://accounts.google.com',
    clientId: 'test-client-id',
    redirectUri: 'http://localhost:5173/auth/sso/callback',
    postLogoutRedirectUri: 'http://localhost:5173/auth',
    scope: 'openid profile email',
    responseType: 'code',
    tokenExpirySeconds: 3600,
    tokenRenewThresholdSeconds: 300,
    silentRenew: true,
    providers: ['google', 'microsoft'],
    userClaims: ['email', 'name', 'sub'],
  },
  isSSOConfigValid: () => true,
}));

describe('SSO Service', () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);

    // Mock localStorage & sessionStorage
    const storageMock = {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, val: string) => { mockStorage[key] = val; }),
      removeItem: vi.fn((key: string) => { delete mockStorage[key]; }),
      clear: vi.fn(() => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]); }),
    };

    vi.stubGlobal('localStorage', storageMock);
    vi.stubGlobal('sessionStorage', storageMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isEnabled', () => {
    it('should return true when SSO is configured', () => {
      expect(ssoService.isEnabled()).toBe(true);
    });
  });

  describe('getProviders', () => {
    it('should return the configured providers', () => {
      const providers = ssoService.getProviders();
      expect(providers).toContain('google');
      expect(providers).toContain('microsoft');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no tokens are stored', () => {
      expect(ssoService.isAuthenticated()).toBe(false);
    });
  });

  describe('getAccessToken', () => {
    it('should return null when no tokens exist', () => {
      expect(ssoService.getAccessToken()).toBeNull();
    });

    it('should return null when tokens are expired', () => {
      localStorage.setItem(
        'sso_tokens',
        JSON.stringify({
          accessToken: 'test-token',
          expiresAt: Date.now() - 1000,
          tokenType: 'Bearer',
        }),
      );
      expect(ssoService.getAccessToken()).toBeNull();
    });

    it('should return token when valid', () => {
      localStorage.setItem(
        'sso_tokens',
        JSON.stringify({
          accessToken: 'valid-test-token',
          expiresAt: Date.now() + 3600000,
          tokenType: 'Bearer',
        }),
      );
      expect(ssoService.getAccessToken()).toBe('valid-test-token');
    });
  });

  describe('isTokenValid', () => {
    it('should return false with no tokens', () => {
      expect(ssoService.isTokenValid()).toBe(false);
    });

    it('should return true with valid tokens', () => {
      localStorage.setItem(
        'sso_tokens',
        JSON.stringify({
          accessToken: 'token',
          expiresAt: Date.now() + 3600000,
          tokenType: 'Bearer',
        }),
      );
      expect(ssoService.isTokenValid()).toBe(true);
    });
  });

  describe('shouldRenewToken', () => {
    it('should return false with no tokens', () => {
      expect(ssoService.shouldRenewToken()).toBe(false);
    });

    it('should return true when token is about to expire', () => {
      localStorage.setItem(
        'sso_tokens',
        JSON.stringify({
          accessToken: 'token',
          expiresAt: Date.now() + 60000, // 1 minute left (below 300s threshold)
          tokenType: 'Bearer',
        }),
      );
      expect(ssoService.shouldRenewToken()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear all SSO storage', async () => {
      localStorage.setItem('sso_tokens', 'test');
      localStorage.setItem('sso_user', 'test');
      sessionStorage.setItem('sso_state', 'test');

      await ssoService.logout();

      expect(localStorage.getItem('sso_tokens')).toBeNull();
      expect(localStorage.getItem('sso_user')).toBeNull();
      expect(sessionStorage.getItem('sso_state')).toBeNull();
    });
  });
});
