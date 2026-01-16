import React from 'react';
import { useIntl } from 'react-intl';
import 'react-datepicker/dist/react-datepicker.css';
import 'assets/style/utils/datepicker.scss';

import DatePickerFrom from './DatePickerFrom';
import DatePickerTo from './DatePickerTo';

import datepickerStyle from 'assets/style/common/Datepicker.module.scss';
import style from 'assets/style/common/Input.module.scss';

/**
 * Date picker (default) component to be used as a field in Formik form-wrappers
 *
 * @param field
 * @param form
 */
const DatePickerMultiple = ({ field, form }) => {
  const { formatMessage } = useIntl();
  const { rangeDatepicker, rangeDatepickerWrapper } = datepickerStyle;

  return (
    <div className={`${style.datepicker} ${rangeDatepicker}`}>
      <label className="inputLabel">{formatMessage({ id: `form.label.${field.label}` })}</label>
      <div className={rangeDatepickerWrapper}>
        <DatePickerFrom {...{ form, field }} />
        <DatePickerTo {...{ form, field }} />
      </div>
    </div>
  );
};

export default DatePickerMultiple;
