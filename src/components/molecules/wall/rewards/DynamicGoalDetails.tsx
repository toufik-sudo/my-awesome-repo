import React from 'react';

import BracketsAllocationDetails from 'components/molecules/wall/rewards/BracketsAllocationDetails';
import SimpleAllocationDetails from 'components/molecules/wall/rewards/SimpleAllocationDetails';
import {
  ALLOCATION_MECHANISM_TYPE,
  BRACKET,
  GROWTH,
  GROWTH_INPUT_TYPE,
  RANKING,
  RANKING_INPUT_TYPE,
  SIMPLE
} from 'constants/wall/launch';

/**
 * Component used to render goal details
 * @param programType
 * @param goal
 * @constructor
 */
const DynamicGoalDetails = ({ programType, goal, style = {} }) => {
  const goalType = ALLOCATION_MECHANISM_TYPE[goal.allocationType] || {};
  const allocationProps = {
    ...goal,
    goalType: goalType.type,
    programType,
    style: style[goal.allocationType],
    measurementName: goal.measurementName
  };

  switch (goalType.category) {
    case SIMPLE:
      return <SimpleAllocationDetails {...allocationProps} />;
    case BRACKET:
      return <BracketsAllocationDetails {...allocationProps} />;
    case GROWTH:
      return (
        <BracketsAllocationDetails
          {...{
            ...allocationProps,
            inputType: GROWTH_INPUT_TYPE
          }}
        />
      );
    case RANKING:
      return (
        <BracketsAllocationDetails
          {...{
            ...allocationProps,
            inputType: RANKING_INPUT_TYPE
          }}
        />
      );
    default:
      return null;
  }
};

export default DynamicGoalDetails;
