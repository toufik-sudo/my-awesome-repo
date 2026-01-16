import React from 'react';

import CubeRadioValidate from 'components/atoms/launch/cube/CubeRadioValidate';
import RewardedManagersOptions from 'components/molecules/launch/cube/RewardedManagersOptions';
import RewardedManagerInputGroup from 'components/molecules/launch/cube/RewardedManagerInputGroup';
import CubeSectionTitle from 'components/atoms/launch/cube/CubeSectionTitle';
import { useRewardManagers } from 'hooks/launch/cube/rewardManagers/userRewardManagers';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Organism component used to render spend type selection
 *
 * @constructor
 */
const RewardedManagers = () => {
  const { cubeContent, cubeSectionWrapper, cubeFrequencyWrapper, cubeSectionDisabled, cubeValiditySection } = style;
  const {
    setAcceptsRewardManagers,
    acceptsRewardManagers,
    selectedRewardManagers,
    setRewardManagers,
    sectionShouldDisplay,
    modifyShouldDisplay,
    validateShouldDisplay,
    rewardsManagerValidated,
    handleRewardsManagersValidation,
    fieldError
  } = useRewardManagers();

  if (!sectionShouldDisplay) return null;

  return (
    <div className={`${cubeSectionWrapper} ${cubeContent} ${cubeFrequencyWrapper} ${cubeValiditySection}`}>
      {modifyShouldDisplay && (
        <CubeRadioValidate
          {...{ action: handleRewardsManagersValidation, payload: selectedRewardManagers, type: true }}
        />
      )}
      <div className={`${rewardsManagerValidated ? cubeSectionDisabled : ''}`}>
        <CubeSectionTitle type="rewardedManagers" />
        <RewardedManagersOptions {...{ setAcceptsRewardManagers, acceptsRewardManagers }} />
        {acceptsRewardManagers && (
          <RewardedManagerInputGroup {...{ selectedRewardManagers, setRewardManagers, fieldError }} />
        )}
        {validateShouldDisplay && (
          <CubeRadioValidate
            {...{ action: handleRewardsManagersValidation, payload: selectedRewardManagers, type: false }}
          />
        )}
      </div>
    </div>
  );
};

export default RewardedManagers;
