import { IFormField } from 'interfaces/forms/IForm';
import { isFieldRequired } from 'services/FormServices';

import { ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE } from 'constants/routes';
import { ERROR_CODES, REGISTER_PAGE_STEPS } from 'constants/onboarding/general';
import { ONBOARDING_BENEFICIARY_REGISTER_STEPS } from 'constants/onboarding/onboarding';
import { REGISTER_DATA_COOKIE } from 'constants/general';
import { getLocalStorage, setLocalStorage } from 'services/StorageServies';

/**
 * Method returns the current step component
 * @param step
 * @param steps
 */
export const getActiveRegisterComponent = (step, steps) => {
  return (steps[parseInt(step, 10) - 1] && steps[parseInt(step, 10) - 1].component) || steps[0].component;
};

/**
 * Method returns fields for register form
 * @param data
 * @param formFields
 */
export const prepareFieldsValue = (data, formFields) => {
  return formFields.map((field: IFormField) => {
    const { label } = field;
    const isRequired = isFieldRequired(field);
    const registerDataCookie = getLocalStorage(REGISTER_DATA_COOKIE);

    if (isRequired || data.includes(label)) {
      const value = (registerDataCookie && registerDataCookie[label]) || data[label];

      return { ...field, initialValue: value ? value : '' };
    }
  });
};

/**
 * Method returns the first element step that is not completed
 * @param data
 */
export const getCompletedSteps = data => {
  const enabledPages = [];
  ONBOARDING_BENEFICIARY_REGISTER_STEPS.forEach(key => {
    if (!data[key.name]) {
      enabledPages.push({ step: key.index });
    }
  });

  return enabledPages[0];
};

/**
 * Method returns default route for register page
 * @param step
 * @param history
 */
export const ensureSafeRoute = (step, history) => {
  if (!ONBOARDING_BENEFICIARY_REGISTER_STEPS[parseInt(step, 10) - 1]) {
    return history.replace(`${ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE}${REGISTER_PAGE_STEPS.TITLE}`);
  }
};

/**
 * Methos returns the page that contains the error sent from BE
 * @param data
 * @param formatMessage
 */
export const getPageErrorDetails = (data, formatMessage) => {
  let error = null;
  const { message, code } = data;
  const registerErrorText = 'form.validation.';

  if (!data || code === ERROR_CODES.INTERNAL_SERVER) {
    error = {
      step: REGISTER_PAGE_STEPS.PASSWORD,
      error: message || formatMessage({ id: 'form.validation.generic.error' })
    };
  }

  ONBOARDING_BENEFICIARY_REGISTER_STEPS.forEach(key => {
    if (key.errorCodes.indexOf(code) !== -1) {
      const errorMessage =
        code === ERROR_CODES.DUPLICATE_VALUE
          ? formatMessage({ id: 'onboarding.register.error.1013' })
          : formatMessage({ id: `${registerErrorText}${code}` });
      error = { step: key.index, error: errorMessage };
    }
  });

  return error;
};

/**
 * Method handles the error received from BE
 * @param setPageWithError
 * @param dispatch
 * @param error
 * @param history
 * @param formatMessage
 */
export const goToErrorPage = (setPageWithError, dispatch, error, history, formatMessage) => {
  const pageWithError = getPageErrorDetails(error, formatMessage);
  setPageWithError(pageWithError);
  const data = getLocalStorage(REGISTER_DATA_COOKIE);
  data.createAccountPassword = null;
  data.passwordConfirmation = null;
  setLocalStorage(REGISTER_DATA_COOKIE, { ...data });
  history.push(`${ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE}${pageWithError.step}`);
};
