import React, { useCallback } from 'react';

import DefaultInputField from 'components/molecules/forms/fields/DefaultInputField';
import RadioButtonInputField from 'components/molecules/forms/fields/RadioButtonInputField';
import { RADIO_DEFAULT_TYPE } from 'constants/forms';
import { REQUIRED } from 'constants/validation';
import { getAdditionalField } from 'services/FormServices';

import style from 'assets/style/common/Input.module.scss';

/**
 * Input component field combined of radio and text input
 *
 * @param field
 * @param intl
 * @param form
 * @constructor
 */
const RadioTextInputField = ({ field, form }) => {
  const { style: fieldStyle } = field;
  const { container, isRegular } = style;
  const additionalField = getAdditionalField(`${field.label}Additional`);
  const inputIsInline = fieldStyle && !fieldStyle.isInline ? style.isCentered : fieldStyle.isInline;

  const validateFunction = useCallback(
    additionalFieldValue => {
      if (form.values[field.label] != RADIO_DEFAULT_TYPE.REFUSE && !additionalFieldValue) {
        return REQUIRED;
      }
    },
    [form.values[field.label], form.errors[additionalField.label]]
  );

  return (
    <div className={`${container} ${inputIsInline} ${isRegular}`}>
      <RadioButtonInputField field={field} form={form} />
      {form.values[field.label] !== RADIO_DEFAULT_TYPE.REFUSE && (
        <>
          <DefaultInputField field={additionalField} form={form} fieldValidation={validateFunction} />
        </>
      )}
    </div>
  );
};

export default RadioTextInputField;
