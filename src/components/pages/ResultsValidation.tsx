import React from 'react';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import ResultsValidationFieldBlock from 'components/molecules/launch/resultsValidation/ResultsValidationFieldBlock';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import coreStyle from '../../sass-boilerplate/stylesheets/style.module.scss';
/**
 * Template component used to render Results Validation page
 *
 * @constructor
 */
const ResultsValidation = () => {
  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.resultValidation.subtitle"
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <div className={style.section}>
        <ResultsValidationFieldBlock />
      </div>
    </div>
  );
};

export default ResultsValidation;
