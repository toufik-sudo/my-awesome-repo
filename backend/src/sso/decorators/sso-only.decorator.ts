import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to conditionally protect routes based on SSO_ENABLED config.
 *
 * @SsoOnly()       → Route only accessible when SSO is enabled
 * @SsoOnly(true)   → Route only accessible when SSO is enabled
 * @SsoOnly(false)  → Route only accessible when SSO is disabled (traditional auth)
 *
 * Usage:
 *   @SsoOnly()
 *   @Post('token')
 *   async exchangeToken() { ... }
 */
export const SSO_ONLY_KEY = 'ssoOnly';
export const SsoOnly = (requireSsoEnabled = true) =>
  SetMetadata(SSO_ONLY_KEY, requireSsoEnabled);
