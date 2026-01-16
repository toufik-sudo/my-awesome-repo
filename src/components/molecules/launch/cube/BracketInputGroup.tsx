import React from 'react';
import { FormattedMessage } from 'react-intl';

import BracketInput from 'components/atoms/launch/cube/BracketInput';
import BracketLabel from 'components/atoms/launch/cube/BracketLabel';

import style from 'sass-boilerplate/stylesheets/components/launch/Brackets.module.scss';

/**
 * Molecule component used to render bracket input group
 * @param bracketData
 * @param handleBracketInputChange
 * @param min
 * @param target
 * @param type
 * @constructor
 */
const BracketInputGroup = ({ bracketData, handleBracketInputChange, condition, target, index, type }) => {
  const { bracketError, bracketInputGroupWrapper, bracketInputGroup, inputHasError } = style;

  return (
    <span className={bracketInputGroupWrapper}>
      <span className={`${bracketInputGroup} ${bracketData && bracketData.errors[target] ? inputHasError : ''}`}>
        <BracketInput
          {...{
            bracketData,
            handleBracketInputChange,
            target,
            index,
            validation: condition.validations,
            type
          }}
        />
        <BracketLabel {...{ condition: condition.value }} />
      </span>
      <span className={bracketError}>
        {!!bracketData.errors[target] && <FormattedMessage id={bracketData.errors[target]} />}
      </span>
    </span>
  );
};

export default BracketInputGroup;
