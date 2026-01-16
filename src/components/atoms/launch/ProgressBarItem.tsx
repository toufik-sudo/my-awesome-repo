import React from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import { useActiveStep } from 'hooks/launch/useActiveStep';
import { objectToArrayKey } from 'utils/general';
import { getOnlyQuickLaunchSteps, processBarItemStyle } from 'services/LaunchServices';
import { LAUNCH_STEP_TYPES, QUICK_LAUNCH_AVAILABLE_STEPS, FULL_LAUNCH_AVAILABLE_STEPS } from 'constants/wall/launch';
import { HTML_TAGS, NAME, QUICK } from 'constants/general';
import { PRODUCTS, RESULTS, REWARDS, REWARDS_FULL } from 'constants/wall/launch';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { IStore } from 'interfaces/store/IStore';

import style from 'assets/style/components/launch/ProgressBar.module.scss';

/**
 * Atom component used to display progress bar item
 *
 * @param steps
 * @param index
 * @param stepKey
 * @constructor
 */
const ProgressBarItem = ({ steps, index, stepKey }) => {
  const { step } = useParams();
  const { programJourney } = useSelector((store: IStore) => store.launchReducer);
  const launchSteps = programJourney === QUICK ? QUICK_LAUNCH_AVAILABLE_STEPS : FULL_LAUNCH_AVAILABLE_STEPS;
  let currentActiveStep = useActiveStep(
    objectToArrayKey(getOnlyQuickLaunchSteps(LAUNCH_STEP_TYPES, launchSteps), NAME)
  );

  if (programJourney === QUICK && launchSteps.length - 1 === currentActiveStep) {
    currentActiveStep = FULL_LAUNCH_AVAILABLE_STEPS.length;
  }

  const { progressAvailable, progressActive, progressCompleted } = processBarItemStyle(
    { step, steps, stepKey, currentActiveStep },
    index,
    style
  );

  const disabledSteps = [PRODUCTS, RESULTS, REWARDS, REWARDS_FULL];
  const isStepDisabled = disabledSteps.includes(steps[stepKey].name);

  return (
    <DynamicFormattedMessage
      data-tip
      data-for={isStepDisabled && 'elementToolTip'}
      tag={HTML_TAGS.LI}
      className={`${style.progressBarStep} ${progressActive} ${progressAvailable} ${progressCompleted}`}
      id={`launch.progress.step.${steps[stepKey].name}`}
    />
  );
};

export default ProgressBarItem;
