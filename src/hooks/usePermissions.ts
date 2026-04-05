import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { AppRole, PermissionType, ManagerAssignment, ManagerPermission } from '@/modules/admin/admin.types';
import {
  ROLE_RESTRICTIONS, INVITATION_ALLOWED_ROLES, ADMIN_ASSIGNABLE_PERMISSIONS,
  HYPER_MANAGER_ASSIGNABLE_PERMISSIONS, PERMISSION_CATEGORIES,
} from '@/modules/admin/admin.types';
import { assignmentsApi, rolesApi } from '@/modules/admin/admin.api';
import { rbacConfigApi } from '@/modules/admin/rbac-config.api';

interface PermissionsState {
  assignments: ManagerAssignment[];
  permissionsMap: Record<string, ManagerPermission[]>;
  loading: boolean;
  loaded: boolean;
}

/**
 * Comprehensive RBAC hook — replaces useRoleAccess with scope-aware permission checking.
 *
 * For admin/manager roles, fetches actual assignments and permissions from the API
 * so every UI element can be gated accurately.
 *
 * Usage:
 *   const { can, canOnProperty, role, isAdmin, ... } = usePermissions();
 *   if (can('modify_property')) { ... }
 *   if (canOnProperty('view_bookings', propertyId)) { ... }
 */
