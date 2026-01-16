import React from 'react';
import DatePicker from 'react-datepicker';
import { useIntl } from 'react-intl';

import { ValidationMessage } from 'components/molecules/forms/fields/ValidationMessage';
import { DEFAULT_DATE_FORMAT, TIME_FORMAT } from 'constants/forms';

import 'react-datepicker/dist/react-datepicker.css';
import 'assets/style/utils/datepicker.scss';
import style from 'assets/style/common/Input.module.scss';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

/**
 * Date picker (default) component to be used as a field in Formik form-wrappers
 *
 * @param values
 * @param setFieldValue
 * @param name
 * @param errors
 * @param touched
 * @param label
 * @constructor
 */
const DatePickerDefault = ({
  field: { label, minDate = undefined, maxDate = undefined, maxValue = undefined, style: fieldStyle = {} },
  form: { values, setFieldValue, errors, touched }
}) => {
  const { formatMessage } = useIntl();

  let pickerProps: any = {
    dateFormat: DEFAULT_DATE_FORMAT,
    minDate: minDate && minDate(),
    maxDate: (maxDate && maxDate()) || maxValue,
    onBlur: () => !values.startDate && values[label] && setFieldValue(label, new Date(values[label]))
  };

  if (fieldStyle && (fieldStyle as any).timeField) {
    pickerProps = {
      showTimeSelect: true,
      showTimeSelectOnly: true,
      timeIntervals: 15,
      dateFormat: TIME_FORMAT,
      timeFormat: TIME_FORMAT
    };
  }

  return (
    <div className={style.datepicker}>
      <label className="inputLabel">{formatMessage({ id: `form.label.${label}` })}</label>
      <DatePicker
        selected={values[label]}
        onChange={val => setFieldValue(label, val ? val : undefined)}
        {...pickerProps}
      />
      <SpringAnimation className={style.error} settings={setTranslate(DELAY_TYPES.NONE)}>
        <ValidationMessage errors={errors} touched={touched} label={label} />
      </SpringAnimation>
    </div>
  );
};

export default DatePickerDefault;
