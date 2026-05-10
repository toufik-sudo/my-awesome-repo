import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector } from '@/store';
import {
  rbacLoadStart,
  rbacLoadSuccess,
  rbacLoadError,
  rbacClear,
  selectRbac,
} from '@/store/slices/rbac.slice';
import { rbacConfigApi, type RbacFrontendPermission } from '@/modules/admin/rbac-config.api';
import { permissionBindingsApi, type BindingMap } from '@/modules/admin/permission-bindings.api';
import { setRbacCache } from '@/lib/axios';
import Swal from 'sweetalert2';

interface RbacBootstrapProps {
  children: React.ReactNode;
}

/**
 * Bootstraps RBAC caches (frontend + backend permissions, bindings) into the
 * Redux store on every authenticated session start.
 *
 * - While loading → renders fullscreen spinner (blocks app routing).
 * - On error → shows SweetAlert popup and force-logout.
 * - On success → injects axios pre-flight cache and unblocks rendering.
 */
export const RbacBootstrap: React.FC<RbacBootstrapProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loading: authLoading, logout } = useAuth();
  const rbac = useAppSelector(selectRbac);
  const [attempt, setAttempt] = useState(0);
  console.log(`RBAC Bootstrap: render (user: ${user?.id || 'null'}, role: ${user?.role || 'n/a'}, authLoading: ${authLoading}, rbacLoading: ${rbac.loading}, rbacLoaded: ${rbac.loaded}, attempt: ${attempt})`);
  const load = useCallback(async () => {
    if (!user?.id) {
      console.warn('RBAC Bootstrap: No user ID found, skipping RBAC load');
      return;
    };
    const role = user.role || 'user';

    dispatch(rbacLoadStart());
    console.log(`RBAC Bootstrap: Loading permissions for user ${user.id} with role ${role} (attempt ${attempt + 1})`);
    try {
      const [frontendConfig, backendConfig, bindings, frontendPerms] = await Promise.all([
        rbacConfigApi.getFrontendByRole(role),
        rbacConfigApi.getBackendByRole(role).catch(() => ({})),
        permissionBindingsApi.getBindingMap().catch(() => ({} as BindingMap)),
        rbacConfigApi.getFrontendPermissions().catch(() => [] as RbacFrontendPermission[]),
      ]);

      const frontendPermByKey: Record<string, { allowed: boolean; user_roles: string[] }> = {};
      for (const fp of frontendPerms) {
        frontendPermByKey[fp.permission_key] = {
          allowed: fp.allowed,
          user_roles: fp.user_roles,
        };
      }

      dispatch(
        rbacLoadSuccess({
          rbacConfig: frontendConfig,
          backendPermsCache: backendConfig as any,
          bindingMap: bindings as BindingMap,
          frontendPermByKey,
          role,
          userId: user.id,
        }),
      );

      // Inject into axios pre-flight interceptor
      setRbacCache(backendConfig as any, bindings as any, role);
    } catch (err: any) {
      const msg = err?.message || 'Unable to load permissions';
      dispatch(rbacLoadError(msg));
      const result = await Swal.fire({
        icon: 'error',
        title: 'Permissions Loading Failed',
        text: 'We could not load your permissions. You will be logged out. Please try again.',
        confirmButtonText: 'Logout',
        showCancelButton: true,
        cancelButtonText: 'Retry',
        allowOutsideClick: false,
      });
      if (result.isConfirmed) {
        dispatch(rbacClear());
        await logout();
      } else {
        setAttempt(a => a + 1);
      }
    }
  }, [dispatch, user?.id, user?.role, logout, attempt]);

  // Track previous user.id to detect login transition (null → user)
  const prevUserIdRef = useRef<string | null>(null);

  // Trigger load on auth ready
  useEffect(() => {
    if (authLoading && !user) return;
    console.log(`RBAC Bootstrap: auth ready (user: ${user?.id || 'null'}, role: ${user?.role || 'n/a'})`);
    if (!user) {
      if (rbac.loaded) dispatch(rbacClear());
      prevUserIdRef.current = null;
      return;
    }
    const currentRole = user.role || 'user';
    const justLoggedIn = prevUserIdRef.current !== user.id;
    prevUserIdRef.current = user.id;

    const stale = rbac.userId !== user.id || rbac.role !== currentRole;
    const missingCachedPermissions =
      Object.keys(rbac.rbacConfig).length === 0 &&
      Object.keys(rbac.frontendPermByKey).length === 0 &&
      Object.keys(rbac.backendPermsCache).length === 0;
    console.log(`RBAC Bootstrap: auth ready for user ${user.id} (justLoggedIn: ${justLoggedIn}, stale: ${stale}, missingCache: ${missingCachedPermissions})`);
    if (justLoggedIn || stale || !rbac.loaded || missingCachedPermissions) {
      if (!rbac.loading) load();
    } else {
      // Re-inject axios cache on remount (rehydrated from localStorage)
      setRbacCache(rbac.backendPermsCache as any, rbac.bindingMap as any, rbac.role || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id, user?.role, attempt]);

  // While auth loading, render spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground">Initializing session…</p>
      </div>
    );
  }

  // Not authenticated → render app (login routes)
  if (!user) {
    return <>{children}</>;
  }

  // Authenticated but RBAC still loading → block with spinner
  if (rbac.loading || (!rbac.loaded && !rbac.error)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground">Loading permissions…</p>
      </div>
    );
  }

  // RBAC loaded → render app
  return <>{children}</>;
};
