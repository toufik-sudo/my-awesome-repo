import React from 'react';

import RewardDetails from 'components/atoms/wall/rewards/RewardDetails';
import AllocationDetails from 'components/atoms/wall/rewards/AllocationDetails';
import { BRACKET_INPUT_TYPE } from 'constants/wall/launch';
import { getBracketLabelsByProgramAndMeasurementType } from 'services/CubeServices';
import { hasNonNullValue } from 'utils/general';

/**
 * Component used to render a simple allocation description
 * @param main
 * @param measurementType
 * @param programType
 * @param style
 * @constructor
 */
const SimpleAllocationDetails = ({ main, measurementType, programType, style, measurementName = null }) => {
  if (!main) {
    return null;
  }

  if (measurementName == 'action') {
    measurementType = 3;
  }

  // this seems to be the `single bracket` version of a bracket allocation
  const labels = getBracketLabelsByProgramAndMeasurementType(programType, measurementType, BRACKET_INPUT_TYPE);

  const hasRewardOnly = !hasNonNullValue(main.min) && !hasNonNullValue(main.max);
  if (hasRewardOnly) {
    return <RewardDetails {...{ programType, unit: labels.value, value: main.value, style }} />;
  }

  return <AllocationDetails {...{ values: main, labels, programType, style, measurementName }} />;
};

export default SimpleAllocationDetails;
