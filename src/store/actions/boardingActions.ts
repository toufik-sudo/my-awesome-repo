import Cookies from 'js-cookie';
import axiosInstance from '@/config/axiosConfig';
import PaymentApi from '@/api/PaymentApi';
import { SET_CURRENT_STEP } from '@/constants/api';
import {
  PAYMENT_METHOD,
  PERSONAL_INFORMATION_ROUTE,
  WELCOME_PAGE_ROUTE,
  ONBOARDING_SUCCESS
} from '@/constants/routes';
import { USER_DETAILS_COOKIE, USER_STEP_COOKIE, USER_COOKIE_FIELDS } from '@/constants/general';
import { getUserCookie } from '@/utils/general';
import { updateSelectedPlatform } from '@/services/UserDataServices';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';

const checkIsFreePlanCookie = (): boolean => {
  const cookie = Cookies.get('isFreePlan');
  return cookie === 'true';
};

const REDIRECT_MAPPING = {
  PAYMENT_METHOD_STEP: 3,
  WALL_ROUTE_STEP: 5,
  PAYMENT_SUCCESS_STEP: 4,
  PERSONAL_INFORMATION_STEP: 2
};

interface IArrayKey<T> {
  [key: string]: T;
}

/**
 * Method used to get the session id for Stripe
 */
export const getSessionId = async (): Promise<string> => {
  const paymentApi = new PaymentApi();

  const platformId = getUserCookie(USER_COOKIE_FIELDS.PLATFORM_ID);
  const data = await paymentApi.createSubscription({ platformId }) as { checkoutSessionId: string };

  return data.checkoutSessionId;
};

/**
 * Method set the current step of the user boarding process
 */
export const setCurrentStep = (step: number): Promise<any> => {
  return axiosInstance().put(SET_CURRENT_STEP, { step });
};

/**
 * Create platform after user chooses his payment method
 *
 * @param platformId - Platform ID (if existing)
 * @param history - Router history object
 * @param frequencyId - Frequency of payment ID
 */
export const createPlatform = async (
  platformId: number | null,
  history: object,
  frequencyId?: number
): Promise<void> => {
  if (platformId) {
    await axiosInstance().patch(`/platforms/${platformId}`, {
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

  if (frequencyId) {
    payload = { ...payload, frequencyOfPayment: frequencyId };
  }

  const { data } = await axiosInstance().post('/platforms', payload);
  const userDataCookie = Cookies.get(USER_DETAILS_COOKIE);
  const userData = userDataCookie ? JSON.parse(userDataCookie) : {};
  
  updateSelectedPlatform({ selectedPlatform: { id: data.platformId } });
  Cookies.set(USER_DETAILS_COOKIE, JSON.stringify({ ...userData, platformId: data.platformId }));
  await handleFrequencyPlanSelection();
};

/**
 * Method handles redirect after user information success
 */
export const handleUpdateUserInformationRedirect = async (): Promise<void> => {
  let redirectStep = REDIRECT_MAPPING.PAYMENT_METHOD_STEP;
  const isFreePlan = checkIsFreePlanCookie();
  
  if (isFreePlan) {
    redirectStep = REDIRECT_MAPPING.WALL_ROUTE_STEP;
  }
  
  const userDetailsCookie = Cookies.get(USER_DETAILS_COOKIE);
  const userDetails: any = userDetailsCookie ? JSON.parse(userDetailsCookie) : {};
  
  if (userDetails.invitedToPlatform) {
    redirectStep = REDIRECT_MAPPING.PAYMENT_SUCCESS_STEP;
  }
  
  Cookies.set(USER_STEP_COOKIE, JSON.stringify(redirectStep));

  await setCurrentStep(redirectStep);
  
  let location = WELCOME_PAGE_ROUTE;

  if (!isFreePlan) {
    location = PAYMENT_METHOD;
  }
  if (userDetails.invitedToPlatform) {
    location = ONBOARDING_SUCCESS;
  }

  window.location.href = location;
};

/**
 * Method handles redirect after frequency plan selection
 */
export const handleFrequencyPlanSelection = async (): Promise<void> => {
  await setCurrentStep(REDIRECT_MAPPING.PERSONAL_INFORMATION_STEP);
  window.location.href = PERSONAL_INFORMATION_ROUTE;
};
