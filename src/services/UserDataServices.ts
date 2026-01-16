import Cookies from 'js-cookie';
import qs from 'qs';

import {
  USER_DETAILS_COOKIE,
  SELECTED_PLATFORM_COOKIE,
  USER_COOKIE_FIELDS,
  UUID,
  ALL_USER_COOKIES,
  USER_LOCAL_STORAGE_SLICES,
  USER_STEP_COOKIE
} from 'constants/general';
import { removeLocalSlice } from 'utils/LocalStorageUtils';
import { PLATFORM_ID } from 'constants/routes';
import { PROGRAM_ID } from 'constants/wall/launch';

/**
 * Clears stored user-related data.
 */
export const clearUserData = () => {
  ALL_USER_COOKIES.forEach(cookie => Cookies.remove(cookie));
  USER_LOCAL_STORAGE_SLICES.forEach(slice => removeLocalSlice(slice));
};

/**
 * Returns whether current user details are present in storage.
 */
export const areUserDetailsPresent = () => !!Cookies.get(USER_DETAILS_COOKIE);

/**
 * Returns the user's uuid present in storage
 */
export const getUserUuid = () => getUserDetails()[USER_COOKIE_FIELDS.UUID];

export const saveUserData = userData => {
  Cookies.set(USER_STEP_COOKIE, userData.step);
  const userDetails: any = JSON.parse(Cookies.get(USER_DETAILS_COOKIE));
  Cookies.set(
    USER_DETAILS_COOKIE,
    JSON.stringify({ ...userDetails, [USER_COOKIE_FIELDS.INVITATIONS_ROLES]: userData.invitationsRoles })
  );
  setUserHighestRole(userData.highestRole);
};

/**
 * Saves user role to storage.
 * @param role
 */
const setUserHighestRole = role => {
  const userDetails = getUserDetails();
  setUserDetails({ ...userDetails, hr: role });
};

/**
 * Returns user role from storage
 */
export const getUserHighestRole = () => getUserDetails().hr;

/**
 * Parses a given cookie slice and checks the type of the value
 * else it returns the default value
 *
 * @param cookieSlice
 * @param typeCast
 * @param defaultValue
 */
const retrieveCookieData = (cookieSlice, defaultValue = {}, typeCast = 'object') => {
  try {
    const maybeValue = JSON.parse(Cookies.get(cookieSlice));
    if (maybeValue != null && typeof maybeValue === typeCast) {
      return maybeValue;
    }
  } catch (e) {
    //do nothing
  }
  return defaultValue;
};

/**
 * Returns the program selected on cookie or an empty object
 */
export const getSessionSelectedPlatform = () => {
  return retrieveCookieData(SELECTED_PLATFORM_COOKIE);
};

/**
 * Handles the retrieval of platform related data from local storage or ignores it based on provided query params
 */
export const getValidPlatformData = () => {
  const parsedPath = qs.parse(window.location.search.slice(1));
  if (Number(parsedPath[PLATFORM_ID]) || Number(parsedPath[PROGRAM_ID])) {
    return {};
  }

  return retrieveCookieData(SELECTED_PLATFORM_COOKIE);
};

/**
 * Returns the program selected on cookie or an empty object
 */
export const getUserSessionSelectedPlatform = () => {
  return getUserDetails()[USER_COOKIE_FIELDS.PLATFORM_ID];
};

export const getUserPlatform = () => {
  const userDetails = getUserDetails();

  return {
    id: userDetails[USER_COOKIE_FIELDS.PLATFORM_ID],
    platformType: { name: userDetails[USER_COOKIE_FIELDS.PLATFORM_TYPE_LABEL] }
  };
};

export const getUserDetails = () => retrieveCookieData(USER_DETAILS_COOKIE);

const setUserDetails = details => Cookies.set(USER_DETAILS_COOKIE, details);

/**
 *
 * @param updateObject
 */
export const updateSelectedPlatform = (updateObject?: any): void => {
  if (!updateObject) {
    Cookies.remove(SELECTED_PLATFORM_COOKIE);
    return;
  }
  const mergedObject = { ...getSessionSelectedPlatform(), ...updateObject };
  Cookies.set(SELECTED_PLATFORM_COOKIE, JSON.stringify(mergedObject));
};

/**
 * Sets the uuid cookie
 * @param uuid
 */
export const setUUIDCookie = uuid => {
  return Cookies.set(UUID, uuid);
};

/**
 * Checks if userData has paypalLink and concatenates https://
 * to that string if it doesn't have it for external redirect purposes
 *
 * @param userData
 */
export const getExternalUserPaypalLink = userData => {
  const link = userData.paypalLink.startsWith('https://') ? userData.paypalLink : 'https://' + userData.paypalLink;

  return { link };
};
