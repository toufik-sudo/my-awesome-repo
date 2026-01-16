import React from 'react';

import CubeAllocationMechanism from './CubeAllocationMechanism';
import GoalsCorrelation from './GoalsCorrelation';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

/**
 * Component used to render cube mechanisms description
 * @param programType
 * @param mechanisms
 * @param correlatedGoals
 * @param style
 * @constructor
 */
const CubeAllocationMechanisms = ({ programType, mechanisms, correlatedGoals, style = {} }) => {
  const mechanismsCount = mechanisms.length;

  return (
    <DynamicFormattedMessage
      tag={HTML_TAGS.P}
      id="wall.intro.rewards.mechanisms.layout"
      values={{
        mechanisms: mechanisms.map(({ allocationType, type }, index) => (
          <DynamicFormattedMessage
            key={`cube_mechanism_${allocationType}_${index}`}
            id="wall.intro.rewards.mechanisms"
            tag={HTML_TAGS.SPAN}
            values={{
              correlation: <GoalsCorrelation correlatedGoals={correlatedGoals} />,
              mechanism: <CubeAllocationMechanism {...{ programType, type, style: style[allocationType] }} />,
              position: index === mechanismsCount - 1 && mechanismsCount > 1 ? 'last' : index === 0 ? 'first' : 'inner'
            }}
          />
        ))
      }}
    />
  );
};

export default CubeAllocationMechanisms;
