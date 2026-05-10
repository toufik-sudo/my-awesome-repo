import { Logger } from '@nestjs/common';
import { scopeFallbackEventsStore } from './scope-fallback-events.store';

/**
 * Centralized debug logger for scope resolution fallbacks.
 *
 * A "fallback" happens when a manager / hyper_manager / guest has a granted
 * permission whose scope does NOT explicitly target properties, services,
 * groups or admins. In that case we inherit the inviter's full owned
 * inventory (admin's properties / services).
 *
 * Logs are emitted at DEBUG level always, and additionally at LOG (info)
 * level when the env flag DEBUG_SCOPE_FALLBACK is truthy — making it easy
 * to surface them in production without changing the global log level.
 *
 * Each event is also pushed to an in-memory ring buffer so admins can review
 * recent fallbacks via the /rbac-config/scope-fallbacks endpoint.
 */

const logger = new Logger('ScopeFallback');

function isVerbose(): boolean {
  const v = process.env.DEBUG_SCOPE_FALLBACK;
  return v === '1' || v === 'true' || v === 'yes';
}

export interface ScopeFallbackEvent {
  source: string; // e.g. 'ScopeFilterService.resolvePropertyIds'
  role?: string;
  userId?: number;
  permissionKey?: string;
  scope?: string;
  inviterIds: number[];
  resolvedCount: number;
  resourceKind: 'property' | 'service';
  reason: string; // human-readable explanation
}

export function logScopeFallback(event: ScopeFallbackEvent): void {
  const record = scopeFallbackEventsStore.push(event);
  const message = JSON.stringify({ type: 'scope_fallback', ...record });

  if (isVerbose()) {
    logger.log(message);
  } else {
    logger.debug(message);
  }
}
