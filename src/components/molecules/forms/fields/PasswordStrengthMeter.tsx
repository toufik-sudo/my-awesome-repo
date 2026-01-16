import React from 'react';
import { FormattedMessage } from 'react-intl';

import { usePasswordStrengthMeter } from 'hooks/usePasswordStrengthMeter';

import style from 'assets/style/components/createAccount/PasswordStrength.module.scss';

/**
 * Component that renders a progress bar and a password strength state
 *
 * @param form
 * @param customStyle
 * @param isPasswordChange
 * @constructor
 */
const PasswordStrengthMeter = ({ form, customStyle, isPasswordChange }) => {
  const passwordStrengthMeterValues = usePasswordStrengthMeter({ form, isPasswordChange });
  const { strength, title, passwordStrengthContent, passwordStrengthMeter, passwordStrengthMeterFilled } = style;

  return (
    <div className={customStyle}>
      <div className={passwordStrengthContent}>
        <span className={title}>
          <FormattedMessage id="form.label.passwordStrength" />
        </span>
        <span className={`${strength} ${style[passwordStrengthMeterValues.createPassLabel(false)]}`}>
          {passwordStrengthMeterValues.createPassLabel(true)}
        </span>
      </div>
      <div className={`${passwordStrengthMeter} ${passwordStrengthMeterValues.createPassLabel(false)}`}>
        <div
          className={` ${passwordStrengthMeterFilled} ${style[passwordStrengthMeterValues.createPassLabel(false)]}`}
          style={{ width: passwordStrengthMeterValues.passwordStrengthMeterFill }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
