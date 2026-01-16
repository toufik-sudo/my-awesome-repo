import React from 'react';
import ReactTooltip from 'react-tooltip';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import ProgressBarItem from 'components/atoms/launch/ProgressBarItem';
import { processLaunchSteps } from 'services/LaunchServices';
import {
  FREEMIUM,
  FREEMIUM_FULL_LAUNCH_AVAILABLE_STEPS,
  FREEMIUM_QUICK_LAUNCH_AVAILABLE_STEPS,
  FULL_LAUNCH_AVAILABLE_STEPS,
  LAUNCH_STEP_TYPES,
  QUICK_LAUNCH_AVAILABLE_STEPS,
  REWARDS
} from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';
import { QUICK } from 'constants/general';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import style from 'assets/style/components/launch/ProgressBar.module.scss';

/**
 * Molecule component used to render progress bar list
 *
 * @constructor
 */
const ProgressBarList = () => {
  const { programJourney, type } = useSelector((store: IStore) => store.launchReducer);
  const isQuick = programJourney === QUICK;
  const { formatMessage } = useIntl();
  const isFreemium = type === FREEMIUM;
  let launchSteps;

  if (isFreemium) {
    launchSteps = isQuick ? FREEMIUM_QUICK_LAUNCH_AVAILABLE_STEPS : FREEMIUM_FULL_LAUNCH_AVAILABLE_STEPS;
  } else {
    launchSteps = isQuick ? QUICK_LAUNCH_AVAILABLE_STEPS : FULL_LAUNCH_AVAILABLE_STEPS;
  }
  const steps = processLaunchSteps(LAUNCH_STEP_TYPES, launchSteps);
  const { progressBarWrapper, progressBar } = style;

  const getToolTip = () => {
    if (isFreemium) {
      return (
        <ReactTooltip
          id="elementToolTip"
          place={TOOLTIP_FIELDS.PLACE_BOTTOM}
          effect={TOOLTIP_FIELDS.EFFECT_SOLID}
          clickable={'none'}
        >
          {formatMessage({ id: `launchProgram.sectionIndicator.tooltip.message` })}
        </ReactTooltip>
      );
    }
  };

  return (
    <div className={progressBarWrapper}>
      <ul className={progressBar}>
        {Object.keys(steps).map((stepKey, index) => {
          if (!programJourney && steps[stepKey].name === REWARDS) return null;
          if (programJourney && steps[stepKey].except === programJourney) return null;

          return <ProgressBarItem key={stepKey} {...{ stepKey, index, steps }} />;
        })}
        {getToolTip()}
      </ul>
    </div>
  );
};

export default ProgressBarList;
