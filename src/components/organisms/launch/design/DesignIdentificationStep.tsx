import React from 'react';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import DesignNextStep from 'components/atoms/launch/design/DesignNextStep';
import DesignIdentificationWrapper from './DesignIdentificationWrapper';
import { useDesignIdentificationDataSave } from 'hooks/launch/design/useDesignIdentificationDataSave';

import labelStyle from 'assets/style/components/launch/Launch.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render Design Identification Step
 *
 * @constructor
 */
const DesignIdentificationStep = () => {
  const {
    handleNextStep,
    allDataValid,
    isLoading,
    hasError,
    hasContentError,
    designNameState,
    designTextState
  } = useDesignIdentificationDataSave();

  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.designIdentification.title"
        subtitleCustomClass={labelStyle.brandSubtitle}
      />
      <DesignIdentificationWrapper {...{ designNameState, designTextState, hasError, hasContentError }} />
      <div className={coreStyle.btnCenter}>
        <DesignNextStep {...{ allDataValid, handleNextStep, isLoading }} />
      </div>
    </div>
  );
};

export default DesignIdentificationStep;
