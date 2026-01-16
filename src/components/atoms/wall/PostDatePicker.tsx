import React from 'react';
import DatePicker from 'react-datepicker';

import PostDateIcon from 'components/atoms/wall/PostDateIcon';
import { DEFAULT_DATE_FORMAT, TIME_FORMAT } from 'constants/forms';

/**
 * Atom component used to render datepicker
 */
const PostDatePicker = ({
  minDate = new Date(),
  selectedDate,
  onDateChange,
  label = undefined,
  hasError = false,
  touched = false,
  customClass = '',
  ...rest
}) => (
  <DatePicker
    minDate={minDate}
    selected={selectedDate}
    dateFormat={DEFAULT_DATE_FORMAT}
    customInput={<PostDateIcon label={label} customInputClass={customClass} hasError={touched && hasError} />}
    onChange={onDateChange}
    timeFormat={TIME_FORMAT}
    shouldCloseOnSelect={true}
    showTimeSelect
    timeIntervals={15}
    {...rest}
  />
);

export default PostDatePicker;
