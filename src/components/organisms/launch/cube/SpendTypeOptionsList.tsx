import React from 'react';

import CubeOption from 'components/atoms/launch/cube/CubeOption';

/**
 * Organism component used to render spend points options list
 *
 * @param spendPointsTypes
 * @param setSelectedSpendPoint
 * @param selectedSpendPoint
 * @constructor
 */
const SpendTypeOptionsList = ({ spendPointsTypes, setSelectedSpendPoint, selectedSpendPoint }) => (
  <>
    {spendPointsTypes.map(type => (
      <div key={type}>
        <CubeOption
          {...{
            handleSelection: () => setSelectedSpendPoint(type),
            isSelected: selectedSpendPoint === type,
            translation: `launchProgram.cube.spendPoints.${type}`,
            type
          }}
        />
      </div>
    ))}
  </>
);

export default SpendTypeOptionsList;
