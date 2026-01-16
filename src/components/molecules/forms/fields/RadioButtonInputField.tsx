import React from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'formik';

import { RadioButton } from 'components/molecules/forms/fields/RadioButton';
import { RadioButtonGroup } from 'components/molecules/forms/fields/RadioButtonGroup';

import { ValidationMessage } from 'components/molecules/forms/fields/ValidationMessage';

import style from 'assets/style/common/Input.module.scss';
import inputStyle from 'sass-boilerplate/stylesheets/components/forms/Input.module.scss';

import { CustomRadioButton } from 'components/molecules/forms/fields/CustomRadioButton';

/**
 * Template reusable component used to render a radio button field for formik
 *
 * @param form
 * @param field
 * @constructor
 */
const RadioButtonInputField = ({ field, form }) => {
  const intl = useIntl();
  const { label, options, style: fieldStyle } = field;
  const { option, fieldIsInline, container, isRegular, civility, error, isDisabled } = style;
  const inputIsInline = fieldStyle && fieldStyle.isInline ? fieldIsInline : '';
  const isCustomRadio = fieldStyle && fieldStyle.customRadio;
  const isLabelWhite = fieldStyle && fieldStyle.whiteLabel;
  const removeFocus = () => {
    if (document.activeElement && document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  return (
    <div
      className={`${container} ${inputStyle.errorBottom} ${inputIsInline} ${isRegular} ${civility} ${field.style && field.style.isDisabled ? isDisabled : ''
        }`}
    >
      <RadioButtonGroup id={label} label={`form.label.radio.${label}`} isUserTitle={label == 'title' ? true : false}>
        <div className={option}>
          {options.map((option, index) => {
            return (
              <Field
                key={index}
                component={props =>
                  isCustomRadio ? (
                    <CustomRadioButton
                      {...props}
                      target={label}
                      isLabelWhite={isLabelWhite}
                      removeFocus={removeFocus}
                    />
                  ) : (
                    <RadioButton {...props} target={label} removeFocus={removeFocus} />
                  )
                }
                name={label}
                id={option.value}
                label={intl.formatMessage({ id: `form.label.radio.${option.label}` })}
              />
            );
          })}
        </div>
        <div className={error}>
          <ValidationMessage errors={form.errors} touched={form.touched} label={field.label} />
        </div>
      </RadioButtonGroup>
    </div>
  );
};

export default RadioButtonInputField;
