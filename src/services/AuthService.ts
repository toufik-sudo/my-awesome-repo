// -----------------------------------------------------------------------------
// Authentication Service
// Handles login, logout, password reset, and token management
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { 
  LOGIN_ENDPOINT, 
  FORGOT_PASSWORD_ENDPOINT, 
  RESET_PASSWORD_ENDPOINT,
  VALIDATE_TOKEN,
  USERS,
  STATUS,
  HTTP_USER_NOT_ACTIVATED
} from '@/constants/api';
import { 
  AUTHORIZATION_TOKEN, 
  BEARER, 
  USER_DETAILS_COOKIE, 
  USER_STEP_COOKIE,
  USER_COOKIE_FIELDS
} from '@/constants/general';
import { clearUserData, setUUIDCookie, updateSelectedPlatform } from '@/services/UserDataServices';
import { decodeJwt } from 'jose';

export { HTTP_USER_NOT_ACTIVATED };

// Cookie helpers
const setCookie = (name: string, value: string, days = 7): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DecodedToken {
  uuid: string;
  step: number;
  platformId?: number;
  platformTypeLabel?: string;
  invitationsRoles?: unknown[];
  hr?: number;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  decodedToken?: DecodedToken;
  error?: string;
  errorCode?: number;
}

/**
 * Handles the authorization token after successful login
 * Decodes JWT and stores user data in cookies
 */
export const handleUserAuthorizationToken = (authorization: string): DecodedToken => {
  const token = authorization.replace(BEARER, '');
  const decodedToken = decodeJwt(token) as DecodedToken;
  
  updateSelectedPlatform({ 
    id: decodedToken[USER_COOKIE_FIELDS.PLATFORM_ID] || undefined 
  });
  
  setCookie(AUTHORIZATION_TOKEN, authorization);
  setCookie(USER_DETAILS_COOKIE, JSON.stringify(decodedToken));
  setCookie(USER_STEP_COOKIE, String(decodedToken.step));
  setUUIDCookie(decodedToken.uuid);

  return decodedToken;
};

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance(false).post(LOGIN_ENDPOINT, credentials);
    const authorization = response.headers.authorization;
    
    if (authorization) {
      const decodedToken = handleUserAuthorizationToken(authorization);
      return {
        success: true,
        token: authorization,
        decodedToken
      };
    }
    
    return {
      success: false,
      error: 'No authorization token received'
    };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { code?: number; message?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Login failed',
      errorCode: axiosError.response?.data?.code
    };
  }
};

/**
 * Logout user - clear all stored data
 */
export const logout = (): void => {
  clearUserData();
};

/**
 * Request password reset email
 */
export const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await axiosInstance(false).post(FORGOT_PASSWORD_ENDPOINT, { email });
    return { success: true };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to send reset email'
    };
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string, 
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await axiosInstance(false).patch(RESET_PASSWORD_ENDPOINT, { 
      token, 
      password: newPassword 
    });
    return { success: true };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to reset password'
    };
  }
};

/**
 * Validate token (for password reset or email activation)
 */
export const validateToken = async (token: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    await axiosInstance(false).post(VALIDATE_TOKEN, { token });
    return { valid: true };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return {
      valid: false,
      error: axiosError.response?.data?.message || 'Invalid or expired token'
    };
  }
};

/**
 * Activate account with uuid and token
 */
export const activateAccount = async (
  uuid: string, 
  token: string, 
  operation: string = 'activate'
): Promise<{ success: boolean; error?: string }> => {
  try {
    await axiosInstance(false).patch(`${USERS}/${uuid}${STATUS}`, { token, operation });
    return { success: true };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to activate account'
    };
  }
};

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };
  
  const token = getCookie(AUTHORIZATION_TOKEN);
  if (!token) return false;
  
  try {
    const jwtToken = token.replace(BEARER, '');
    const decoded = decodeJwt(jwtToken) as DecodedToken;
    
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      clearUserData();
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Get current user from stored token
 */
export const getCurrentUser = (): DecodedToken | null => {
  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };
  
  const userDetails = getCookie(USER_DETAILS_COOKIE);
  if (!userDetails) return null;
  
  try {
    return JSON.parse(userDetails) as DecodedToken;
  } catch {
    return null;
  }
};

// Export as AuthService object for convenient usage
export const AuthService = {
  login,
  logout,
  forgotPassword,
  resetPassword,
  validateToken,
  activateAccount,
  isAuthenticated,
  getCurrentUser,
  handleUserAuthorizationToken,
};
