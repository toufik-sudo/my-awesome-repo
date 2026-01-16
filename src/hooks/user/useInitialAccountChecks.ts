import { useEffect } from 'react';

import { FORM_FIELDS } from 'constants/forms';

/**
 * Hook used to prepare error and scroll to paypalLink when user accesses account details page
 */
export const useInitialAccountChecks = state => {
  const initialErrors = state && state.missingPaypalLink ? { [FORM_FIELDS.PAYPAL]: 'missingPaypalLink' } : {};
  const initialTouched = state && state.missingPaypalLink ? { [FORM_FIELDS.PAYPAL]: true } : {};

  useEffect(() => {
    if (state && state.missingPaypalLink) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [state]);

  return { initialErrors, initialTouched };
};
