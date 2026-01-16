import React, { useState } from 'react';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import GoalSelectionsList from 'components/molecules/launch/cube/GoalSelectionsList';
import GoalsList from 'components/organisms/launch/cube/GoalsList';
import CubeRewardsTitles from 'components/molecules/launch/cube/CubeRewardsTitles';
import { INITIAL_GOAL_INDEX } from 'constants/wall/launch';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Page component used to render full page cube
 *
 * @constructor
 */
const FullCubePage = () => {
  const [selectedGoal, setSelectedGoal] = useState(INITIAL_GOAL_INDEX);
  const { cubeWrapper, cubeContent } = style;

  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.cube.subtitle"
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <div className={cubeWrapper}>
        <div className={cubeContent}>
          <div>
            <CubeRewardsTitles type="defineGoal" />
            <GoalSelectionsList {...{ selectedGoal, setSelectedGoal }} />
            <GoalsList {...{ selectedGoal, setSelectedGoal }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullCubePage;
