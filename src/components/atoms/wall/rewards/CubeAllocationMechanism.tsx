import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to render cube mechanisms description
 * @param allocationType
 * @param programType
 * @param style
 * @constructor
 */
const CubeAllocationMechanism = ({ type, programType, style }) => (
  <DynamicFormattedMessage
    tag={HTML_TAGS.SPAN}
    id={`wall.intro.rewards.mechanism.${type.toLowerCase()}`}
    values={{ programType }}
    className={coreStyle.withBoldFont}
    style={style}
  />
);

export default CubeAllocationMechanism;
