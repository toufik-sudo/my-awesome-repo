import { useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { AppRole, PermissionType, ManagerAssignment, ManagerPermission } from '@/modules/admin/admin.types';
import {
  ROLE_RESTRICTIONS, INVITATION_ALLOWED_ROLES, ADMIN_ASSIGNABLE_PERMISSIONS,
  HYPER_MANAGER_ASSIGNABLE_PERMISSIONS,
} from '@/modules/admin/admin.types';
import { assignmentsApi } from '@/modules/admin/admin.api';
import { rbacConfigApi, type RbacFrontendPermission } from '@/modules/admin/rbac-config.api';
import { permissionBindingsApi, type BindingMap } from '@/modules/admin/permission-bindings.api';
import { generateUiPermissionKey } from '@/utils/rbac/generate-ui-permission-key';
import { setRbacCache } from '@/lib/axios';
import { useAppSelector, useAppDispatch } from '@/store';
import { rbacLoadStart, rbacLoadSuccess, rbacLoadError, selectRbac } from '@/store/slices/rbac.slice';
import { useState } from 'react';

interface AssignmentsState {
  assignments: ManagerAssignment[];
  permissionsMap: Record<string, ManagerPermission[]>;
  loading: boolean;
  loaded: boolean;
}

/**
 * usePermissions — single source of truth for RBAC.
 * Reads from the persisted Redux `rbac` slice (rbacConfig, backendPermsCache,
 * bindingMap, frontendPermByKey) populated by `<RbacBootstrap />` at app start.
 *
 * Provides `reloadPermissions()` to refetch and update the store after
 * RBAC settings changes.
 */
export function usePermissions() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const role: AppRole = (user?.role as AppRole) || 'user';
  const rbac = useAppSelector(selectRbac);

  const {
    rbacConfig,
    backendPermsCache,
    bindingMap,
    frontendPermByKey,
    loaded: rbacLoaded,
  } = rbac;

  const [assignmentsState, setAssignmentsState] = useState<AssignmentsState>({
    assignments: [],
    permissionsMap: {},
    loading: false,
    loaded: false,
  });

  /** Reload RBAC caches into the Redux store (e.g. after RBAC settings save). */
  const reloadPermissions = useCallback(async () => {
    if (!user?.id) return;
    dispatch(rbacLoadStart());
    try {
      const [frontendConfig, backendConfig, bindings, frontendPerms] = await Promise.all([
        rbacConfigApi.getFrontendByRole(role),
        rbacConfigApi.getBackendByRole(role).catch(() => ({})),
        permissionBindingsApi.getBindingMap().catch(() => ({} as BindingMap)),
        rbacConfigApi.getFrontendPermissions().catch(() => [] as RbacFrontendPermission[]),
      ]);
      const byKey: Record<string, { allowed: boolean; user_roles: string[] }> = {};
      for (const fp of frontendPerms) {
        byKey[fp.permission_key] = { allowed: fp.allowed, user_roles: fp.user_roles };
      }
      dispatch(rbacLoadSuccess({
        rbacConfig: frontendConfig,
        backendPermsCache: backendConfig as any,
        bindingMap: bindings,
        frontendPermByKey: byKey,
        role,
        userId: user.id,
      }));
      setRbacCache(backendConfig as any, bindings, role);
    } catch (err: any) {
      dispatch(rbacLoadError(err?.message || 'reload failed'));
    }
  }, [user?.id, role, dispatch]);

  // Load assignments only for relevant roles
  useEffect(() => {
    if (!user?.id) return;
    if (!['admin', 'manager', 'hyper_manager'].includes(role)) {
      setAssignmentsState(s => ({ ...s, loaded: true }));
      return;
    }
    if (assignmentsState.loaded || assignmentsState.loading) return;
    let cancelled = false;
    setAssignmentsState(s => ({ ...s, loading: true }));
    assignmentsApi.getAll().then(res => {
      if (cancelled) return;
      const allPerms = [
        ...res.managerPermissions.map((p: any) => ({ ...p, _type: 'manager' })),
        ...res.hyperManagerPermissions.map((p: any) => ({ ...p, _type: 'hyper_manager' })),
        ...res.guestPermissions.map((p: any) => ({ ...p, _type: 'guest' })),
      ];
      const assignments: ManagerAssignment[] = [];
      const permMap: Record<string, ManagerPermission[]> = {};
      for (const p of allPerms) {
        const fakeId = p.id;
        assignments.push({
          id: fakeId,
          managerId: p.managerId || p.hyperManagerId || p.guestId,
          assignedByAdminId: p.assignedById,
          scope: (p.scope === 'all' ? 'all' : p.scope === 'properties' ? 'property' : 'property_group') as any,
          isActive: p.isGranted,
          createdAt: p.createdAt,
        });
        permMap[fakeId] = [{
          id: p.id,
          assignmentId: fakeId,
          permission: p.backendPermissionKey,
          isGranted: p.isGranted,
        }];
      }
      setAssignmentsState({ assignments, permissionsMap: permMap, loading: false, loaded: true });
    }).catch(() => {
      if (!cancelled) setAssignmentsState(s => ({ ...s, loading: false, loaded: true }));
    });
    return () => { cancelled = true; };
  }, [user?.id, role, assignmentsState.loaded, assignmentsState.loading]);

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

    const { assignments, permissionsMap, loading: permissionsLoading, loaded: permissionsLoaded } = assignmentsState;

    const hasPermissionOnAssignment = (assignmentId: string, perm: PermissionType): boolean =>
      (permissionsMap[assignmentId] || []).some(p => p.permission === perm && p.isGranted);

    const can = (perm: PermissionType): boolean => {
      if (isHyperAdmin || isAdmin) return true;
      if (isHyperManager || isManager) {
        return assignments.some(a => hasPermissionOnAssignment(a.id, perm));
      }
      return false;
    };

    const canOnProperty = (perm: PermissionType, propertyId: string): boolean => {
      if (isHyperAdmin || isAdmin) return true;
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
      if (isHyperAdmin || isHyperManager || isAdmin || isUser) return null;
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
        for (const p of perms) if (p.isGranted) granted.add(p.permission);
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

    /**
     * Check a UI permission key from the RBAC frontend permissions cache.
     * Blocks by default while RBAC is not yet loaded to avoid unauthorized flashes.
     */
    const canUI = (uiKey: string): boolean => {
      if (!rbacLoaded && Object.keys(rbacConfig).length === 0) return false;
      const roleAllowed = rbacConfig[uiKey];
      if (roleAllowed !== undefined) return roleAllowed;
      const cached = frontendPermByKey[uiKey];
      if (cached) return cached.allowed && cached.user_roles.includes(role);
      // Permission key not in DB → allow by default
      return true;
    };

    const canAPI = (apiKey: string): boolean => {
      const entry = backendPermsCache[apiKey];
      // Permission key not in DB → allow by default (all roles)
      if (!entry) return true;
      return entry.allowed;
    };

    const canCallApi = (frontendApiKey: string): boolean => {
      const bindings = bindingMap[frontendApiKey];
      if (!bindings || bindings.length === 0) return true;
      return bindings.every(b => b.roles.includes(role));
    };

    const canAction = (frontendKey: string): boolean => {
      if (!canUI(frontendKey)) return false;
      const bindings = bindingMap[frontendKey];
      if (bindings && bindings.length > 0) {
        return bindings.every(b => b.roles.includes(role));
      }
      return true;
    };

    const canActionWithApis = (uiKey: string, ...frontendApiKeys: string[]): boolean => {
      if (!canUI(uiKey)) return false;
      return frontendApiKeys.every(apiKey => canCallApi(apiKey));
    };

    const _ui = (comp: string, sub?: string, el?: string, act?: string) =>
      canUI(generateUiPermissionKey(comp, sub, el, act));

    // Backward-compat shape for code that still reads frontendPermCache
    const frontendPermCache = { byKey: frontendPermByKey, loaded: rbacLoaded };

    return {
      role, isHyperAdmin, isHyperManager, isHyper, isAdmin, isManager, isUser, isGuest, isHost,
      permissionsLoading, permissionsLoaded, assignments, rbacConfig, reloadPermissions,
      frontendPermCache, backendPermsCache, bindingMap,
      isRestricted, can, canOnProperty, hasPermissionOnAssignment, canUI, canAPI, canAction, canCallApi,
      canActionWithApis,
      getAccessiblePropertyIds, getGrantedPermissions, filterByScope,
      allowedInvitationRoles: INVITATION_ALLOWED_ROLES[role] || [],
      allowedInvitableRoles: (() => {
        const roles = INVITATION_ALLOWED_ROLES[role] || [];
        return (isHyperAdmin || isHyperManager) ? roles.filter(r => r !== 'manager') : roles;
      })(),
      assignablePermissions: isHyperAdmin ? HYPER_MANAGER_ASSIGNABLE_PERMISSIONS : isAdmin ? ADMIN_ASSIGNABLE_PERMISSIONS : [],
      isTargetAdmin: (targetRole: AppRole) => targetRole === 'admin',
      // Property
      canCreateProperty: _ui('AddPropertyWizard', undefined, 'Page', 'View'),
      canModifyProperty: _ui('PropertyDetailPage', 'Actions', 'Button', 'Edit'),
      canDeleteProperty: _ui('PropertyDetailPage', 'Actions', 'Button', 'Delete'),
      canPauseProperty: _ui('PropertyDetailPage', 'Actions', 'Button', 'Pause'),
      canDuplicateProperty: _ui('PropertyListPage', 'Card', 'Button', 'Duplicate'),
      // Service
      canCreateService: _ui('AddServiceWizard', undefined, 'Page', 'View'),
      canModifyService: _ui('ServiceDetailPage', 'Actions', 'Button', 'Edit'),
      canDeleteService: _ui('ServiceDetailPage', 'Actions', 'Button', 'Delete'),
      canPauseService: _ui('ServiceDetailPage', 'Actions', 'Button', 'Pause'),
      canDuplicateService: _ui('ServiceListPage', 'Card', 'Button', 'Duplicate'),
      // Booking
      canMakeBooking: !isRestricted('make_booking'),
      canAcceptBookings: _ui('HostBookings', 'Actions', 'Button', 'Accept'),
      canRejectBookings: _ui('HostBookings', 'Actions', 'Button', 'Reject'),
      canViewBookings: _ui('HostBookings', undefined, 'Page', 'View'),
      canRefundUsers: _ui('HostBookings', 'Actions', 'Button', 'Refund'),
      // Users & Invitations
      canInviteManager: _ui('UsersPage', 'List', 'Button', 'Invite') && isAdmin,
      canInviteGuest: _ui('UsersPage', 'List', 'Button', 'Invite') && (isAdmin || isManager),
      canInviteHyperRoles: isHyper,
      canManageUsers: _ui('UsersPage', undefined, 'Tab', 'View'),
      canManageAdmins: isHyper,
      canManageManagers: _ui('ManagerAssignments', undefined, 'Page', 'View'),
      // Groups
      canCreateGroups: _ui('PropertyGroupsManagement', 'Header', 'Button', 'Create'),
      canManageGroups: _ui('PropertyGroupsManagement', undefined, 'Page', 'View'),
      // Fees
      canManageFees: _ui('ServiceFeesPage', undefined, 'Page', 'View'),
      canCreateAbsorptionFees: _ui('HostFeeAbsorptionPage', 'Header', 'Button', 'Add'),
      canCreateCancellationRules: _ui('CancellationRulesPage', 'Header', 'Button', 'Add'),
      canManageFeeAbsorption: _ui('HostFeeAbsorptionPage', undefined, 'Page', 'View'),
      canManageCancellationRules: _ui('CancellationRulesPage', undefined, 'Page', 'View'),
      // Permissions & RBAC
      canAssignManagers: _ui('ManagerAssignments', 'Header', 'Button', 'Create'),
      canManagePermissions: _ui('ManagerAssignments', 'Detail', 'Button', 'EditPermissions'),
      canViewRbacSettings: _ui('RbacSettings', undefined, 'Page', 'View'),
      canEditRbacSettings: _ui('RbacSettings', undefined, 'Page', 'Edit'),
      // Verification & Documents
      canVerifyDocuments: _ui('VerificationReview', undefined, 'Page', 'View'),
      // Analytics & Payments
      canViewAnalytics: _ui('Dashboard', 'Analytics', 'Tab', 'View'),
      canViewPayments: _ui('Dashboard', 'Payments', 'Tab', 'View'),
      canValidatePayments: _ui('HyperDashboard', 'PaymentValidation', 'Button', 'Approve'),
      canViewEmailAnalytics: _ui('EmailAnalyticsPage', undefined, 'Page', 'View'),
      canManagePayoutAccounts: _ui('PayoutAccountsPage', undefined, 'Page', 'View'),
    };
  }, [role, assignmentsState, rbacConfig, backendPermsCache, bindingMap, frontendPermByKey, rbacLoaded, reloadPermissions]);
}
