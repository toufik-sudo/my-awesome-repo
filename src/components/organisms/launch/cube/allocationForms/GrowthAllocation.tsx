import React from 'react';

import BaseAllocation from 'components/organisms/launch/cube/allocationForms/BaseAllocation';
import { GROWTH_INPUT_TYPE } from 'constants/wall/launch';

/**
 * Organism component used to render bracket allocation
 *
 * @param props
 * @constructor
 */
const GrowthAllocation = props => <BaseAllocation {...{ inputType: GROWTH_INPUT_TYPE, ...props }} />;

export default GrowthAllocation;
