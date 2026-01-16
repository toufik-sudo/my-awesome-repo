import React from 'react';

import AllocationValue from 'components/atoms/wall/rewards/AllocationValue';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { hasNonNullValue } from 'utils/general';

/**
 * Component used to render allocation details
 * @param values
 * @param labels
 * @param tag
 * @param style
 * @constructor
 */
const AllocationDetails = ({ values, labels, tag = HTML_TAGS.P, style, measurementName = null }) => {
  const prefix = 'wall.intro.rewards.mechanism.allocation.details';
  let messageTemplate = prefix;
  const hasMinThreshold = !!values.min && hasNonNullValue(values.min) && !!Number(values.min);
  const hasMaxThreshold = !!values.max && hasNonNullValue(values.max) && !!Number(values.max);
  if (!hasMinThreshold || !hasMaxThreshold) {
    const messageSuffix = hasMinThreshold ? 'from' : 'to';
    messageTemplate = `${prefix}.${messageSuffix}`;
  }

  if (!Number(values.min) && !Number(values.max)) {
    messageTemplate = prefix + '.none';
  }

  return (
    <DynamicFormattedMessage
      tag={tag}
      id={messageTemplate}
      values={{
        from: <AllocationValue {...{ value: values.min, unit: labels.min, style, measurementName }} />,
        to: <AllocationValue {...{ value: values.max, unit: labels.max, style, measurementName }} />,
        reward: <AllocationValue {...{ value: values.value, unit: labels.value, style, isReward: true, measurementName }} />
      }}
    />
  );
};

export default AllocationDetails;
