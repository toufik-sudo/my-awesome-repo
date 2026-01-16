import React from 'react';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import RewardsBlockList from '../organisms/launch/rewards/RewardsBlockList';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Page component used to render 1th page from rewards
 */
const RewardsGoalRelationsPage = () => (
  <>
    <LaunchProgramTitle titleId="launchProgram.title" subtitleCustomClass={coreStyle.withSecondaryColor} />
    <RewardsBlockList />
  </>
);

export default RewardsGoalRelationsPage;
