import { IRadioButtonGroupProps } from 'interfaces/forms/IRadioButtonGroup';
import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import style from 'assets/style/common/Input.module.scss';

export const RadioButtonGroup: FC<IRadioButtonGroupProps> = ({ id, label, isUserTitle, children }) => {
  const { container, groupLabel, radioTitleGroup } = style;

  return (
    <div className={`${container} ${isUserTitle ? radioTitleGroup : ''}`}>
      {children}
      {label && (
        <label className={groupLabel}>
          <FormattedMessage id={label} />
        </label>
      )}
    </div>
  );
};
