import { useCallback, useMemo } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { generateUiPermissionKey } from '@/utils/rbac/generate-ui-permission-key';
import { swalAlert } from '@/modules/shared/services/alert.service';

/**
 * useRoleAccess — Dynamic RBAC hook for UI permission checks.
 *
 * @param componentName — Optional component scope (e.g. 'PropertyListPage').
 *   When provided, the hook is "scoped" to that component and exposes:
 *     • `canViewPage` — checks `ui.<componentName>.Page.View`
 *     • `can(subView?, elementType?, actionName?)` — checks any sub-permission
 *     • `guardAction(subView, elementType, actionName, fn)` — guarded execution
 *
 * @example
 *   // Page-level guard
 *   const { canViewPage } = useRoleAccess('PropertyListPage');
 *   if (!canViewPage) return <Navigate to="/" />;
 *
 *   // Element-level check
 *   const { can } = useRoleAccess('PropertyListPage');
 *   {can('Header', 'Button', 'Add') && <Button>Add</Button>}
 *
 *   // Unscoped — access all base utilities
 *   const { canUI, role, isAdmin } = useRoleAccess();
 */
export function useRoleAccess(componentName?: string) {
  const perms = usePermissions();

  /**
   * Check page-level view permission: ui.<componentName>.Page.View
   */
  const canViewPage = useMemo(() => {
    if (!componentName) return true;
    const key = generateUiPermissionKey(componentName, undefined, 'Page', 'View');
    return perms.canUI(key);
  }, [componentName, perms]);

  /**
   * Check any sub-permission within the scoped component.
   * `can('Header', 'Button', 'Add')` → checks `ui.<componentName>.Header.Button.Add`
   * `can(undefined, 'Tab', 'View')` → checks `ui.<componentName>.Tab.View`
   */
  const can = useCallback(
    (subView?: string, elementType?: string, actionName?: string): boolean => {
      if (!componentName) return true;
      const key = generateUiPermissionKey(componentName, subView, elementType, actionName);
      return perms.canUI(key);
    },
    [componentName, perms],
  );

  /**
   * Guarded execution: if the sub-permission is granted, execute callback.
   * Otherwise show "access denied" alert.
   */
  const guardAction = useCallback(
    async <T>(
      subView: string | undefined,
      elementType: string | undefined,
      actionName: string | undefined,
      fn: () => Promise<T>,
    ): Promise<T | undefined> => {
      if (can(subView, elementType, actionName)) {
        return fn();
      }
      swalAlert.error("Accès refusé — Vous n'avez pas les droits pour cette action.");
      return undefined;
    },
    [can],
  );

  /**
   * Guard by raw permission key (for cross-component checks).
   */
  const guardByKey = useCallback(
    async <T>(permKey: string, fn: () => Promise<T>): Promise<T | undefined> => {
      if (perms.canUI(permKey)) {
        return fn();
      }
      swalAlert.error("Accès refusé — Vous n'avez pas les droits pour cette action.");
      return undefined;
    },
    [perms],
  );

  /**
   * Guard API call: if the frontend API key is allowed, execute callback.
   */
  const guardApi = useCallback(
    async <T>(frontendApiKey: string, fn: () => Promise<T>): Promise<T | undefined> => {
      if (perms.canCallApi(frontendApiKey)) {
        return fn();
      }
      swalAlert.error("Accès refusé — Vous n'avez pas les droits pour cette action.");
      return undefined;
    },
    [perms],
  );

  return {
    // Base permissions (role flags, canUI, canCallApi, canAction, etc.)
    ...perms,
    // Scoped helpers
    canViewPage,
    can,
    guardAction,
    guardByKey,
    guardApi,
  };
}
