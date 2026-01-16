import React from 'react';

import Bracket from 'components/organisms/launch/cube/Bracket';
import ValidateCta from 'components/atoms/launch/cube/ValidateCTA';
import AddBracket from 'components/atoms/launch/cube/AddBracket';
import { CUBE_SECTIONS } from 'constants/wall/launch';
import { useBracketAllocation } from 'hooks/launch/cube/allocation/useBracketAllocation';
import { useBracketLabels } from 'hooks/launch/cube/allocation/useBracketLabels';
import { useBracketAdd } from 'hooks/launch/cube/allocation/useBracketAdd';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

/**
 * Organism component used to render ranking allocation
 *
 * @param goalIndex
 * @param inputType
 * @param type
 * @param activeTypeForm
 * @constructor
 */
const BaseAllocation = ({ index: goalIndex, inputType, type = 'bracket' }) => {
  const { fieldLabels } = useBracketLabels(goalIndex, inputType);
  const { setBracketsData, bootstrapBracketSelection, bracketsData } = useBracketAllocation(goalIndex, fieldLabels);
  const { handleAddBracket, addBracketVisible } = useBracketAdd(setBracketsData, bracketsData);

  return (
    <div className={grid['mt-5']}>
      {bracketsData.map((bracketData, index) => (
        <Bracket key={index} {...{ bracketData, index, goalIndex, bracketsData, setBracketsData, inputType, type }} />
      ))}
      {addBracketVisible && <AddBracket {...{ onClick: handleAddBracket, type }} />}
      {
        <ValidateCta
          {...{
            handleItemValidation: bootstrapBracketSelection,
            targetName: CUBE_SECTIONS.ALLOCATION_TYPE,
            targetValue: null
          }}
        />
      }
    </div>
  );
};

export default BaseAllocation;
