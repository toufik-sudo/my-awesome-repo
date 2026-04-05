import { AppRole } from '../entity/user.entity';

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
