import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

/**
 * Atom component used to render optimal resolution information
 *
 * @param size
 * @constructor
 */
const ExtendedOptimalResolution = ({ size }) => {
  return (
    <>
      <DynamicFormattedMessage tag="p" id="launchProgram.designIdentification.cover.type" />
      <DynamicFormattedMessage tag="p" id="launchProgram.designIdentification.cover.tips" />
      <DynamicFormattedMessage tag="p" id="launchProgram.designIdentification.cover.size" values={{ size }} />
    </>
  );
};

export default ExtendedOptimalResolution;
