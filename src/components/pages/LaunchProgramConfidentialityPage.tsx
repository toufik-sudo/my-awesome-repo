import React from 'react';
import { useSelector } from 'react-redux';

import LaunchProgramRowList from 'components/organisms/launch/program/LaunchProgramRowList';
import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import { PROGRAM_BUTTON_FIELDS_2 } from 'constants/wall/programButtons';
import { IStore } from 'interfaces/store/IStore';
import { redirectToFirstStep } from 'services/LaunchServices';
import { FULL } from 'constants/wall/launch';
import { LAUNCH } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Template component used to Create a new program confidentiality
 *
 * @constructor
 */
const LaunchProgramConfidentiality = () => {
  const { type } = useSelector((store: IStore) => store.launchReducer);
  const { programJourney } = useSelector((store: IStore) => store.launchReducer);
  if (!type) redirectToFirstStep();

  return (
    <>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId={`welcome.page.launch.${programJourney}${programJourney == FULL ? LAUNCH : ''}`}
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <LaunchProgramRowList
        buttons={PROGRAM_BUTTON_FIELDS_2}
        sectionText="launchProgram.confidentiality."
        imgFile={type}
        extraClass="hideLastBtn"
        programType
      />
    </>
  );
};

export default LaunchProgramConfidentiality;
