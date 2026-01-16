import React from 'react';

import CubeOption from 'components/atoms/launch/cube/CubeOption';

/**
 * Organism component used to render frequency options list
 *
 * @param frequencyTypes
 * @param setSelectedFrequency
 * @param selectedFrequency
 * @constructor
 */
const FrequencyAllocationOptionList = ({ frequencyTypes, setSelectedFrequency, selectedFrequency }) => {
  return (
    <>
      {frequencyTypes.map(type => (
        <div key={type}>
          <CubeOption
            {...{
              handleSelection: () => setSelectedFrequency(type),
              isSelected: selectedFrequency === type,
              translation: `launchProgram.cube.frequency.${type}`,
              type
            }}
          />
        </div>
      ))}
    </>
  );
};

export default FrequencyAllocationOptionList;
