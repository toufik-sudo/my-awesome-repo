import React from 'react';

import ButtonDelete from 'components/atoms/ui/ButtonDelete';
import BracketInputGroup from 'components/molecules/launch/cube/BracketInputGroup';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BRACKET_TYPE, DISABLED } from 'constants/wall/launch';
import { convertAsciiToString } from 'utils/general';
import { useBracket } from 'hooks/launch/cube/allocation/useBracket';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/launch/Brackets.module.scss';

/**
 * Organism component used to render a bracket
 *
 * @param setBracketsData
 * @param index
 * @param bracketsData
 * @param bracketData
 * @param goalIndex
 * @param inputType
 * @param type
 * @constructor
 */
const Bracket = ({ setBracketsData, index, bracketsData, bracketData, goalIndex, inputType, type }) => {
  const { bracketWrapper, bracketLabel, bracketLabelWrapper, bracketDisabled } = style;
  const {
    handleBracketInputChange,
    handleBracketDelete,
    fieldLabels: { min, max, value }
  } = useBracket(goalIndex, bracketsData, setBracketsData, inputType);

  return (
    <div className={`${bracketWrapper} ${bracketData[BRACKET_TYPE.STATUS] === DISABLED ? bracketDisabled : ''}`}>
      <span className={bracketLabelWrapper}>
        <DynamicFormattedMessage
          className={bracketLabel}
          tag={HTML_TAGS.SPAN}
          id={`launchProgram.cube.${type}.label`}
          values={{ value: convertAsciiToString(index) }}
        />
      </span>
      <BracketInputGroup
        {...{
          bracketData,
          target: BRACKET_TYPE.FROM,
          handleBracketInputChange,
          condition: min,
          index,
          type
        }}
      />
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="label.to" className={bracketLabel} />
      <BracketInputGroup
        {...{
          bracketData,
          target: BRACKET_TYPE.TO,
          handleBracketInputChange,
          condition: max,
          index,
          type
        }}
      />
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="label.equals" className={bracketLabel} />
      <BracketInputGroup
        {...{
          bracketData,
          target: BRACKET_TYPE.EQUALS,
          handleBracketInputChange,
          condition: value,
          index,
          type
        }}
      />
      {index > 1 && <ButtonDelete onclick={() => handleBracketDelete(index)} />}
    </div>
  );
};

export default Bracket;
