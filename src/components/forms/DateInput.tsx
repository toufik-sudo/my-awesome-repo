import React from 'react';
import { useTheme } from 'styled-components';

const DateInput = ({ value, onChange, ...props }) => {
  const theme = useTheme();

  return (
    <div className="input-group">
      {/* Calendar Icon */}
      <span className="input-icon">
        <i className="fas fa-calendar-alt"></i>
      </span>

      {/* Input Field */}
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="form-input"
        {...props}
      />
    </div>
  );
};

export default DateInput;
