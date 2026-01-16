import React from 'react';
import DatePicker from 'react-datepicker';

/**
 * Atom component used to render dashboard datepicker
 * @param minDate
 * @param selectedDate
 * @param onDateChange
 * @param rest
 * @constructor
 */
const DashboardDatePicker = ({ minDate = new Date(), selectedDate, onDateChange, ...rest }) => (
  <DatePicker minDate={minDate} selected={selectedDate} onChange={onDateChange} {...rest} maxDate={new Date()} />
);

export default DashboardDatePicker;
