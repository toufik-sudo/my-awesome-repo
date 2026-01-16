import { useIntl } from 'react-intl';
import zxcvbn from 'zxcvbn';

import { createPasswordLabel } from 'services/FormServices';
import { passwordStrengthMeterFillSymbol, passwordStrengthMeterFillValue } from 'constants/forms';

/**
 * Hook used to return data for password strength meter
 * @param form
 * @param isPasswordChange
 */
export const usePasswordStrengthMeter = ({ form, isPasswordChange = false }) => {
  const intl = useIntl();
  const { score } = zxcvbn(isPasswordChange ? form.values.newPassword : form.values.createAccountPassword);
  const createPassLabel = (type: boolean) => createPasswordLabel(score, intl, type);
  const passwordStrengthMeterFill = score * passwordStrengthMeterFillValue + passwordStrengthMeterFillSymbol;

  return { passwordStrengthMeterFill, createPassLabel };
};
