import { useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { AppRole, PermissionType } from '@/modules/admin/admin.types';
import { ROLE_RESTRICTIONS, INVITATION_ALLOWED_ROLES, ADMIN_ASSIGNABLE_PERMISSIONS } from '@/modules/admin/admin.types';

/**
 * @deprecated Use usePermissions() instead for scope-aware permission checking.
 * This hook is kept for backward compatibility but does not fetch actual manager permissions.
 */
export function useRoleAccess() {
  const { user } = useAuth();
  const role: AppRole = (user?.role as AppRole) || 'user';

  return useMemo(() => {
    const restrictions = ROLE_RESTRICTIONS[role] || [];

    const isRestricted = (action: string) => restrictions.includes(action);
    const isHyperAdmin = role === 'hyper_admin';
    const isHyperManager = role === 'hyper_manager';
    const isHyper = isHyperAdmin || isHyperManager;
    const isAdmin = role === 'admin';
    const isManager = role === 'manager';
    const isUser = role === 'user';
    const isGuest = role === 'guest';

    // Admin has full control within own scope
    const isHost = isAdmin || isManager;

    return {
      role,
      isHyperAdmin,
      isHyperManager,
      isHyper,
      isAdmin,
      isManager,
      isUser,
      isGuest,
      isHost,

      /** Check if an action is restricted for the current role */
      isRestricted,

      // ─── Property & Service Management ────────────────────────────────
      canCreateProperty: isAdmin || (isManager && !isRestricted('create_property')),
      canModifyProperty: isAdmin || (isManager && !isRestricted('modify_property')),
      canDeleteProperty: isAdmin,
      canCreateService: isAdmin || (isManager && !isRestricted('create_service')),
      canModifyService: isAdmin || (isManager && !isRestricted('modify_service')),

      // ─── Booking ──────────────────────────────────────────────────────
      canMakeBooking: !isRestricted('make_booking'),
      canAcceptBookings: isAdmin || (isManager && !isRestricted('accept_bookings')),
      canViewBookings: isAdmin || isManager || isHyper,

      // ─── User Management ─────────────────────────────────────────────
      canInviteManager: isAdmin,
      canInviteGuest: isAdmin || isManager,
      canInviteHyperRoles: isHyper,

      // ─── Groups ───────────────────────────────────────────────────────
      canCreateGroups: isAdmin || isHyper,
      canManageGroups: isAdmin || isHyper,

      // ─── Fees & Rules ────────────────────────────────────────────────
      canCreateAbsorptionFees: isAdmin,
      canCreateCancellationRules: isAdmin,
      canManageFees: isAdmin || isHyper,

      // ─── Assignments & Permissions ───────────────────────────────────
      canAssignManagers: isAdmin || isHyper,
      canManagePermissions: isAdmin || isHyper,
      canAssignToNonHyperManager: !isRestricted('assign_permissions_non_hypermanager'),

      // ─── Verification & Analytics ────────────────────────────────────
      canVerifyDocuments: isAdmin || isHyper,
      canViewAnalytics: isAdmin || isHyper,

      // ─── Payout & Payments ───────────────────────────────────────────
      canManagePayoutAccounts: isAdmin,
      canValidatePayments: isHyper,

      /** Invitation roles available for current user */
      allowedInvitationRoles: INVITATION_ALLOWED_ROLES[role] || [],

      /** Assignable permissions for current user */
      assignablePermissions: isAdmin ? ADMIN_ASSIGNABLE_PERMISSIONS : [],
    };
  }, [role]);
}
