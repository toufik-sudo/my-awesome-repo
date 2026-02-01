import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { ROOT, WALL_ROUTE } from '@/constants/routes';
import { ROLE } from '@/constants/security/access';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { useUserRole } from '../hooks/useUserRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
  authorizedRoles?: ROLE[];
  unauthorizedRedirectRoute?: string;
}

/**
 * Route wrapper that redirects to login if the user is not authenticated
 * or if they don't have the required role.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  authorizedRoles,
  unauthorizedRedirectRoute = WALL_ROUTE 
}) => {
  const location = useLocation();
  const { formatMessage } = useIntl();
  const { isAuthenticated, isAuthDataLoaded } = useProtectedRoute();
  const userRole = useUserRole();

  // Check if user has required role
  if (userRole && authorizedRoles && !authorizedRoles.includes(userRole)) {
    toast.error(formatMessage({ id: 'toast.message.unauthorized.section' }));
    return (
      <Navigate 
        to={unauthorizedRedirectRoute} 
        state={{ prevLocation: location.pathname }} 
        replace 
      />
    );
  }

  if (!isAuthDataLoaded) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to={ROOT} 
        state={{ prevLocation: location.pathname }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
