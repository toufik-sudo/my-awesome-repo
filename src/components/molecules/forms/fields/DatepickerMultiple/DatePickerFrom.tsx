import React from 'react';
import DatePicker from 'react-datepicker';

import { ValidationMessage } from 'components/molecules/forms/fields/ValidationMessage';
import { DEFAULT_DATE_FORMAT } from 'constants/forms';
import { useRangeDatePicker } from 'hooks/launch/useRangeDatepicker';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import datepickerStyle from 'assets/style/common/Datepicker.module.scss';

/**
 * Date picker From component used for Multiple Datepicker
 *
 * @param label
 * @param errors
 */
const DatePickerFrom = ({ field: { label }, form }) => {
  const { errors, touched } = form;
  const {
    get: { start, end },
    set: { start: setStart }
  } = useRangeDatePicker(form);

  const { datepickerFrom, rangeDatepickerTo } = datepickerStyle;
  return (
    <>
      <div className={datepickerFrom}>
        <DatePicker
          selected={start}
          onChange={date => setStart(date)}
          selectsStart
          startDate={start}
          dateFormat={DEFAULT_DATE_FORMAT}
          maxDate={end}
          onBlur={() => !start && setStart(new Date())}
        />
        <ValidationMessage errors={errors} touched={touched} label={label} />
      </div>
      <DynamicFormattedMessage tag={HTML_TAGS.P} id="form.label.to" className={rangeDatepickerTo} />
    </>
  );
};

export default DatePickerFrom;
