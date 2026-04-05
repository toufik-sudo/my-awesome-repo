import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { DASHBOARD_ROUTES } from '@/routes/routes.constants';

interface PermissionRouteProps {
  children: React.ReactNode;
  /** Permission key from usePermissions convenience flags */
  requiredPermission?: keyof ReturnType<typeof usePermissions>;
  /** Custom check function using full permissions object */
  check?: (perms: ReturnType<typeof usePermissions>) => boolean;
  redirectTo?: string;
}

/**
 * Route guard that checks granular permissions (not just roles).
 * Use instead of ProtectedRoute.requiredRoles for permission-aware access.
 */
export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  requiredPermission,
  check,
  redirectTo = DASHBOARD_ROUTES.ROOT,
}) => {
  const { user, loading } = useAuth();
  const perms = usePermissions();

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

  // Check custom function or permission flag
  if (check && !check(perms)) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredPermission && !perms[requiredPermission]) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
