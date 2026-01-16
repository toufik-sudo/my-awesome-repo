import React from 'react';

import AllocationValue from 'components/atoms/wall/rewards/AllocationValue';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

/**
 * Component used to render rewarded value for simple allocation with value only.
 * @param values
 * @param labels
 * @param tag
 * @param style
 * @constructor
 */
const RewardDetails = ({ programType, value, unit, style }) => {
  return (
    <DynamicFormattedMessage
      tag={HTML_TAGS.P}
      id={`wall.intro.rewards.mechanism.allocation.details.rewards.${unit.value}`}
      values={{
        programType,
        reward: <AllocationValue {...{ value, unit, style }} />
      }}
    />
  );
};

export default RewardDetails;
