import React from 'react';
import { INPUT_TYPE } from 'constants/forms';

import inputStyle from 'sass-boilerplate/stylesheets/components/forms/Input.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component that is used on a Field from formik to be used as a radio button
 *
 * @param name
 * @param value
 * @param onChange
 * @param onBlur
 * @param id
 * @param label
 * @param removeFocus
 * @param props
 * @param isLabelWhite
 * @constructor
 */
export const CustomRadioButton = ({
  field: { name, value, onChange, onBlur },
  isLabelWhite = false,
  id,
  label,
  removeFocus,
  ...props
}) => {
  const { customRadioInputWrapper, customRadioInput } = inputStyle;
  const { mb1, withDefaultColor, withBoldFont, mxAuto } = coreStyle;

  return (
    <div onMouseEnter={() => removeFocus()} onTouchStart={() => removeFocus()}>
      <label htmlFor={`${props.target || ''}.${label}`} className={customRadioInputWrapper}>
        <p className={`${mb1} ${withBoldFont} ${isLabelWhite ? withDefaultColor : ''}`}>{label}</p>
        <input
          type={INPUT_TYPE.RADIO}
          name={name}
          checked={id === value}
          onChange={onChange}
          value={id}
          id={`${props.target || ''}.${label}`}
          onBlur={onBlur}
          {...props}
        />
        <div className={`${customRadioInput} ${mxAuto}`} />
      </label>
    </div>
  );
};
