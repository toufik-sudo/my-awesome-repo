/**
 * [BE-11] Host ID Filter Helper
 *
 * Utility to ensure admin queries are always scoped by hostId.
 * Use in services to enforce that admins only see their own resources.
 *
 * Usage in a service:
 *   const where = filterByHostId(baseWhere, userId, userRole);
 */
import { AppRole } from '../entity/user.entity';

/**
 * Adds hostId filter to a TypeORM where clause if the user is an admin.
 * Hyper roles see everything (no filter). Admin only sees their own.
 *
 * @param where - existing where conditions
 * @param userId - current user ID
 * @param userRole - current user role
 * @param hostIdField - the field name for host ID (default: 'hostId')
 * @returns augmented where clause
 */
export function filterByHostId<T extends Record<string, any>>(
  where: T,
  userId: number,
  userRole: AppRole,
  hostIdField: string = 'hostId',
): T {
  if (userRole === 'hyper_admin' || userRole === 'hyper_manager') {
    return where; // No filter — global access
  }

  if (userRole === 'admin') {
    return { ...where, [hostIdField]: userId };
  }

  // Manager/user/guest — don't add hostId filter here,
  // they have separate scope resolution via assignments
  return where;
}

/**
 * Check if admin scope filtering should be applied.
 */
export function shouldFilterByHost(userRole: AppRole): boolean {
  return userRole === 'admin';
}

/**
 * Returns the appropriate hostId for query filtering, or undefined for hyper roles.
 */
export function getHostIdFilter(userId: number, userRole: AppRole): number | undefined {
  if (userRole === 'admin') return userId;
  return undefined; // hyper roles and others don't filter by host
}
