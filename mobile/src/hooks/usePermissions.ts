import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/axios';
import type { AppRole } from '@/types/auth.types';
import { INVITATION_ALLOWED_ROLES, BOOKING_ALLOWED_ROLES } from '@/types/auth.types';
import { MOBILE_UI_PERM } from '@/utils/rbac/mobile-permission-keys';

const RBAC_CONFIG_BASE = '/rbac-config';

interface PermissionsState {
  rbacConfig: Record<string, boolean>;
  loading: boolean;
  loaded: boolean;
}

/**
 * Comprehensive RBAC hook for mobile.
 * Fetches frontend permissions from the backend API (same as web usePermissions).
 * Caches per role and re-fetches on reloadPermissions().
 */
export function usePermissions() {
  const { user } = useAuth();
  const role: AppRole = (user?.role as AppRole) || 'user';

  const [state, setState] = useState<PermissionsState>({
    rbacConfig: {},
    loading: false,
    loaded: false,
  });
  const [fetchCounter, setFetchCounter] = useState(0);

  /** Force reload permissions from API (call after RBAC config change) */
  const reloadPermissions = useCallback(() => {
    setFetchCounter(c => c + 1);
  }, []);

  // Fetch RBAC frontend config for the current role
  useEffect(() => {
    if (!user?.id || !role) return;

    let cancelled = false;
    setState(s => ({ ...s, loading: true }));

    api.get<Record<string, boolean>>(`${RBAC_CONFIG_BASE}/frontend/role/${role}`)
      .then(res => {
        if (!cancelled) {
          setState({ rbacConfig: res.data, loading: false, loaded: true });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState(s => ({ ...s, loading: false, loaded: true }));
        }
      });

    return () => { cancelled = true; };
  }, [user?.id, role, fetchCounter]);

  return useMemo(() => {
    const { rbacConfig, loading: permissionsLoading, loaded: permissionsLoaded } = state;

    const isHyperAdmin = role === 'hyper_admin';
    const isHyperManager = role === 'hyper_manager';
    const isHyper = isHyperAdmin || isHyperManager;
    const isAdmin = role === 'admin';
    const isManager = role === 'manager';
    const isUser = role === 'user';
    const isGuest = role === 'guest';
    const isHost = isAdmin || isManager;

    /**
     * Check a UI permission key from the backend RBAC config.
     * Falls back to false if not loaded yet.
     * hyper_admin always returns true.
     */
    const canUI = (uiKey: string): boolean => {
      if (isHyperAdmin) return true;
      return rbacConfig[uiKey] ?? false;
    };

    return {
      // ─── Role flags ───────────────────────────────
      role,
      isHyperAdmin,
      isHyperManager,
      isHyper,
      isAdmin,
      isManager,
      isUser,
      isGuest,
      isHost,

      // ─── Loading state ────────────────────────────
      permissionsLoading,
      permissionsLoaded,
      rbacConfig,
      reloadPermissions,

      // ─── Dynamic UI permission checker ─────────────
      canUI,

      // ─── Property permissions ─────────────────────
      canCreateProperty: canUI(MOBILE_UI_PERM.PROPERTY_VIEW) || isAdmin,
      canModifyProperty: canUI(MOBILE_UI_PERM.PROPERTY_VIEW) || isAdmin || isManager,
      canDeleteProperty: canUI(MOBILE_UI_PERM.PROPERTY_VIEW) || isAdmin || isHyper,
      canPauseProperty: canUI(MOBILE_UI_PERM.PROPERTY_VIEW) || isAdmin || isManager,
      canDuplicateProperty: canUI(MOBILE_UI_PERM.PROPERTY_VIEW) || isAdmin,

      // ─── Service permissions ──────────────────────
      canCreateService: canUI(MOBILE_UI_PERM.SERVICE_VIEW) || isAdmin,
      canModifyService: canUI(MOBILE_UI_PERM.SERVICE_VIEW) || isAdmin || isManager,
      canDeleteService: canUI(MOBILE_UI_PERM.SERVICE_VIEW) || isAdmin || isHyper,
      canPauseService: canUI(MOBILE_UI_PERM.SERVICE_VIEW) || isAdmin || isManager,
      canDuplicateService: canUI(MOBILE_UI_PERM.SERVICE_VIEW) || isAdmin,

      // ─── Booking permissions ──────────────────────
      canMakeBooking: BOOKING_ALLOWED_ROLES.includes(role),
      canViewBookings: canUI(MOBILE_UI_PERM.BOOKINGS_TAB) || isAdmin || isManager || isHyper,
      canAcceptBookings: canUI(MOBILE_UI_PERM.BOOKING_ACCEPT) || isAdmin || isManager,

      // ─── Invitation ───────────────────────────────
      allowedInvitationRoles: INVITATION_ALLOWED_ROLES[role] || [],
      allowedInvitableRoles: (() => {
        const roles = INVITATION_ALLOWED_ROLES[role] || [];
        return isHyper ? roles.filter(r => r !== 'manager') : roles;
      })(),
      canInviteManager: isAdmin,
      canInviteGuest: isAdmin || isManager,

      // ─── Dashboard visibility ─────────────────────
      canViewAnalytics: canUI(MOBILE_UI_PERM.ANALYTICS_TAB) || isAdmin || isHyper,
      canViewPayments: canUI(MOBILE_UI_PERM.PAYMENTS_TAB) || isAdmin || isHyper,
      canManageUsers: isHyper,

      // ─── Role helpers ─────────────────────────────
      isTargetAdmin: (targetRole: string) => targetRole === 'admin',

      // ─── Scope filtering ──────────────────────────
      filterByScope: <T extends Record<string, any>>(items: T[]): T[] => {
        return items;
      },
    };
  }, [role, state, reloadPermissions]);
}
