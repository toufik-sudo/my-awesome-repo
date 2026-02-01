// -----------------------------------------------------------------------------
// useAuth Hook
// Centralized authentication hook that syncs with Redux store and UserContext
// -----------------------------------------------------------------------------

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/store/useAppDispatch';
import { setUserLoggedIn, setGlobalLoading } from '@/store/actions/generalActions';
import { useUserContext } from '@/contexts/UserContext';
import { 
  login as authLogin, 
  logout as authLogout,
  forgotPassword as authForgotPassword,
  resetPassword as authResetPassword,
  activateAccount as authActivateAccount,
  isAuthenticated,
  getCurrentUser,
  LoginCredentials,
  AuthResponse,
  DecodedToken
} from '@/services/AuthService';
import { ROOT } from '@/constants/routes';

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  activateAccount: (uuid: string, token: string) => Promise<{ success: boolean; error?: string }>;
  checkAuthOnMount: () => void;
  isAuthenticated: () => boolean;
  getCurrentUser: () => DecodedToken | null;
}

/**
 * Custom hook that wraps AuthService with Redux store and UserContext sync
 */
export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { refreshUserData, clearUser } = useUserContext();

  /**
   * Login with credentials and sync with Redux + refresh user context
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    dispatch(setGlobalLoading(true));
    
    try {
      const result = await authLogin(credentials);
      
      if (result.success) {
        dispatch(setUserLoggedIn(true));
        // Refresh user data in context after successful login
        refreshUserData();
      }
      
      return result;
    } finally {
      dispatch(setGlobalLoading(false));
    }
  }, [dispatch, refreshUserData]);

  /**
   * Logout and clear Redux state + UserContext
   */
  const logout = useCallback(() => {
    authLogout();
    dispatch(setUserLoggedIn(false));
    // Clear user data from context and cookies
    clearUser();
    navigate(ROOT);
  }, [dispatch, navigate, clearUser]);

  /**
   * Request password reset
   */
  const forgotPassword = useCallback(async (email: string) => {
    dispatch(setGlobalLoading(true));
    
    try {
      return await authForgotPassword(email);
    } finally {
      dispatch(setGlobalLoading(false));
    }
  }, [dispatch]);

  /**
   * Reset password with token
   */
  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    dispatch(setGlobalLoading(true));
    
    try {
      return await authResetPassword(token, newPassword);
    } finally {
      dispatch(setGlobalLoading(false));
    }
  }, [dispatch]);

  /**
   * Activate account with uuid and token
   */
  const activateAccount = useCallback(async (uuid: string, token: string) => {
    dispatch(setGlobalLoading(true));
    
    try {
      return await authActivateAccount(uuid, token);
    } finally {
      dispatch(setGlobalLoading(false));
    }
  }, [dispatch]);

  /**
   * Check authentication status on app mount and sync with Redux
   */
  const checkAuthOnMount = useCallback(() => {
    const authenticated = isAuthenticated();
    dispatch(setUserLoggedIn(authenticated));
    if (authenticated) {
      refreshUserData();
    }
  }, [dispatch, refreshUserData]);

  return {
    login,
    logout,
    forgotPassword,
    resetPassword,
    activateAccount,
    checkAuthOnMount,
    isAuthenticated,
    getCurrentUser
  };
};

export default useAuth;
