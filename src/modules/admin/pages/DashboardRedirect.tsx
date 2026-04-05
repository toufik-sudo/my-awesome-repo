import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook that returns the redirect path for role-based dashboard routing.
 * Returns null for regular users (so default Dashboard renders).
 */
export function useDashboardRedirect(): string | null {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const role = user.role || 'user';

  if (role === 'hyper_admin' || role === 'hyper_manager') {
    return '/dashboard/hyper';
  }
  if (role === 'admin' || role === 'manager') {
    return '/dashboard/admin';
  }
  if (role === 'guest') {
    return '/dashboard/guest';
  }
  // 'user' role gets the UserDashboard
  return '/dashboard/user';
}

/**
 * Component version — kept for backward compatibility
 */
export const DashboardRedirect: React.FC = memo(() => {
  return null;
});

DashboardRedirect.displayName = 'DashboardRedirect';
