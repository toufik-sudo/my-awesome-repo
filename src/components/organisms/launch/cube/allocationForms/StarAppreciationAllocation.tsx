import React from 'react';
import Bracket from 'components/organisms/launch/cube/Bracket';
import ValidateCta from 'components/atoms/launch/cube/ValidateCTA';
import AddBracket from 'components/atoms/launch/cube/AddBracket';
import { CUBE_SECTIONS } from 'constants/wall/launch';
import { useBracketAllocation } from 'hooks/launch/cube/allocation/useBracketAllocation';
import { useBracketLabels } from 'hooks/launch/cube/allocation/useBracketLabels';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

/**
 * New allocation component used specifically for StarAppreciation
 *
 * @param goalIndex
 * @param inputType
 * @param type
 * @param bracketsData
 * @param setBracketsData
 * @param handleAddBracket
 * @param handleBracketDelete
 * @constructor
 */
const StarAppreciationAllocation = ({ index: goalIndex, inputType, type = 'bracket', bracketsData, setBracketsData, handleAddBracket, handleBracketDelete }) => {
  const { fieldLabels } = useBracketLabels(goalIndex, inputType);
  const { bootstrapBracketSelection } = useBracketAllocation(goalIndex, fieldLabels);

  return (
    <div className={grid['mt-5']}>
      {bracketsData.map((bracketData, index) => (
        <Bracket
          key={index}
          setBracketsData={setBracketsData}
          index={index}
          bracketsData={bracketsData}
          bracketData={bracketData}
          goalIndex={goalIndex}
          inputType={inputType}
          type={type}
          
        />
      ))}
      {bracketsData.length < 5 && (
        <AddBracket {...{ onClick: handleAddBracket, type }} />
      )}
      <ValidateCta
        {...{
          handleItemValidation: bootstrapBracketSelection,
          targetName: CUBE_SECTIONS.ALLOCATION_TYPE,
          targetValue: null,
        }}
      />
    </div>
  );
};

export default StarAppreciationAllocation;
