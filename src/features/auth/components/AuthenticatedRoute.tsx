import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { WALL_ROUTE } from '@/constants/routes';
import { USER_DETAILS_COOKIE } from '@/constants/general';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

/**
 * Route wrapper that redirects to wall page if the user is already authenticated.
 * For use with public routes that shouldn't be accessible to logged-in users.
 */
const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isAuthDataLoaded } = useProtectedRoute();
  const userDetailsCookie = Cookies.get(USER_DETAILS_COOKIE);

  // Reload if authenticated but missing user details cookie
  if (!userDetailsCookie && isAuthenticated) {
    window.location.reload();
    return null;
  }

  if (!isAuthDataLoaded) {
    return null; // Or a loading spinner
  }

  if (isAuthenticated) {
    return (
      <Navigate 
        to={WALL_ROUTE} 
        state={{ prevLocation: location.pathname }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
