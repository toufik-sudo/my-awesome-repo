import React from 'react';

import BaseAllocation from 'components/organisms/launch/cube/allocationForms/BaseAllocation';
import { BRACKET_INPUT_TYPE } from 'constants/wall/launch';

/**
 * Organism component used to render bracket allocation
 *
 * @param props
 * @constructor
 */
const BracketAllocation = props => <BaseAllocation {...{ inputType: BRACKET_INPUT_TYPE, ...props }} />;

export default BracketAllocation;
