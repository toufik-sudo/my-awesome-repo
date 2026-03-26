import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { ADMIN_ROUTES } from '../admin.constants';

/**
 * Smart redirect component: routes users to the correct dashboard 
 * based on their highest role.
 */
export const DashboardRedirect: React.FC = memo(() => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roles = user.roles || [];

  // Hyper managers go to hyper admin console
  if (roles.includes('hyper_manager')) {
    return <Navigate to={ADMIN_ROUTES.HYPER_DASHBOARD} replace />;
  }

  // Admins go to admin dashboard
  if (roles.includes('admin')) {
    return <Navigate to={ADMIN_ROUTES.ADMIN_DASHBOARD} replace />;
  }

  // Managers go to manager dashboard
  if (roles.includes('manager')) {
    return <Navigate to={ADMIN_ROUTES.MANAGER_DASHBOARD} replace />;
  }

  // Regular users stay on the general dashboard
  return null; // Will render the default Dashboard below
});

DashboardRedirect.displayName = 'DashboardRedirect';
