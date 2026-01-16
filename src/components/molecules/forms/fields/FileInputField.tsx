import React from 'react';
import { Field } from 'formik';

import FileInput from 'components/molecules/forms/fields/FileInput';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { ValidationMessage } from 'components/molecules/forms/fields/ValidationMessage';
import { DELAY_TYPES } from 'constants/animations';
import { setTranslate } from 'utils/animations';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'assets/style/common/Input.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render a file form field
 *
 * @param field
 * @param form
 * @constructor
 */
const FileInputField = ({ field, form }) => {
  const { label, style: fieldStyle } = field;
  const { errors, touched } = form;
  const { error, fieldError, defaultInputStyle } = style;
  const { px1, mb4, displayFlex, withGrayAccentColor, withLightFont, withFontLarge } = coreStyle;

  const inputIsValid = errors[label] && touched[label] && errors[label];
  const inputHasError = inputIsValid ? fieldError : '';
  const defaultInput = fieldStyle && fieldStyle.defaultInput ? defaultInputStyle : '';

  return (
    <div className={`${defaultInput} ${displayFlex} ${inputHasError} customFieldWrapper ${mb4}`}>
      <DynamicFormattedMessage
        id={`form.label.${label}`}
        className={`${withGrayAccentColor} ${px1} ${withLightFont} ${withFontLarge}`}
        tag={HTML_TAGS.LABEL}
      />
      <Field
        {...{
          ...form,
          ...field,
          name: label,
          id: label,
          component: FileInput,
          explanationClassName: `${withGrayAccentColor} ${px1} ${withLightFont}`
        }}
      />
      <SpringAnimation className={error} settings={setTranslate(DELAY_TYPES.NONE)}>
        <ValidationMessage errors={errors} touched={touched} label={label} key={`${label}_${errors[label]}`} />
      </SpringAnimation>
    </div>
  );
};

export default FileInputField;
