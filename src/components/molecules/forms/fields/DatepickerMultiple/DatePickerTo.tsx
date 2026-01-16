import React from 'react';
import DatePicker from 'react-datepicker';

import { ValidationMessage } from 'components/molecules/forms/fields/ValidationMessage';
import { DEFAULT_DATE_FORMAT } from 'constants/forms';
import datepickerStyle from 'assets/style/common/Datepicker.module.scss';
import { useRangeDatePicker } from 'hooks/launch/useRangeDatepicker';

/**
 * Date picker To component used for Multiple Datepicker
 *
 * @param label
 * @param errors
 */
const DatePickerTo = ({ field: { label }, form }) => {
  const { errors, touched } = form;
  const {
    get: { start, end },
    set: { end: setEnd }
  } = useRangeDatePicker(form);
  const { datepickerTo } = datepickerStyle;

  return (
    <div className={datepickerTo}>
      <DatePicker
        selected={end}
        onChange={date => setEnd(date)}
        selectsEnd
        startDate={start}
        minDate={start}
        dateFormat={DEFAULT_DATE_FORMAT}
      />
      <ValidationMessage errors={errors} touched={touched} label={label} />
    </div>
  );
};

export default DatePickerTo;
