import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to render allocation value & unit
 * @param value
 * @param unit
 * @param isReward
 * @param style
 * @constructor
 */
const AllocationValue = ({ value, unit, isReward = false, style, measurementName = null }) => {
  return (
    <DynamicFormattedMessage
      tag={HTML_TAGS.SPAN}
      id={`wall.intro.rewards.mechanism.allocation.${isReward ? 'reward' : 'value'}`}
      values={{
        value,
        unit: !isReward && measurementName == 'action' && unit && unit.value == 'sales' ? 'actions' :  unit && unit.value
      }}
      className={coreStyle.withBoldFont}
      style={style}
    />
  );
};

export default AllocationValue;
