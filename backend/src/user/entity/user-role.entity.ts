/**
 * @deprecated Roles are now stored directly in users.role as a single string.
 * This entity is kept only for migration reference. Do NOT use in new code.
 */
export type AppRole = 'hyper_admin' | 'hyper_manager' | 'admin' | 'manager' | 'user' | 'guest';

// Re-export from user.entity for backward compatibility
export { AppRole as AppRoleType } from './user.entity';
