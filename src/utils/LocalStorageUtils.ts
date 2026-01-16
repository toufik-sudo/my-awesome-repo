import { ONBOARDING_BENEFICIARY_COOKIE } from 'constants/general';

/**
 * Retrieves data used for beneficiary onboarding
 */
export const removeLocalSlice = slice => {
  localStorage.removeItem(slice);
};

/**
 * Retrieves data used for beneficiary onboarding
 */
export const storeOnboardingBeneficiaryCookie = values => {
  storeLocally(ONBOARDING_BENEFICIARY_COOKIE, { ...values, programId: Number(values.programId) });
};

/**
 * Stores a given value at particular key location
 * @param key
 * @param value
 */
const storeLocally = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Parses a given local storage slice and checks the type of the value
 * else it returns the default value
 *
 * @param slice
 * @param typeCast
 * @param defaultValue
 */
const retrieveLocalStorageData = (slice, defaultValue = {}, typeCast = 'object') => {
  try {
    const maybeValue = JSON.parse(localStorage.getItem(slice));
    if (maybeValue != null && typeof maybeValue === typeCast) {
      return maybeValue;
    }
  } catch (e) {
    //do nothing
  }
  return defaultValue;
};

/**
 * Retrieves data used for beneficiary onboarding
 */
export const retrieveOnboardingBeneficiaryCookie = () => {
  const data = retrieveLocalStorageData(ONBOARDING_BENEFICIARY_COOKIE);
  data.design = data.design || {};

  return data;
};
