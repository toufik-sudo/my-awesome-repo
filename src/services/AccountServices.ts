import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

import {
  AUTHORIZATION_TOKEN,
  BEARER,
  USER_COOKIE_FIELDS,
  USER_DETAILS_COOKIE,
  USER_STEP_COOKIE
} from 'constants/general';
import { REDIRECT_STEP_ROUTES } from 'constants/routes';
import { setUUIDCookie, updateSelectedPlatform } from 'services/UserDataServices';

/**
 * Method manages redirect based on the last uncompleted step
 *
 * @param history
 * @param currentStep
 */
export const redirectManager = (history, currentStep) => history.push(REDIRECT_STEP_ROUTES[currentStep]);

/**
 * Method manages redirect based on the last uncompleted step
 *
 * @param history
 * @param currentStep
 */
export const redirectCustomWall = (history, url) => history.push(url);

/**
 * Method adds the authorization token and decoded token to cookies
 *
 * @param authorization
 */
export const handleUserAuthorizationToken = authorization => {
  const token = authorization.replace(BEARER, '');
  const decodedToken = jwt.decode(token);
  updateSelectedPlatform({ selectedPlatform: { id: decodedToken[USER_COOKIE_FIELDS.PLATFORM_ID] || undefined } });
  Cookies.set(AUTHORIZATION_TOKEN, authorization);
  Cookies.set(USER_DETAILS_COOKIE, JSON.stringify(decodedToken));
  Cookies.set(USER_STEP_COOKIE, decodedToken.step);
  setUUIDCookie(decodedToken.uuid);

  return decodedToken;
};

/**
 * Method returns class if the image finished loading
 *
 * @param imgLoaded
 * @param userWrapperLoaded
 */
export const getLoadedClass = (imgLoaded, userWrapperLoaded) => (imgLoaded ? userWrapperLoaded : '');
