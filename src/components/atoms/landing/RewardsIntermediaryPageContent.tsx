import React from 'react';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { POINT_VALUE, QUICK } from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';
import { DynamicFormattedMessage } from '../ui/DynamicFormattedMessage';

import componentStyle from 'assets/style/components/Rewards/RewardsIntermediaryPage.module.scss';

const { rewardsIcon, rewardsInfo, rewardsCommitmentNote } = componentStyle;

const RewardsIntermediaryPageContent = () => {
  const launchData = useSelector((store: IStore) => store.launchReducer);
  const { programJourney } = launchData;
  const isFullLaunch = programJourney !== QUICK;

  return (
    <>
      <FontAwesomeIcon className={rewardsIcon} icon={faCubes} />
      <p className={rewardsInfo}>
        <DynamicFormattedMessage tag="span" id="launchProgram.rewards.info" />
        {isFullLaunch && <DynamicFormattedMessage tag="span" id="launchProgram.rewards.info.full.launch" />}
      </p>
      <DynamicFormattedMessage tag="p" id="launchProgram.rewards.note" values={{ pointValue: POINT_VALUE }} />
      <p>
        <DynamicFormattedMessage tag="span" id="launchProgram.rewards.commitment" />
        <DynamicFormattedMessage
          className={rewardsCommitmentNote}
          tag="span"
          id="launchProgram.rewards.commitment.note"
        />
      </p>
    </>
  );
};

export default RewardsIntermediaryPageContent;
