import { AppRole } from '../entity/user.entity';

/**
 * Invitation rules matrix.
 * Key = inviter role, Value = array of roles they can invite.
 *
 * Rules:
 * - hyper_admin: can invite anyone EXCEPT manager (managers are admin-scoped)
 * - hyper_manager: can invite admin and guest only
 * - admin: can invite guest and manager only
 * - manager: can invite guest only
 * - user / guest: cannot invite anyone
 */
export const INVITATION_ALLOWED_ROLES: Record<AppRole, AppRole[]> = {
  hyper_admin: ['hyper_manager', 'admin', 'user', 'guest'],
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
