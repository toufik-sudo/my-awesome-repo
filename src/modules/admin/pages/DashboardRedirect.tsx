import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook that returns the redirect path for role-based dashboard routing.
 * Returns null for regular users (so GuestDashboard renders).
 */
export function useDashboardRedirect(): string | null {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const roles = user.roles || [];

  if (roles.includes('hyper_admin') || roles.includes('hyper_manager')) {
    return '/dashboard/hyper';
  }
  if (roles.includes('admin') || roles.includes('manager')) {
    return '/dashboard/admin';
  }

  return null;
}

/**
 * Component version — kept for backward compatibility
 */
export const DashboardRedirect: React.FC = memo(() => {
  return null;
});

DashboardRedirect.displayName = 'DashboardRedirect';
