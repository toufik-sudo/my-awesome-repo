import style from 'assets/style/common/Input.module.scss';
import 'assets/style/utils/datepicker.scss';
import { DEFAULT_DATE_TIME_FORMAT, FORM_FIELDS, TIME_FORMAT, TIME_INTERVAL, TIME_LABEL } from 'constants/forms';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormattedMessage } from 'react-intl';
import { addNewDate, deleteContactInput, getValidDates } from 'services/FormServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

/**
 * Date picker (default) component to be used as a field in Formik form-wrappers
 *
 * @param values
 * @param setFieldValue
 * @param name
 * @param errors
 * @constructor
 */
const DynamicDatePickerDefault = ({ field, form: { values, setFieldValue, errors } }) => {
  const { style: fieldStyle, label } = field;
  const [dateInputCount, setDateInputCount] = useState([FORM_FIELDS.CONTACT_DATE]);
  const { datepicker, complexDatepicker, changeDatepicker, submitBtn } = style;
  const validDates = getValidDates(dateInputCount, values);
  const checkFieldsCompleted = validDates !== dateInputCount.length;
  const showDeleteButton = validDates > 1 && dateInputCount.length > 1;
  const isComplexDatepicker = fieldStyle && fieldStyle.isComplex ? complexDatepicker : '';

  return (
    <div className={`${datepicker} ${isComplexDatepicker}`}>
      <label>
        <FormattedMessage id={`form.label.${FORM_FIELDS.CONTACT_DATE}`} />
      </label>
      {dateInputCount.map((input, key) => (
        <div key={key}>
          <DatePicker
            selected={values[input]}
            dateFormat={DEFAULT_DATE_TIME_FORMAT}
            onChange={val => setFieldValue(input, val)}
            onBlur={() => !values[input] && setFieldValue(input, new Date())}
            minDate={new Date()}
            showTimeSelect
            timeFormat={TIME_FORMAT}
            timeIntervals={TIME_INTERVAL}
            timeCaption={TIME_LABEL}
          />
          {errors[input] && <FormattedMessage id={`form.validation.${errors[input]}`} />}
          {showDeleteButton && (
            <button onClick={() => deleteContactInput(dateInputCount, setDateInputCount, values, key)}>delete</button>
          )}
          {dateInputCount.length > 1 && input !== dateInputCount[dateInputCount.length - 1] && (
            <div className={changeDatepicker}>
              <FormattedMessage id="form.label.difference" />
            </div>
          )}
        </div>
      ))}
      {dateInputCount.length < 3 && (
        <button
          className={submitBtn}
          disabled={checkFieldsCompleted}
          type="button"
          onClick={() => addNewDate(dateInputCount, label, setDateInputCount)}
        >
          <span>
            <FontAwesomeIcon icon={faPlus} />
          </span>
          <FormattedMessage id="label.button.addDate" />
        </button>
      )}
    </div>
  );
};

export default DynamicDatePickerDefault;
