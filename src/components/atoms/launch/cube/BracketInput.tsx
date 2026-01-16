import React from 'react';

import { BRACKET_TYPE, DISABLED } from 'constants/wall/launch';
import { disableBracketsInputAdd } from 'services/FormServices';

import style from 'sass-boilerplate/stylesheets/components/forms/Input.module.scss';

/**
 * Atom component used to render bracket input
 *
 * @param bracketData
 * @param handleBracketInputChange
 * @param target
 * @param index
 * @param validation
 * @param type
 * @constructor
 */
const BracketInput = ({ bracketData, handleBracketInputChange, target, index, validation, type }) => {
  const isDisabled = bracketData[BRACKET_TYPE.STATUS] === DISABLED;

  return (
    <input
      {...{
        tabIndex: isDisabled ? -1 : 1,
        className: style.cubeBracketInput,
        value: bracketData[target],
        name: BRACKET_TYPE.EQUALS,
        onChange: e =>
          !isDisabled &&
          disableBracketsInputAdd(e, type) &&
          handleBracketInputChange(target, e.target.value, index, validation),
        onBlur: e =>
          !isDisabled &&
          disableBracketsInputAdd(e, type) &&
          handleBracketInputChange(target, e.target.value, index, validation)
      }}
    />
  );
};

export default BracketInput;
