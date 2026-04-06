/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RBAC Permission Registry — Utility exports only
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * The registry is now fully DB-driven. No hardcoded permission lists.
 * Use generateBackendPermissionKey() and generateUiPermissionKey() to create keys.
 * All permissions are stored in rbac_backend_permissions and rbac_frontend_permissions tables.
 */

export { generateBackendPermissionKey, type HttpMethod } from './utils/generate-backend-permission-key';
export { generateUiPermissionKey } from './utils/generate-ui-permission-key';
