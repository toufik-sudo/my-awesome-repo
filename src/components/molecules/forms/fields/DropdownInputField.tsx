import React from 'react';
import Select from 'react-select';
import { useIntl } from 'react-intl';

import { ValidationMessage } from 'components/molecules/forms/fields/ValidationMessage';
import { customStyles } from 'constants/languageSwitcher';
import { IFormDropdownOption } from 'interfaces/forms/IForm';
import style from 'assets/style/common/Input.module.scss';

/**
 * Molecule component used to render dropdown input field
 *
 * @param form
 * @param field
 * @constructor
 *
 * @see FormFieldsStory
 */
const DropdownInputField = ({ form, field }) => {
  const intl = useIntl();
  const { options, label, style: fieldStyle } = field;
  const { values, errors, touched, setFieldValue, handleBlur } = form;
  const { roundedDropdown, error } = style;
  const inputIsRounded = fieldStyle && fieldStyle.rounded ? roundedDropdown : '';

  return (
    <div className={inputIsRounded} style={{ display: 'flex' }}>
      <label>{intl.formatMessage({ id: `form.label.${label}` })}</label>
      <Select
        name={label}
        isSearchable={true}
        id={label}
        value={values[field.label] && { value: values[field.label].value, label: values[field.label].label }}
        onChange={(option: IFormDropdownOption) => setFieldValue(label, option)}
        handleBlur={handleBlur}
        options={options}
        styles={customStyles}
      />
      <div className={error}>
        <ValidationMessage errors={errors} touched={touched} label={label} />
      </div>
    </div>
  );
};

export default DropdownInputField;
