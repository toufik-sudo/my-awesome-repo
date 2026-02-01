// -----------------------------------------------------------------------------
// Auth Provider
// Initializes authentication state on app load
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/store/useAppDispatch';
import { setUserLoggedIn } from '@/store/actions/generalActions';
import { isAuthenticated as checkAuth } from '@/services/AuthService';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - Checks for existing session on app load
 * and syncs authentication state with Redux store
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check existing auth state on mount
    const authenticated = checkAuth();
    dispatch(setUserLoggedIn(authenticated));
    setIsInitialized(true);
  }, [dispatch]);

  // Show nothing while initializing to prevent flash of wrong content
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
