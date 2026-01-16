import React, { useMemo, useState } from 'react';
import { FastField } from 'formik';
import { useIntl } from 'react-intl';

import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import FieldStrengthRequirements from '../contents/FieldStrengthRequirements';
import { ValidationMessage } from 'components/molecules/forms/fields/ValidationMessage';
import { DELAY_TYPES } from 'constants/animations';
import { FORM_FIELDS, INPUT_TYPE } from 'constants/forms';
import { CREATE_ACCOUNT_PASSWORD, HTTP, HTTPS, MIN_INPUT_NUMBER_VALUE, NUMBER } from 'constants/validation';
import { HTML_TAGS } from 'constants/general';
import {
  blockFieldInvalidNumberOrPhone,
  getCustomUrlFieldFormValidation,
  getPasswordFormValidation,
  setNumberInputErrors,
  setUrlField
} from 'services/FormServices';
import { setTranslate } from 'utils/animations';
import { TAILORED } from 'constants/routes';

import style from 'assets/style/common/Input.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/Inputs.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render default form field
 *
 * @param field
 * @param form
 * @param name
 * @param fieldValidation
 * @constructor
 *
 * @see FormFieldsStory
 */
const DefaultInputField = ({ field, form, name = '', fieldValidation = undefined, isHiddenField = null, isNoErrorsField = null }) => {
  const {
    container,
    error,
    fieldError,
    floating,
    hasValue,
    isCentered,
    defaultInputStyle,
    roundedInput,
    noIcon,
    isSmaller
  } = style;
  const { withFontSmall, pl1, pt05, withGrayColor } = coreStyle;
  const intl = useIntl();
  const { label, type, style: fieldStyle, extraConstraints, hasExplanation, isTextArea } = field;
  const { values, errors, touched, handleChange, handleBlur } = form;
  const inputIsValid = errors[label] && touched[label] && errors[label];
  const inputHasValue = values[label] ? hasValue : '';
  const inputHasError = inputIsValid ? fieldError : '';
  const inputHasFloat = fieldStyle && !fieldStyle.floating ? '' : floating;
  const inputIsCentered = fieldStyle && fieldStyle.centerElement ? isCentered : '';
  const inputIsRounded = fieldStyle && fieldStyle.rounded ? roundedInput : '';
  const inputIsDisabled = fieldStyle && fieldStyle.isDisabled;
  const inputIsHidden = fieldStyle && fieldStyle.isHidden ? 'hidden' : '';
  const defaultInput = fieldStyle && fieldStyle.defaultInput ? defaultInputStyle : '';
  const inputIsSmaller = fieldStyle && fieldStyle.isSmaller ? isSmaller : '';
  let nameField = label;
  let isBannerHide = false;
  if (label == 'contentsTitle1'|| label == 'contentsTitle2' || label == 'contentsTitle3' || label == 'contentsTitle4') {
    nameField = "contentsTitle";    
  }
  if (label == 'bannerTitle1'|| label == 'bannerTitle2' || label == 'bannerTitle3' || label == 'bannerTitle4') {
    nameField = "bannerTitle";
    isBannerHide = true;
  }
  if (label === FORM_FIELDS.WEBSITE_URL && (values[label] === HTTP || values[label] === HTTPS)) {
    delete errors[label];
  }

  if(isNoErrorsField){
    delete errors[label];
  }

  const [isActive, setActive] = useState(false);
  const fieldLabel = form.values.createAccountPassword ? CREATE_ACCOUNT_PASSWORD : FORM_FIELDS.NEW_PASSWORD;
  const fieldValue = form.values.createAccountPassword ? form.values.createAccountPassword : form.values.newPassword;

  const customUrlLabel = FORM_FIELDS.EXTEND_URL;
  const customUrlValue = form.values.extendUrl || '';

  const toggleTooltip = field.label === fieldLabel && isActive;
  const toggleCustomUrlField = field.label === customUrlLabel && isActive;

  const value = fieldValue || '';

  // Set number input type custom errors
  setNumberInputErrors(field, form);
  const FieldTag = isTextArea ? HTML_TAGS.TEXTAREA : FastField;
  const shouldBlockInputValue = useMemo(() => (type === NUMBER && name === TAILORED) || type === INPUT_TYPE.TEL, [
    field
  ]);

  return (
    <div
      className={`${container} ${
        inputIsDisabled ? noIcon : ''
      } ${inputHasValue} ${inputHasError} ${inputHasFloat} ${inputIsCentered} ${inputIsHidden} ${defaultInput} ${inputIsRounded} ${inputIsSmaller}`}
      style={{ flexDirection: nameField == 'bannerTitle' ? 'column' : 'column-reverse' }}
    >
      {toggleCustomUrlField && (
        <div className={componentStyle.toolTipErrors}>
          <ul className={componentStyle.toolTipErrorsContainer}>
            {getCustomUrlFieldFormValidation(customUrlValue.trim()).map(({ text, value }, index) => {
              return <FieldStrengthRequirements value={value} text={text} key={index} />;
            })}
          </ul>
        </div>
      )}
      {toggleTooltip && !isBannerHide && !isHiddenField &&  (
        <div className={componentStyle.toolTipErrors}>
          <ul className={componentStyle.toolTipErrorsContainer}>
            {getPasswordFormValidation(value).map(({ text, value }, index) => {
              return <FieldStrengthRequirements value={value} text={text} key={index} />;
            })}
          </ul>
        </div>
      )}
      {!field.additionalField && !isBannerHide && !isHiddenField && nameField == 'bannerTitle' && (
        <label className="inputLabel">{intl.formatMessage({ id: `form.label.${nameField}` })}</label>
      )}
      {!isBannerHide && !isHiddenField && (<FieldTag
        type={type}
        name={label}
        min={typeof values[label] === NUMBER ? MIN_INPUT_NUMBER_VALUE : null}
        onFocus={() => setActive(true)}
        onKeyPress={e => (shouldBlockInputValue ? blockFieldInvalidNumberOrPhone(e, type) : '')}
        onChange={(...args) => {
          setActive(true);
          label === FORM_FIELDS.EXTEND_URL && setUrlField(form, FORM_FIELDS.PROGRAM_URL, FORM_FIELDS.EXTEND_URL);
          return handleChange(...args);
        }}
        onBlur={(...args) => {
          setActive(false);
          return handleBlur(...args);
        }}
        value={values[label]}
        disabled={inputIsDisabled}
        validate={fieldValidation}
      />)}
      {!field.additionalField && !isBannerHide && !isHiddenField && nameField != 'bannerTitle' &&  (
        <label className="inputLabel">{intl.formatMessage({ id: `form.label.${nameField}` })}</label>
      )}
      {hasExplanation && !isBannerHide && !isHiddenField && (
        <div className={`${pl1} ${withFontSmall} ${withGrayColor} ${pt05}`}>
          {intl.formatMessage({ id: `form.label.${nameField}.explanation` })}
        </div>
      )}
      <SpringAnimation className={error} settings={setTranslate(DELAY_TYPES.NONE)}>
        <ValidationMessage {...{ errors, touched, label, extraConstraints }} />
      </SpringAnimation>
    </div>
  );
};

export default DefaultInputField;
