import React from 'react';

import SimpleAllocation from 'components/organisms/launch/cube/allocationForms/SimpleAllocation';
import BracketAllocation from 'components/organisms/launch/cube/allocationForms/BracketAllocation';
import GrowthAllocation from 'components/organisms/launch/cube/allocationForms/GrowthAllocation';
import RankingAllocation from 'components/organisms/launch/cube/allocationForms/RankingAllocation';
import { BRACKET, SIMPLE, GROWTH, RANKING } from 'constants/wall/launch';

/**
 * Organism component used to render a dynamic cube component
 * @param tag
 * @param index
 * @constructor
 */
const DynamicCubeComponent = ({ tag, index, activeTypeForm }) => {
  const components = {
    [SIMPLE]: SimpleAllocation,
    [BRACKET]: BracketAllocation,
    [GROWTH]: GrowthAllocation,
    [RANKING]: RankingAllocation
  };
  const TagName = components[tag];

  return <TagName {...{ index, activeTypeForm }} />;
};

export default DynamicCubeComponent;
