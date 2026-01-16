import React from 'react';

import Button from 'components/atoms/ui/Button';
import { useMultiStep } from 'hooks/launch/useMultiStep';

/**
 * Temporary component, should be removed once we have first step in cube
 *
 * @constructor
 */
const TemporaryCubeComponent = () => {
  const {
    stepSet: { setNextStep }
  } = useMultiStep();

  return (
    <div>
      <Button onClick={() => setNextStep()}>Next</Button>
    </div>
  );
};

export default TemporaryCubeComponent;
