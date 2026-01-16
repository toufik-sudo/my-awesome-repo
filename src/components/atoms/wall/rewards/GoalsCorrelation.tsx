import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

/**
 * Atom component used to render goals correlation
 * @param correlatedGoals
 * @param tag
 * @param className
 * @constructor
 */
const GoalsCorrelation = ({ correlatedGoals, tag = HTML_TAGS.SPAN, className = '' }) => (
  <DynamicFormattedMessage
    id={`wall.intro.rewards.mechanisms.${correlatedGoals ? 'correlated' : 'notCorrelated'}`}
    tag={tag}
    className={className}
  />
);

export default GoalsCorrelation;
