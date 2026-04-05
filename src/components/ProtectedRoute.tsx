import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';
import type { AppRole } from '@/modules/auth/auth.types';
import { canMakeBooking } from '@/modules/auth/auth.types';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRoles?: AppRole[];
  redirectTo?: string;
  /** If true, only roles allowed to book can access this route */
  requireBookingAccess?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requiredRoles = [],
  redirectTo = '/login',
  requireBookingAccess = false,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRoles.length > 0 && user) {
    const userRole = user.role || 'user';
    const hasRequiredRole = requiredRoles.includes(userRole);
    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Booking restriction: hyper_admin, hyper_manager, admin cannot book
  if (requireBookingAccess && user) {
    const userRole = user.role || 'user';
    if (!canMakeBooking(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
