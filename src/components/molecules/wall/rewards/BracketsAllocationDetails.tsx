import React from 'react';

import AllocationDetails from 'components/atoms/wall/rewards/AllocationDetails';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { BRACKET_INPUT_TYPE } from 'constants/wall/launch';
import { buildEmbbededHtmlPart } from 'services/IntlServices';
import { getBracketLabelsByProgramAndMeasurementType } from 'services/CubeServices';

/**
 * Component used to render cube mechanisms description
 *
 * @constructor
 */
const BracketsAllocationDetails = ({
  brackets,
  goalType,
  measurementType,
  inputType = BRACKET_INPUT_TYPE,
  programType,
  style,
  measurementName
}) => {
  if (measurementName == 'action') {
    measurementType = 3;
  }
  
  const labels = getBracketLabelsByProgramAndMeasurementType(programType, measurementType, inputType);

  return brackets.map(bracket => (
    <DynamicFormattedMessage
      key={`bracket_${bracket.crt}_${bracket.value}`}
      tag={HTML_TAGS.P}
      id={`wall.intro.rewards.mechanism.bracket`}
      values={{
        bracket: bracket.crt,
        bracketType: goalType,
        allocationDetails: <AllocationDetails {...{ tag: HTML_TAGS.SPAN, values: bracket, labels, style, measurementName }} />,
        strong: buildEmbbededHtmlPart({ tag: HTML_TAGS.STRONG })
      }}
    />
  ));
};

export default BracketsAllocationDetails;
