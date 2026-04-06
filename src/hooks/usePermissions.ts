import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { AppRole, PermissionType, ManagerAssignment, ManagerPermission } from '@/modules/admin/admin.types';
import {
  ROLE_RESTRICTIONS, INVITATION_ALLOWED_ROLES, ADMIN_ASSIGNABLE_PERMISSIONS,
  HYPER_MANAGER_ASSIGNABLE_PERMISSIONS, PERMISSION_CATEGORIES,
} from '@/modules/admin/admin.types';
import { assignmentsApi, rolesApi } from '@/modules/admin/admin.api';
import { rbacConfigApi } from '@/modules/admin/rbac-config.api';
import { UI_PERM, type UiPermissionKey } from '@/utils/rbac';

interface PermissionsState {
  assignments: ManagerAssignment[];
  permissionsMap: Record<string, ManagerPermission[]>;
  loading: boolean;
  loaded: boolean;
}

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
  const [backendPermsCache, setBackendPermsCache] = useState<Record<string, { allowed: boolean; scope: string }>>({});
  const [fetchCounter, setFetchCounter] = useState(0);

  const reloadPermissions = useCallback(() => {
    setFetchCounter(c => c + 1);
  }, []);

  // Fetch RBAC frontend + backend config for the current role
  useEffect(() => {
    if (!user?.id || !role) return;
    Promise.all([
      rbacConfigApi.getFrontendByRole(role),
      rbacConfigApi.getBackendByRole(role).catch(() => ({})),
    ])
      .then(([frontendConfig, backendConfig]) => {
        setRbacConfig(frontendConfig);
        setBackendPermsCache(backendConfig);
      })
      .catch(() => {});
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
          setState({ assignments, permissionsMap: permMap, loading: false, loaded: true });
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

    const hasPermissionOnAssignment = (assignmentId: string, perm: PermissionType): boolean => {
      return (permissionsMap[assignmentId] || []).some(p => p.permission === perm && p.isGranted);
    };

    const can = (perm: PermissionType): boolean => {
      if (isHyperAdmin) return true;
      if (isAdmin) return true;
      if (isHyperManager || isManager) {
        return assignments.some(a => hasPermissionOnAssignment(a.id, perm));
      }
      return false;
    };

    const canOnProperty = (perm: PermissionType, propertyId: string): boolean => {
      if (isHyperAdmin) return true;
      if (isAdmin) return true;
      if (isHyperManager || isManager) {
        return assignments.some(a => {
          const coversProperty = a.scope === 'all' || (a.scope === 'property' && a.propertyId === propertyId);
          if (a.scope === 'property_group') return hasPermissionOnAssignment(a.id, perm);
          return coversProperty && hasPermissionOnAssignment(a.id, perm);
        });
      }
      return false;
    };

    const getAccessiblePropertyIds = (): string[] | null => {
      if (isHyperAdmin || isHyperManager) return null;
      if (isAdmin) return null;
      if (isUser) return null;
      const ids = new Set<string>();
      for (const a of assignments) {
        if (a.scope === 'all') return null;
        if (a.scope === 'property' && a.propertyId) ids.add(a.propertyId);
      }
      return Array.from(ids);
    };

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

    const filterByScope = <T extends { propertyId?: string; id?: string }>(
      items: T[],
      propertyIdKey: keyof T = 'propertyId' as keyof T,
    ): T[] => {
      const accessibleIds = getAccessiblePropertyIds();
      if (accessibleIds === null) return items;
      return items.filter(item => {
        const id = item[propertyIdKey] as unknown as string;
        return id && accessibleIds.includes(id);
      });
    };

    /** Check a UI permission key from the RBAC config. hyper_admin always true. */
    const canUI = (uiKey: string): boolean => {
      if (isHyperAdmin) return true;
      return rbacConfig[uiKey] ?? false;
    };

    /** Check a backend permission key from cached backend perms */
    const canAPI = (apiKey: string): boolean => {
      if (isHyperAdmin) return true;
      const entry = backendPermsCache[apiKey];
      return entry?.allowed ?? false;
    };

    return {
      role, isHyperAdmin, isHyperManager, isHyper, isAdmin, isManager, isUser, isGuest, isHost,
      permissionsLoading, permissionsLoaded, assignments, rbacConfig, reloadPermissions,
      isRestricted, can, canOnProperty, hasPermissionOnAssignment, canUI, canAPI,
      UI_PERM,
      getAccessiblePropertyIds, getGrantedPermissions, filterByScope,

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
      canViewRbacSettings: isHyperAdmin || isHyperManager || (isAdmin && (rbacConfig[UI_PERM.RBAC_VIEW] ?? false)),
      canEditRbacSettings: isHyperAdmin || (isAdmin && (rbacConfig[UI_PERM.RBAC_EDIT] ?? false)),
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
      allowedInvitationRoles: INVITATION_ALLOWED_ROLES[role] || [],
      allowedInvitableRoles: (() => {
        const roles = INVITATION_ALLOWED_ROLES[role] || [];
        return (isHyperAdmin || isHyperManager) ? roles.filter(r => r !== 'manager') : roles;
      })(),
      assignablePermissions: isHyperAdmin ? HYPER_MANAGER_ASSIGNABLE_PERMISSIONS : isAdmin ? ADMIN_ASSIGNABLE_PERMISSIONS : [],
      isTargetAdmin: (targetRole: AppRole) => targetRole === 'admin',
      canDuplicateProperty: isAdmin,
      canDuplicateService: isAdmin,
    };
  }, [role, state, rbacConfig, backendPermsCache, reloadPermissions]);
}
