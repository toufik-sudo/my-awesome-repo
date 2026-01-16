import React from 'react';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import CubeRewardsTitles from 'components/molecules/launch/cube/CubeRewardsTitles';
import FrequencyAllocationOptionList from 'components/organisms/launch/cube/FrequencyAllocationOptionList';
import CubeRadioValidate from 'components/atoms/launch/cube/CubeRadioValidate';
import { useCubeFrequencyAllocation } from 'hooks/launch/cube/useCubeFrequencyAllocation';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Organism component used to render frequency allocation section
 *
 * @constructor
 */
const FrequencyAllocation = () => {
  const { cubeContent, cubeSectionWrapper, cubeSectionDisabled, cubeFrequencyWrapper } = style;
  const {
    setSelectedFrequency,
    selectedFrequency,
    frequencyTypes,
    modifyShouldDisplay,
    handleFrequencyValidation,
    validateShouldDisplay,
    frequencyValidated
  } = useCubeFrequencyAllocation();

  return (
    <>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.cube.subtitle"
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <div className={`${cubeSectionWrapper} ${cubeContent} ${cubeFrequencyWrapper}`}>
        {modifyShouldDisplay && (
          <CubeRadioValidate {...{ action: handleFrequencyValidation, payload: selectedFrequency, type: true }} />
        )}
        <div className={`${frequencyValidated ? cubeSectionDisabled : ''}`}>
          <CubeRewardsTitles type="frequency" />
          <FrequencyAllocationOptionList {...{ selectedFrequency, frequencyTypes, setSelectedFrequency }} />
          {validateShouldDisplay && (
            <CubeRadioValidate {...{ action: handleFrequencyValidation, payload: selectedFrequency, type:false }} />
          )}
        </div>
      </div>
    </>
  );
};

export default FrequencyAllocation;
