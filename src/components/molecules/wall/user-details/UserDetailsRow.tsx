import React from 'react';
import { useIntl } from 'react-intl';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDetails.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import inputStyle from 'assets/style/common/Input.module.scss';

/**
 * Molecule component used to render user details information  row
 * @param label
 * @param placeholder
 * @param type
 * @constructor
 */
const UserDetailsRow = ({ label, defaultValue, type, disabled = true }) => {
  const { formatMessage } = useIntl();
  const { userDetailsInformationsRow, userDetailsInformationsRowLabel, userDetailsInformationsRowInput } = style;
  const { withGrayAccentColor, displayFlex } = coreStyle;
  const { defaultInputStyle, container, isDisabled } = inputStyle;

  return (
    <div className={`${userDetailsInformationsRow} ${displayFlex}`}>
      <label className={`${userDetailsInformationsRowLabel} ${withGrayAccentColor}`}>
        {formatMessage({ id: label })}
      </label>
      <div className={`${userDetailsInformationsRowInput} ${container} ${disabled ? isDisabled : ''}`}>
        <input type={type} className={defaultInputStyle} defaultValue={defaultValue} readOnly={disabled} required />
      </div>
    </div>
  );
};

export default UserDetailsRow;
