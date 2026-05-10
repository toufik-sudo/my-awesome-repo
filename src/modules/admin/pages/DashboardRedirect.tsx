import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

/**
 * Hook that returns the redirect path for role-based dashboard routing.
 * Waits for both auth and RBAC to be loaded before redirecting.
 * Returns null while loading (renders default Dashboard as fallback).
 */
export function useDashboardRedirect(): string | null {
  const { user, loading } = useAuth();
  const { frontendPermCache } = usePermissions();

  // Wait for auth AND RBAC cache to be loaded before deciding redirect
  if (loading || !user) return null;
  if (!frontendPermCache.loaded) return null;

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
