import { useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRbac } from '@/contexts/RbacContext';
import type { AppRole } from '@/types/auth.types';
import { INVITATION_ALLOWED_ROLES, BOOKING_ALLOWED_ROLES } from '@/types/auth.types';
import { MOBILE_UI_PERM } from '@/utils/rbac/mobile-permission-keys';

/**
 * Comprehensive RBAC hook for mobile.
 * Reads from RbacContext (AsyncStorage/SecureStore-persisted) — populated at app bootstrap.
 */
export function usePermissions() {
  const { user } = useAuth();
  const rbac = useRbac();
  const role: AppRole = (user?.role as AppRole) || 'user';

  const reloadPermissions = useCallback(() => {
    rbac.reload();
  }, [rbac]);

  return useMemo(() => {
    const { rbacConfig, frontendPermByKey, loaded: permissionsLoaded, loading: permissionsLoading } = rbac;

    const isHyperAdmin = role === 'hyper_admin';
    const isHyperManager = role === 'hyper_manager';
    const isHyper = isHyperAdmin || isHyperManager;
    const isAdmin = role === 'admin';
    const isManager = role === 'manager';
    const isUser = role === 'user';
    const isGuest = role === 'guest';
    const isHost = isAdmin || isManager;

    /**
     * Check a UI permission key. hyper_admin always returns true.
     * During load, blocks by default to prevent unauthorized flashes.
     */
    const canUI = (uiKey: string): boolean => {
      if (isHyperAdmin) return true;
      if (!permissionsLoaded && Object.keys(rbacConfig).length === 0) return false;

      const roleAllowed = rbacConfig[uiKey];
      if (roleAllowed !== undefined) return roleAllowed;

      const cached = frontendPermByKey[uiKey];
      return cached ? cached.allowed && cached.user_roles.includes(role) : false;
    };

    return {
      // Role flags
      role, isHyperAdmin, isHyperManager, isHyper, isAdmin, isManager, isUser, isGuest, isHost,

      // Loading state
      permissionsLoading, permissionsLoaded, rbacConfig, reloadPermissions,

      // Dynamic UI permission checker
      canUI,
      MOBILE_UI_PERM,

      // Property
      canViewProperties: canUI(MOBILE_UI_PERM.PROPERTY_VIEW),
      canAddProperty: canUI(MOBILE_UI_PERM.PROPERTY_ADD),
      canViewPropertyDetail: canUI(MOBILE_UI_PERM.PROPERTY_DETAIL),
      canShareProperty: canUI(MOBILE_UI_PERM.PROPERTY_SHARE),

      // Service
      canViewServices: canUI(MOBILE_UI_PERM.SERVICE_VIEW),
      canAddService: canUI(MOBILE_UI_PERM.SERVICE_ADD),

      // Booking
      canMakeBooking: BOOKING_ALLOWED_ROLES.includes(role),
      canViewBookings: canUI(MOBILE_UI_PERM.BOOKINGS_TAB),
      canAcceptBooking: canUI(MOBILE_UI_PERM.BOOKING_ACCEPT),
      canRejectBooking: canUI(MOBILE_UI_PERM.BOOKING_REJECT),

      // Dashboard
      canViewAnalytics: canUI(MOBILE_UI_PERM.ANALYTICS_TAB),
      canViewPayments: canUI(MOBILE_UI_PERM.PAYMENTS_TAB),

      // Rewards
      canViewRewards: canUI(MOBILE_UI_PERM.REWARDS_VIEW),
      canRedeemReward: canUI(MOBILE_UI_PERM.REWARD_REDEEM),

      // Chat
      canReplyChat: canUI(MOBILE_UI_PERM.CHAT_REPLY),

      // Invitation
      allowedInvitationRoles: INVITATION_ALLOWED_ROLES[role] || [],
      allowedInvitableRoles: (() => {
        const roles = INVITATION_ALLOWED_ROLES[role] || [];
        return isHyper ? roles.filter(r => r !== 'manager') : roles;
      })(),
      canInviteManager: isAdmin,
      canInviteGuest: isAdmin || isManager,
      canManageUsers: isHyper,

      // Helpers
      isTargetAdmin: (targetRole: string) => targetRole === 'admin',
      filterByScope: <T extends Record<string, any>>(items: T[]): T[] => items,
    };
  }, [role, rbac, reloadPermissions]);
}