export function usePermissions() {
  const { user } = useAuth();
  const role: AppRole = (user?.role as AppRole) || 'user';

  const [state, setState] = useState<PermissionsState>({
    assignments: [],
    permissionsMap: {},
    loading: false,
    loaded: false,
  });

  const [rbacConfig, setRbacConfig] = useState<Record<string, boolean>>({});
  const [fetchCounter, setFetchCounter] = useState(0);

  /** Force reload all permissions from API (call after RBAC config change) */
  const reloadPermissions = useCallback(() => {
    setFetchCounter(c => c + 1);
  }, []);

  // Fetch RBAC frontend config for the current role
  useEffect(() => {
    if (!user?.id || !role) return;
    rbacConfigApi.getFrontendByRole(role)
      .then(config => setRbacConfig(config))
      .catch(() => {}); // silently fallback
  }, [user?.id, role, fetchCounter]);

  // Fetch assignments + permissions for admin/manager roles
  useEffect(() => {
    if (!user?.id) return;
    if (!['admin', 'manager', 'hyper_manager'].includes(role)) return;

    let cancelled = false;
    setState(s => ({ ...s, loading: true }));

    (async () => {
      try {
        const assignments = await assignmentsApi.getAll();
        const permMap: Record<string, ManagerPermission[]> = {};

        await Promise.all(
          assignments.map(async (a) => {
            try {
              const perms = await assignmentsApi.getPermissions(a.id);
              permMap[a.id] = perms;
            } catch {
              permMap[a.id] = [];
            }
          }),
        );

        if (!cancelled) {
          setState({
            assignments,
            permissionsMap: permMap,
            loading: false,
            loaded: true,
          });
        }
      } catch {
        if (!cancelled) {
          setState(s => ({ ...s, loading: false, loaded: true }));
        }
      }
    })();

    return () => { cancelled = true; };
  }, [user?.id, role, fetchCounter]);

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
    const isHost = isAdmin || isManager;

    const { assignments, permissionsMap, loading: permissionsLoading, loaded: permissionsLoaded } = state;

    // ─── Permission helpers ───────────────────────────────────────────

    /**
     * Check if user has a specific permission on a specific assignment.
     */
    const hasPermissionOnAssignment = (assignmentId: string, perm: PermissionType): boolean => {
      return (permissionsMap[assignmentId] || []).some(p => p.permission === perm && p.isGranted);
    };

    /**
     * Check if user has a specific permission on ANY of their assignments.
     * Admin always returns true (owns all their properties).
     * hyper_admin always returns true.
     */
    const can = (perm: PermissionType): boolean => {
      if (isHyperAdmin) return true;
      if (isAdmin) return true;
      if (isHyperManager || isManager) {
        return assignments.some(a => hasPermissionOnAssignment(a.id, perm));
      }
      return false;
    };

    /**
     * Check if user has permission on a specific property.
     * Admin: checks if property belongs to them (always true for UI, backend validates).
     * Manager: checks assignments covering that property.
     */
    const canOnProperty = (perm: PermissionType, propertyId: string): boolean => {
      if (isHyperAdmin) return true;
      if (isAdmin) return true; // Backend validates ownership
      if (isHyperManager || isManager) {
        return assignments.some(a => {
          // Check if assignment covers this property
          const coversProperty =
            a.scope === 'all' ||
            (a.scope === 'property' && a.propertyId === propertyId);
          // For property_group, we'd need membership data — allow and let backend validate
          if (a.scope === 'property_group') return hasPermissionOnAssignment(a.id, perm);
          return coversProperty && hasPermissionOnAssignment(a.id, perm);
        });
      }
      return false;
    };

    /**
     * Get all property IDs the user has access to.
     * Returns null for "all properties" (hyper or admin with scope: all).
     */
    const getAccessiblePropertyIds = (): string[] | null => {
      if (isHyperAdmin || isHyperManager) return null; // all
      if (isAdmin) return null; // admin sees own — backend filters
      if (isUser) return null; // all properties

      const ids = new Set<string>();
      for (const a of assignments) {
        if (a.scope === 'all') return null;
        if (a.scope === 'property' && a.propertyId) ids.add(a.propertyId);
        // property_group: would need to resolve — for now, let backend handle
      }
      return Array.from(ids);
    };

    /**
     * Get granted permissions for display (e.g., permission grid).
     */
    const getGrantedPermissions = (): PermissionType[] => {
      if (isHyperAdmin) return HYPER_MANAGER_ASSIGNABLE_PERMISSIONS;
      if (isAdmin) return ADMIN_ASSIGNABLE_PERMISSIONS;

      const granted = new Set<PermissionType>();
      for (const perms of Object.values(permissionsMap)) {
        for (const p of perms) {
          if (p.isGranted) granted.add(p.permission);
        }
      }
      return Array.from(granted);
    };

    /**
     * Filter a list of items based on accessible property IDs.
     */
    const filterByScope = <T extends { propertyId?: string; id?: string }>(
      items: T[],
      propertyIdKey: keyof T = 'propertyId' as keyof T,
    ): T[] => {
      const accessibleIds = getAccessiblePropertyIds();
      if (accessibleIds === null) return items; // all access
      return items.filter(item => {
        const id = item[propertyIdKey] as unknown as string;
        return id && accessibleIds.includes(id);
      });
    };

    return {
      // ─── Role flags ───────────────────────────────────────────────────
      role,
      isHyperAdmin,
      isHyperManager,
      isHyper,
      isAdmin,
      isManager,
      isUser,
      isGuest,
      isHost,

      // ─── Loading state ────────────────────────────────────────────────
      permissionsLoading,
      permissionsLoaded,
      assignments,
      rbacConfig,
      reloadPermissions,

      // ─── Permission checkers ──────────────────────────────────────────
      /** Check if an action is restricted for the current role */
      isRestricted,
      /** Check if user has permission (on any assignment) */
      can,
      /** Check if user has permission on a specific property */
      canOnProperty,
      /** Check permission on a specific assignment */
      hasPermissionOnAssignment,

      // ─── Scope helpers ────────────────────────────────────────────────
      getAccessiblePropertyIds,
      getGrantedPermissions,
      filterByScope,

      // ─── Convenience flags (common checks) ────────────────────────────
      canCreateProperty: isAdmin || (isManager && can('create_property')),
      canModifyProperty: isAdmin || (isManager && can('modify_property')),
      canDeleteProperty: isAdmin || (isHyper && can('delete_property')),
      canPauseProperty: isAdmin || can('pause_property'),
      canCreateService: isAdmin || (isManager && can('create_service')),
      canModifyService: isAdmin || (isManager && can('modify_service')),
      canDeleteService: isAdmin || (isHyper && can('delete_service')),
      canPauseService: isAdmin || can('pause_service'),

      canMakeBooking: !isRestricted('make_booking'),
      canAcceptBookings: isAdmin || can('accept_bookings'),
      canRejectBookings: isAdmin || can('reject_bookings'),
      canViewBookings: isAdmin || isManager || isHyper,
      canRefundUsers: isAdmin || can('refund_users'),
      canAnswerDemands: isAdmin || can('answer_demands'),
      canDeclineDemands: isAdmin || can('decline_demands'),
      canAcceptDemands: isAdmin || can('accept_demands'),

      canInviteManager: isAdmin,
      canInviteGuest: isAdmin || isManager,
      canInviteHyperRoles: isHyper,

      canCreateGroups: isAdmin || isHyper,
      canManageGroups: isAdmin || isHyper,

      canCreateAbsorptionFees: isAdmin,
      canCreateCancellationRules: isAdmin,
      canManageFees: isAdmin || isHyper,
      canManageFeeAbsorption: isAdmin || can('manage_fee_absorption'),
      canManageCancellationRules: isAdmin || can('manage_cancellation_rules'),

      canAssignManagers: isAdmin || isHyper,
      canManagePermissions: isAdmin || isHyper,
      canViewRbacSettings: isHyperAdmin || isHyperManager || (isAdmin && (rbacConfig['show_rbac_settings'] ?? false)),
      canEditRbacSettings: isHyperAdmin || (isAdmin && (rbacConfig['show_rbac_settings_edit'] ?? false)),

      canVerifyDocuments: isHyper || can('verify_documents'),
      canViewAnalytics: isAdmin || isHyper || can('view_analytics'),
      canViewPayments: isAdmin || isHyper || can('view_payments'),
      canViewEmailAnalytics: isAdmin || isHyper || can('view_email_analytics'),

      canManagePayoutAccounts: isAdmin,
      canValidatePayments: isHyper || can('validate_payments'),

      canManageUsers: isHyper || can('manage_users'),
      canManageAdmins: isHyper || can('manage_admins'),
      canManageManagers: isAdmin || isHyper || can('manage_managers'),

      canReplyChat: isAdmin || can('reply_chat'),
      canReplyReviews: isAdmin || can('reply_reviews'),
      canReplyComments: isAdmin || can('reply_comments'),
      canSendMessages: isAdmin || can('send_messages'),
      canContactGuests: isAdmin || can('contact_guests'),

      canManagePromotions: isAdmin || can('manage_promotions'),
      canModifyOffers: isAdmin || can('modify_offers'),
      canModifyPrices: isAdmin || can('modify_prices'),
      canArchiveEntities: isHyper || can('archive_entities'),

      /** Invitation roles available for current user */
      allowedInvitationRoles: INVITATION_ALLOWED_ROLES[role] || [],

      /**
       * Filtered invitable roles — excludes 'manager' for hyper roles since managers are admin-scoped.
       * Use this in InvitationForm instead of inline filtering.
       */
      allowedInvitableRoles: (() => {
        const roles = INVITATION_ALLOWED_ROLES[role] || [];
        return (isHyperAdmin || isHyperManager) ? roles.filter(r => r !== 'manager') : roles;
      })(),

      /** Assignable permissions for current user */
      assignablePermissions: isHyperAdmin
        ? HYPER_MANAGER_ASSIGNABLE_PERMISSIONS
        : isAdmin
        ? ADMIN_ASSIGNABLE_PERMISSIONS
        : [],

      /** Whether the target user is an admin (for cascade info display) */
      isTargetAdmin: (targetRole: AppRole) => targetRole === 'admin',

      /** Whether Add/Duplicate property buttons should be hidden */
      canDuplicateProperty: isAdmin,
      canDuplicateService: isAdmin,
    };
  }, [role, state, rbacConfig, reloadPermissions]);
}
