import React, { useMemo } from 'react';
import { FastField } from 'formik';
import { useIntl, FormattedMessage } from 'react-intl';

import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { ValidationMessage } from 'components/molecules/forms/fields/ValidationMessage';
import { DELAY_TYPES } from 'constants/animations';
import { FORM_FIELDS, REVENUE_AND_SALES_FIELDS } from 'constants/forms';
import { HTTP, HTTPS, MIN_INPUT_NUMBER_VALUE } from 'constants/validation';
import { disableCubeFieldsInvalidChars, setNumberInputErrors } from 'services/FormServices';
import { setTranslate } from 'utils/animations';

import style from 'assets/style/common/Input.module.scss';
import extendedInputStyle from 'assets/style/common/ExtendedInput.module.scss';

/**
 * Molecule component used to render the extended input form field
 *
 * @param field
 * @param form
 * @constructor
 *
 * @see FormFieldsStory
 */
const ExtendedInputField = ({ field, form }) => {
  const intl = useIntl();
  const { label, type, style: fieldStyle } = field;
  const { values, errors, touched, handleChange, handleBlur } = form;
  const { error, extendedInput, extraInfo } = extendedInputStyle;

  const inputIsDisabled = fieldStyle && fieldStyle.isDisabled;

  if (label === FORM_FIELDS.WEBSITE_URL && (values[label] === HTTP || values[label] === HTTPS)) {
    delete errors[label];
  }

  // Set number input type custom errors
  setNumberInputErrors(field, form);
  const shouldBlockInputValue = useMemo(() => REVENUE_AND_SALES_FIELDS.includes(field.label), [field]);
  const fieldLabel = useMemo(() => field.label, [field]);

  return (
    <div className={`${style.container} ${extendedInput}`}>
      {!field.additionalField && (
        <label className="inputLabel">{intl.formatMessage({ id: `form.label.${label}` })}</label>
      )}
      <FastField
        type={type}
        name={label}
        min={MIN_INPUT_NUMBER_VALUE}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[label]}
        disabled={inputIsDisabled}
        onKeyPress={e => (shouldBlockInputValue ? disableCubeFieldsInvalidChars(e, fieldLabel) : '')}
      />
      <div className={extraInfo}>
        {fieldStyle.euroInput && <FormattedMessage id="label.euro" />}
        {fieldStyle.usdInput && <FormattedMessage id="label.usd" />}
        {fieldStyle.unitInput && <FormattedMessage id="label.units" />}
        {fieldStyle.percentageInput && <FormattedMessage id="label.percentage" />}
      </div>
      <SpringAnimation className={error} settings={setTranslate(DELAY_TYPES.NONE)}>
        <ValidationMessage errors={errors} touched={touched} label={label} />
      </SpringAnimation>
    </div>
  );
};

export default ExtendedInputField;
