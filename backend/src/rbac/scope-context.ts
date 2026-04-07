import { ScopedPerm } from './services/scope-filter.service';

/**
 * Scope context extracted from the request by PermissionGuard.
 * Passed from controllers to services for scope-based filtering.
 */
export interface ScopeContext {
  userId: number;
  userRole: string;
  /** Scoped permissions for manager role */
  managerScopedPerms?: ScopedPerm[];
  /** Scoped permissions for hyper_manager role */
  hyperManagerScopedPerms?: ScopedPerm[];
  /** Scoped permissions for guest role */
  guestScopedPerms?: ScopedPerm[];
  /** Admin ID scope (for admin ownership filtering) */
  scopedAdminId?: number;
  /** Manager property scope (legacy) */
  managerPropertyScope?: string[];
}

/**
 * Extract ScopeContext from an Express request object
 * (populated by PermissionGuard).
 */
export function extractScopeContext(req: any): ScopeContext {
  return {
    userId: req.user?.id,
    userRole: req.userRole || 'user',
    managerScopedPerms: req.managerScopedPerms || [],
    hyperManagerScopedPerms: req.hyperManagerScopedPerms || [],
    guestScopedPerms: req.guestScopedPerms || [],
    scopedAdminId: req.scopedAdminId,
    managerPropertyScope: req.managerPropertyScope,
  };
}

/**
 * Get the relevant scoped perms for a given role from the ScopeContext.
 */
export function getScopedPerms(ctx: ScopeContext): ScopedPerm[] {
  switch (ctx.userRole) {
    case 'manager':
      return ctx.managerScopedPerms || [];
    case 'hyper_manager':
      return ctx.hyperManagerScopedPerms || [];
    case 'guest':
      return ctx.guestScopedPerms || [];
    default:
      return [];
  }
}
