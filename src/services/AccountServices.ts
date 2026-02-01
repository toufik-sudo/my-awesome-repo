/**
 * Account Services
 * Migrated from old_app/src/services/AccountServices.ts
 */

import Cookies from 'js-cookie';
import * as jose from 'jose';
import { updateSelectedPlatform, setUUIDCookie } from '@/services/UserDataServices';

// Constants
export const AUTHORIZATION_TOKEN = 'authorizationToken';
export const BEARER = 'Bearer ';
export const USER_DETAILS_COOKIE = 'userDetails';
export const USER_STEP_COOKIE = 'userStep';

export const USER_COOKIE_FIELDS = {
  PLATFORM_ID: 'platformId',
  PLATFORM_TYPE_ID: 'platformTypeId',
  PLATFORM_TYPE_LABEL: 'platformTypeLabel',
  STEP: 'step',
  UUID: 'uuid',
  EMAIL: 'email',
  ROLE: 'role'
};

/**
 * Redirect routes based on step
 */
export const REDIRECT_STEP_ROUTES: Record<number, string> = {
  1: '/onboarding/register',
  2: '/onboarding/verify',
  3: '/onboarding/complete',
  4: '/wall'
};

/**
 * Method manages redirect based on the last uncompleted step
 * @param navigate - React Router navigate function
 * @param currentStep - Current step number
 */
export const redirectManager = (navigate: (path: string) => void, currentStep: number): void => {
  const route = REDIRECT_STEP_ROUTES[currentStep];
  if (route) {
    navigate(route);
  }
};

/**
 * Method manages redirect to a custom wall URL
 * @param navigate - React Router navigate function
 * @param url - URL to redirect to
 */
export const redirectCustomWall = (navigate: (path: string) => void, url: string): void => {
  navigate(url);
};

/**
 * Decode JWT token (browser-compatible using jose)
 * @param token - JWT token string
 */
export const decodeToken = (token: string): Record<string, any> | null => {
  try {
    // jose.decodeJwt decodes the payload without verification
    return jose.decodeJwt(token);
  } catch {
    return null;
  }
};

/**
 * Method adds the authorization token and decoded token to cookies
 * @param authorization - Authorization header value
 */
export const handleUserAuthorizationToken = (authorization: string): Record<string, any> | null => {
  const token = authorization.replace(BEARER, '');
  const decodedToken = decodeToken(token);

  if (!decodedToken) {
    return null;
  }

  // Update selected platform
  updateSelectedPlatform({
    selectedPlatform: {
      id: decodedToken[USER_COOKIE_FIELDS.PLATFORM_ID] || undefined
    }
  });

  // Set cookies
  Cookies.set(AUTHORIZATION_TOKEN, authorization);
  Cookies.set(USER_DETAILS_COOKIE, JSON.stringify(decodedToken));
  Cookies.set(USER_STEP_COOKIE, String(decodedToken.step));

  // Set UUID cookie
  if (decodedToken.uuid) {
    setUUIDCookie(decodedToken.uuid);
  }

  return decodedToken;
};

/**
 * Get the authorization token from cookies
 */
export const getAuthorizationToken = (): string | undefined => {
  return Cookies.get(AUTHORIZATION_TOKEN);
};

/**
 * Remove authorization token and user data from cookies (logout)
 */
export const clearAuthCookies = (): void => {
  Cookies.remove(AUTHORIZATION_TOKEN);
  Cookies.remove(USER_DETAILS_COOKIE);
  Cookies.remove(USER_STEP_COOKIE);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthorizationToken();
};

/**
 * Method returns class if the image finished loading
 * @param imgLoaded - Whether image is loaded
 * @param userWrapperLoaded - CSS class for loaded state
 */
export const getLoadedClass = (imgLoaded: boolean, userWrapperLoaded: string): string =>
  imgLoaded ? userWrapperLoaded : '';

/**
 * Get current user step from cookie
 */
export const getUserStep = (): number | null => {
  const stepCookie = Cookies.get(USER_STEP_COOKIE);
  if (stepCookie) {
    return parseInt(stepCookie, 10);
  }
  return null;
};

/**
 * Get user details from account cookie (internal use)
 * Note: Use getUserDetails from UserDataServices for general usage
 */
export const getAccountUserDetails = (): Record<string, any> | null => {
  const userCookie = Cookies.get(USER_DETAILS_COOKIE);
  if (userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch {
      return null;
    }
  }
  return null;
};
