// -----------------------------------------------------------------------------
// User Data Services
// Migrated from old_app/src/services/UserDataServices.ts
// -----------------------------------------------------------------------------

import { 
  USER_DETAILS_COOKIE,
  SELECTED_PLATFORM_COOKIE,
  USER_COOKIE_FIELDS,
  UUID,
  ALL_USER_COOKIES,
  USER_LOCAL_STORAGE_SLICES,
  USER_STEP_COOKIE
} from '@/constants/general';
import { removeLocalSlice } from '@/utils/LocalStorageUtils';

// Cookie helpers
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

const setCookie = (name: string, value: string, days = 7): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const removeCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Parses a given cookie slice and checks the type of the value
 */
const retrieveCookieData = <T>(
  cookieSlice: string, 
  defaultValue: T = {} as T, 
  typeCast: string = 'object'
): T => {
  try {
    const cookieValue = getCookie(cookieSlice);
    if (cookieValue) {
      const maybeValue = JSON.parse(cookieValue);
      if (maybeValue != null && typeof maybeValue === typeCast) {
        return maybeValue as T;
      }
    }
  } catch {
    // Silently handle parsing errors
  }
  return defaultValue;
};

/**
 * Clears stored user-related data.
 */
export const clearUserData = (): void => {
  ALL_USER_COOKIES.forEach(cookie => removeCookie(cookie));
  USER_LOCAL_STORAGE_SLICES.forEach(slice => removeLocalSlice(slice));
};

/**
 * Returns whether current user details are present in storage.
 */
export const areUserDetailsPresent = (): boolean => !!getCookie(USER_DETAILS_COOKIE);

interface UserDetails {
  [USER_COOKIE_FIELDS.UUID]?: string;
  [USER_COOKIE_FIELDS.PLATFORM_ID]?: number;
  [USER_COOKIE_FIELDS.PLATFORM_TYPE_LABEL]?: string;
  [USER_COOKIE_FIELDS.INVITATIONS_ROLES]?: unknown[];
  hr?: number;
  [key: string]: unknown;
}

/**
 * Returns user details from cookie
 */
export const getUserDetails = (): UserDetails => retrieveCookieData<UserDetails>(USER_DETAILS_COOKIE, {});

/**
 * Sets user details cookie
 */
const setUserDetails = (details: UserDetails): void => {
  setCookie(USER_DETAILS_COOKIE, JSON.stringify(details));
};

/**
 * Returns the user's uuid present in storage
 */
export const getUserUuid = (): string | undefined => getUserDetails()[USER_COOKIE_FIELDS.UUID];

/**
 * Returns user role from storage
 */
export const getUserHighestRole = (): number | undefined => getUserDetails().hr;

/**
 * Saves user role to storage.
 */
const setUserHighestRole = (role: number): void => {
  const userDetails = getUserDetails();
  setUserDetails({ ...userDetails, hr: role });
};

interface UserData {
  step?: number;
  invitationsRoles?: unknown[];
  highestRole?: number;
}

export const saveUserData = (userData: UserData): void => {
  if (userData.step !== undefined) {
    setCookie(USER_STEP_COOKIE, String(userData.step));
  }
  const userDetails = getUserDetails();
  setUserDetails({ 
    ...userDetails, 
    [USER_COOKIE_FIELDS.INVITATIONS_ROLES]: userData.invitationsRoles 
  });
  if (userData.highestRole !== undefined) {
    setUserHighestRole(userData.highestRole);
  }
};

interface PlatformData {
  id?: number;
  role?: number;
  [key: string]: unknown;
}

/**
 * Returns the program selected on cookie or an empty object
 */
export const getSessionSelectedPlatform = (): PlatformData => {
  return retrieveCookieData<PlatformData>(SELECTED_PLATFORM_COOKIE, {});
};

/**
 * Returns the user's session selected platform
 */
export const getUserSessionSelectedPlatform = (): number | undefined => {
  return getUserDetails()[USER_COOKIE_FIELDS.PLATFORM_ID];
};

export const getUserPlatform = (): { id?: number; platformType: { name?: string } } => {
  const userDetails = getUserDetails();
  return {
    id: userDetails[USER_COOKIE_FIELDS.PLATFORM_ID],
    platformType: { name: userDetails[USER_COOKIE_FIELDS.PLATFORM_TYPE_LABEL] }
  };
};

/**
 * Updates selected platform cookie
 */
export const updateSelectedPlatform = (updateObject?: PlatformData): void => {
  if (!updateObject) {
    removeCookie(SELECTED_PLATFORM_COOKIE);
    return;
  }
  const mergedObject = { ...getSessionSelectedPlatform(), ...updateObject };
  setCookie(SELECTED_PLATFORM_COOKIE, JSON.stringify(mergedObject));
};

/**
 * Sets the uuid cookie
 */
export const setUUIDCookie = (uuid: string): void => {
  setCookie(UUID, uuid);
};

/**
 * Checks if userData has paypalLink and concatenates https://
 */
export const getExternalUserPaypalLink = (userData: { paypalLink: string }): { link: string } => {
  const link = userData.paypalLink.startsWith('https://') 
    ? userData.paypalLink 
    : 'https://' + userData.paypalLink;
  return { link };
};
