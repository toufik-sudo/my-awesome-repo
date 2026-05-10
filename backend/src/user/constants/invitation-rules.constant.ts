import { AppRole, ROLE_HIERARCHY } from '../entity/user.entity';

/**
 * Roles that are IMMUTABLE — once assigned, the user cannot transition to a
 * different role via invitation acceptance. Re-invitations to the same or any
 * other role must be rejected.
 *
 * Rationale (per product rules):
 * - hyper_admin / hyper_manager: top-level platform roles, must not be downgraded
 *   nor sideways-changed.
 * - admin: a Host owns properties/services. Switching them to anything else
 *   would orphan their resources.
 *
 * Mutable roles (user, guest, manager) can be UPGRADED to a higher role via a
 * fresh invitation, but never downgraded.
 */
export const IMMUTABLE_ROLES: AppRole[] = ['hyper_admin', 'hyper_manager', 'admin'];

export function isImmutableRole(role: AppRole): boolean {
  return IMMUTABLE_ROLES.includes(role);
}

/**
 * Determine whether a user with `currentRole` can transition to `targetRole`
 * through an invitation acceptance.
 *
 * Returns an object describing the outcome so callers can produce useful
 * error messages.
 */
export function evaluateRoleTransition(
  currentRole: AppRole,
  targetRole: AppRole,
): { allowed: boolean; reason?: 'IMMUTABLE' | 'DOWNGRADE' | 'SAME'; sameRole?: boolean } {
  if (currentRole === targetRole) {
    return { allowed: false, reason: 'SAME', sameRole: true };
  }
  if (isImmutableRole(currentRole)) {
    return { allowed: false, reason: 'IMMUTABLE' };
  }
  const currentRank = ROLE_HIERARCHY[currentRole] ?? 0;
  const targetRank = ROLE_HIERARCHY[targetRole] ?? 0;
  if (targetRank < currentRank) {
    return { allowed: false, reason: 'DOWNGRADE' };
  }
  return { allowed: true };
}

/**
 * Invitation rules matrix.
 * Key = inviter role, Value = array of roles they can invite.
 *
 * Rules (updated per BE-03):
 * - hyper_admin: can invite hyper_manager, admin, guest — NOT manager (admin-scoped), NOT user
 * - hyper_manager: can invite admin, guest — NOT manager
 * - admin: can invite manager, guest — NOT admin, hyper_admin, hyper_manager, NOT user
 * - manager: can invite guest only
 * - user / guest: cannot invite anyone
 */
export const INVITATION_ALLOWED_ROLES: Record<AppRole, AppRole[]> = {
  hyper_admin: ['hyper_manager', 'admin', 'guest'],
  hyper_manager: ['admin', 'guest'],
  admin: ['manager', 'guest'],
  manager: ['guest'],
  user: [],
  guest: [],
};

/**
 * Returns roles the inviter is allowed to invite.
 */
export function getAllowedInvitationRoles(inviterRole: AppRole): AppRole[] {
  return INVITATION_ALLOWED_ROLES[inviterRole] || [];
}

/**
 * Check if inviter can invite the target role.
 */
export function canInviteRole(inviterRole: AppRole, targetRole: AppRole): boolean {
  return getAllowedInvitationRoles(inviterRole).includes(targetRole);
}

/**
 * Roles that are allowed to make bookings.
 * hyper_admin, hyper_manager, and admin CANNOT book.
 */
export const BOOKING_ALLOWED_ROLES: AppRole[] = ['manager', 'guest', 'user'];

/**
 * Check if a role can make bookings.
 */
export function canMakeBooking(role: AppRole): boolean {
  return BOOKING_ALLOWED_ROLES.includes(role);
}
