import React from 'react';

import { DOT_SEPARATOR } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useRegistrationValidation } from 'hooks/launch/useRegistrationValidation';
import { USER_VALIDATION_FIELDS } from 'constants/wall/launch';

import style from 'assets/style/components/launch/UserValidation.module.scss';

/**
 * Molecule component used to render User Validation Blocks Radio buttons
 *
 * @constructor
 */
const UserValidationRadio = ({
  index,
  textId,
  label,
  textLabel,
  value,
  setValue,
  blockItemNumber,
  elementItemNumber
}) => {
  const { validationRadioBlock, validationRadioBlockLabel, validationExtraInfo } = style;

  const { currentValidationForm, handleValidationUpdate } = useRegistrationValidation(textLabel, index, setValue);

  return (
    <div className={validationRadioBlock}>
      <input
        id={`check-${blockItemNumber}-${elementItemNumber}`}
        name={`check-${USER_VALIDATION_FIELDS[index]}`}
        type="radio"
        checked={value === currentValidationForm}
        onChange={handleValidationUpdate}
      />
      <DynamicFormattedMessage
        tag="label"
        className={validationRadioBlockLabel}
        htmlFor={`check-${blockItemNumber}-${elementItemNumber}`}
        id={textId}
      />
      <DynamicFormattedMessage tag="div" className={validationExtraInfo} id={`${label}${DOT_SEPARATOR}${textLabel}`} />
    </div>
  );
};

export default UserValidationRadio;
