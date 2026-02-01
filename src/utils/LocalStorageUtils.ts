// -----------------------------------------------------------------------------
// Local Storage Utilities
// Migrated from old_app/src/utils/LocalStorageUtils.ts
// -----------------------------------------------------------------------------

import { ONBOARDING_BENEFICIARY_COOKIE } from '@/constants/general';

/**
 * Removes a slice from local storage
 */
export const removeLocalSlice = (slice: string): void => {
  localStorage.removeItem(slice);
};

/**
 * Stores a given value at a particular key location
 */
export const storeLocally = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Parses a given local storage slice and checks the type of the value
 * else it returns the default value
 */
export const retrieveLocalStorageData = <T>(
  slice: string, 
  defaultValue: T = {} as T, 
  typeCast: string = 'object'
): T => {
  try {
    const storedValue = localStorage.getItem(slice);
    if (storedValue) {
      const maybeValue = JSON.parse(storedValue);
      if (maybeValue != null && typeof maybeValue === typeCast) {
        return maybeValue as T;
      }
    }
  } catch {
    // Silently handle parsing errors
  }
  return defaultValue;
};

interface OnboardingBeneficiaryData {
  programId?: number;
  design?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Stores data used for beneficiary onboarding
 */
export const storeOnboardingBeneficiaryCookie = (values: Record<string, unknown>): void => {
  storeLocally(ONBOARDING_BENEFICIARY_COOKIE, { 
    ...values, 
    programId: Number(values.programId) 
  });
};

/**
 * Retrieves data used for beneficiary onboarding
 */
export const retrieveOnboardingBeneficiaryCookie = (): OnboardingBeneficiaryData => {
  const data = retrieveLocalStorageData<OnboardingBeneficiaryData>(ONBOARDING_BENEFICIARY_COOKIE, {});
  data.design = data.design || {};
  return data;
};
