import React from 'react';

import HyperProgramBlock from 'components/molecules/programs/HyperProgramBlock';
import ArrayUtilities from 'utils/ArrayUtilities';

/**
 * Molecule component used to render platform programs list
 * @param platform
 * @param isDisabled
 * @param blockClassName
 */
const PlatformPrograms = ({ platform, isDisabled, blockClassName = '' }) => {
  if (!ArrayUtilities.isNonEmptyArray(platform.programs)) {
    return null;
  }

  return (
    <>
      {platform.programs.map(program => (
        <div className={blockClassName} key={`program_${program.id}`}>
          <HyperProgramBlock {...{ program, platform, isDisabled }} />
        </div>
      ))}
    </>
  );
};

export default PlatformPrograms;
