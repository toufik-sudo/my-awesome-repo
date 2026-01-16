import React from 'react';
import { useSelector } from 'react-redux';

import PersonaliseProgramFormWrapper from 'components/organisms/form-wrappers/PersonaliseProgramFormWrapper';
import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import { IStore } from 'interfaces/store/IStore';
import { FULL } from 'constants/wall/launch';
import { LAUNCH } from 'constants/general';
import coreStyle from '../../sass-boilerplate/stylesheets/style.module.scss';

/**
 * Template component used to render Program parameters
 *
 * @constructor
 */
const LaunchProgramParameters = () => {
  const { programJourney } = useSelector((store: IStore) => store.launchReducer);

  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId={`welcome.page.launch.${programJourney}${programJourney == FULL ? LAUNCH : ''}`}
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <PersonaliseProgramFormWrapper />
    </div>
  );
};

export default LaunchProgramParameters;
