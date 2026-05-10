import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { generateUiPermissionKey } from '@/utils/rbac/generate-ui-permission-key';
import { DASHBOARD_ROUTES } from '@/routes/routes.constants';

interface PermissionRouteProps {
  children: React.ReactNode;
  /**
   * Dynamic UI permission check: provide componentName (+ optional subView/elementType/actionName)
   * to generate and check a permission key like ui.<ComponentName>.Page.View
   */
  componentName?: string;
  subView?: string;
  elementType?: string;
  actionName?: string;
  /** Custom check function using full permissions object */
  check?: (perms: ReturnType<typeof usePermissions>) => boolean;
  redirectTo?: string;
}

/**
 * Route guard that checks dynamic RBAC permissions from rbac_frontend_permissions.
 *
 * @example
 *   <PermissionRoute componentName="PropertyListPage">
 *     <PropertyListing />
 *   </PermissionRoute>
 *   // → checks ui.PropertyListPage.Page.View
 *
 *   <PermissionRoute componentName="HyperDashboard">
 *     <HyperDashboard />
 *   </PermissionRoute>
 */
export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  componentName,
  subView,
  elementType = 'Page',
  actionName = 'View',
  check,
  redirectTo = DASHBOARD_ROUTES.ROOT,
}) => {
  const { user, loading } = useAuth();
  const perms = usePermissions();

  // Wait for auth to load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wait for RBAC cache to load before checking permissions
  if (!perms.frontendPermCache.loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Custom check function
  if (check && !check(perms)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Dynamic component-based check
  if (componentName) {
    const key = generateUiPermissionKey(componentName, subView, elementType, actionName);
    if (!perms.canUI(key)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
};
