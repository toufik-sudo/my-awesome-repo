import React from 'react';

/**
 * Molecule component that is used on a Field from formik to be used as a radio button
 *
 * @param name
 * @param value
 * @param onChange
 * @param onBlur
 * @param id
 * @param label
 * @param removeFocus
 * @param props
 * @constructor
 */
export const RadioButton = ({ field: { name, value, onChange, onBlur }, id, label, removeFocus, ...props }) => {
  return (
    <div onMouseEnter={() => removeFocus()} onTouchStart={() => removeFocus()}>
      <input
        name={name}
        id={`${label}.${name}`}
        type="radio"
        value={id} // could be something else for output?
        checked={id === value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      <label htmlFor={`${label}.${name}`}>{label}</label>
    </div>
  );
};
