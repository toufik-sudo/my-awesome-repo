import Cookies from 'js-cookie';

import axiosInstance from 'config/axiosConfig';
import PaymentApi from 'api/PaymentApi';
import PlatformApi from 'api/PlatformApi';
import { SET_CURRENT_STEP } from 'constants/api';
import {
  PAYMENT_METHOD,
  PERSONAL_INFORMATION_ROUTE,
  REDIRECT_MAPPING,
  WELCOME_PAGE_ROUTE,
  ONBOARDING_SUCCESS
} from 'constants/routes';
import { USER_DETAILS_COOKIE, USER_STEP_COOKIE, USER_COOKIE_FIELDS } from 'constants/general';
import { getUserCookie, checkIsFreePlanCookie } from 'utils/general';
import { IArrayKey } from 'interfaces/IGeneral';
import { updateSelectedPlatform } from 'services/UserDataServices';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';

/**
 * Method used to get the session id for Stripe
 */
export const getSessionId = async () => {
  const paymentApi = new PaymentApi();
  const platformApi = new PlatformApi();

  const platformId = getUserCookie(USER_COOKIE_FIELDS.PLATFORM_ID);
  const { frequencyOfPaymentId } = await platformApi.getPlatformDetails(platformId);
  const data = await paymentApi.createSubscription({ frequencyOfPaymentId, platformId });

  return data.checkoutSessionId;
};

/**
 * Method set the current step of the user boarding process
 */
export const setCurrentStep = (step: number) => axiosInstance().put(SET_CURRENT_STEP, { step });

/**
 * Create platform after user chooses his payment method
 *
 * @param platformId
 * @param history: object
 * @param frequencyId: number|null
 */
export const createPlatform = async (platformId, history: object, frequencyId?: number) => {
  const platformApi = new PlatformApi();
  if (platformId) {
    await platformApi.updatePlatform(platformId, {
      platformType: getUserCookie(USER_COOKIE_FIELDS.PLATFORM_TYPE_ID),
      frequencyOfPayment: frequencyId
    });
    await handleFrequencyPlanSelection();

    return;
  }

  let payload: IArrayKey<number> = {
    platformType: getUserCookie(USER_COOKIE_FIELDS.PLATFORM_TYPE_ID),
    hierarchicType: PLATFORM_HIERARCHIC_TYPE.INDEPENDENT
  };

  if (frequencyId) payload = { ...payload, frequencyOfPayment: frequencyId };

  const data = await platformApi.createPlatform(payload);
  const userData = JSON.parse(Cookies.get(USER_DETAILS_COOKIE));
  updateSelectedPlatform({ selectedPlatform: { id: data.platformId } });
  Cookies.set(USER_DETAILS_COOKIE, JSON.stringify({ ...userData, platformId: data.platformId }));
  await handleFrequencyPlanSelection();
};

/**
 * Method handles redirect after user information success
 */
export const handleUpdateUserInformationRedirect = async () => {
  let redirectStep = REDIRECT_MAPPING.PAYMENT_METHOD_STEP;
  const isFreePlan = checkIsFreePlanCookie();
  if (isFreePlan) redirectStep = REDIRECT_MAPPING.WALL_ROUTE_STEP;
  const userDetails: any = JSON.parse(Cookies.get(USER_DETAILS_COOKIE));
  if (userDetails.invitedToPlatform) redirectStep = REDIRECT_MAPPING.PAYMENT_SUCCESS_STEP;
  Cookies.set(USER_STEP_COOKIE, JSON.stringify(redirectStep));

  await setCurrentStep(redirectStep);
  let location = WELCOME_PAGE_ROUTE;

  if (!isFreePlan) {
    location = PAYMENT_METHOD;
  }
  if (userDetails.invitedToPlatform) {
    location = ONBOARDING_SUCCESS;
  }

  window.location = location as any;
};

/**
 * Method handles redirect after frequency plan selection
 */
export const handleFrequencyPlanSelection = async () => {
  await setCurrentStep(REDIRECT_MAPPING.PERSONAL_INFORMATION_STEP);

  window.location = (PERSONAL_INFORMATION_ROUTE as unknown) as Location;
};
