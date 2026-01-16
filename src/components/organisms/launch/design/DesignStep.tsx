import React, { useState } from 'react';

import CompanyDesign from 'components/organisms/launch/design/CompanyDesign';
import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import DesignNextStep from 'components/atoms/launch/design/DesignNextStep';
import CompanyColors from 'components/organisms/launch/design/CompanyColors';
import CompanyFonts from 'components/organisms/launch/design/CompanyFonts';
import { useDesignDataSave } from 'hooks/launch/design/useDesignDataSave';

import style from 'assets/style/components/launch/Design.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render step
 *
 * @constructor
 */
const DesignStep = () => {
  const companyNameState = useState('');
  const { handleNextStep, allDataValid, isLoading } = useDesignDataSave(companyNameState);

  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.design.subtitle"
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <div className={style.designContent}>
        <CompanyDesign {...{ companyNameState }} />
        <CompanyColors />
        <CompanyFonts />
      </div>
      <div className={coreStyle.btnCenter}>
        <DesignNextStep {...{ allDataValid, handleNextStep, isLoading }} />
      </div>
    </div>
  );
};

export default DesignStep;
