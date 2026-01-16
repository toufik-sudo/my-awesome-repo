import React from 'react';

import BaseAllocation from 'components/organisms/launch/cube/allocationForms/BaseAllocation';
import { RANKING_INPUT_TYPE, RANKING } from 'constants/wall/launch';

/**
 * Organism component used to render ranking allocation
 *
 * @param props
 * @constructor
 */
const RankingAllocation = props => <BaseAllocation {...{ inputType: RANKING_INPUT_TYPE, type: RANKING, ...props }} />;

export default RankingAllocation;
