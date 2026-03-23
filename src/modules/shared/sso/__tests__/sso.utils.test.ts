import { describe, it, expect } from 'vitest';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  generateNonce,
  buildAuthorizationUrl,
  parseQueryString,
} from '@/modules/shared/sso/sso.utils';

describe('SSO Utils', () => {
  describe('generateCodeVerifier', () => {
    it('should generate a string of sufficient length', () => {
      const verifier = generateCodeVerifier();
      expect(verifier).toBeDefined();
      expect(typeof verifier).toBe('string');
      expect(verifier.length).toBeGreaterThanOrEqual(43);
    });

    it('should generate unique values each call', () => {
      const v1 = generateCodeVerifier();
      const v2 = generateCodeVerifier();
      expect(v1).not.toBe(v2);
    });
  });

  describe('generateCodeChallenge', () => {
    it('should produce a non-empty string from a verifier', async () => {
      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      expect(challenge).toBeDefined();
      expect(typeof challenge).toBe('string');
      expect(challenge.length).toBeGreaterThan(0);
    });

    it('should produce different challenges for different verifiers', async () => {
      const c1 = await generateCodeChallenge('verifier-one-test-123');
      const c2 = await generateCodeChallenge('verifier-two-test-456');
      expect(c1).not.toBe(c2);
    });
  });

  describe('generateState', () => {
    it('should generate a non-empty string', () => {
      const state = generateState();
      expect(state).toBeDefined();
      expect(state.length).toBeGreaterThan(0);
    });

    it('should be unique per call', () => {
      expect(generateState()).not.toBe(generateState());
    });
  });

  describe('generateNonce', () => {
    it('should generate a non-empty string', () => {
      const nonce = generateNonce();
      expect(nonce).toBeDefined();
      expect(nonce.length).toBeGreaterThan(0);
    });
  });

  describe('buildAuthorizationUrl', () => {
    it('should construct a valid URL with query params', () => {
      const url = buildAuthorizationUrl('https://auth.example.com/authorize', {
        client_id: 'test-client',
        redirect_uri: 'https://app.example.com/callback',
        response_type: 'code',
        scope: 'openid profile',
      });

      expect(url).toContain('https://auth.example.com/authorize');
      expect(url).toContain('client_id=test-client');
      expect(url).toContain('redirect_uri=');
      expect(url).toContain('response_type=code');
      expect(url).toContain('scope=openid+profile');
    });

    it('should handle empty params', () => {
      const url = buildAuthorizationUrl('https://auth.example.com/authorize', {});
      expect(url).toContain('https://auth.example.com/authorize');
    });
  });

  describe('parseQueryString', () => {
    it('should parse a query string into key-value pairs', () => {
      const result = parseQueryString('?code=abc123&state=xyz789');
      expect(result.code).toBe('abc123');
      expect(result.state).toBe('xyz789');
    });

    it('should handle empty query strings', () => {
      const result = parseQueryString('');
      expect(Object.keys(result).length).toBe(0);
    });

    it('should handle error parameters', () => {
      const result = parseQueryString('?error=access_denied&error_description=User+denied');
      expect(result.error).toBe('access_denied');
      expect(result.error_description).toBe('User denied');
    });
  });
});
