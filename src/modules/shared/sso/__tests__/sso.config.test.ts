import { describe, it, expect } from 'vitest';
import { ssoConfig } from '@/modules/shared/sso/sso.config';

describe('SSO Config', () => {
  it('should have the expected structure', () => {
    expect(ssoConfig).toBeDefined();
    expect(typeof ssoConfig.enabled).toBe('boolean');
    expect(typeof ssoConfig.authority).toBe('string');
    expect(typeof ssoConfig.clientId).toBe('string');
    expect(typeof ssoConfig.redirectUri).toBe('string');
    expect(typeof ssoConfig.scope).toBe('string');
    expect(typeof ssoConfig.responseType).toBe('string');
    expect(typeof ssoConfig.tokenExpirySeconds).toBe('number');
    expect(typeof ssoConfig.tokenRenewThresholdSeconds).toBe('number');
    expect(typeof ssoConfig.silentRenew).toBe('boolean');
    expect(Array.isArray(ssoConfig.providers)).toBe(true);
    expect(Array.isArray(ssoConfig.userClaims)).toBe(true);
  });

  it('should have valid default values', () => {
    expect(ssoConfig.responseType).toBe('code');
    expect(ssoConfig.tokenExpirySeconds).toBeGreaterThan(0);
    expect(ssoConfig.tokenRenewThresholdSeconds).toBeGreaterThan(0);
    expect(ssoConfig.scope).toContain('openid');
  });
});
