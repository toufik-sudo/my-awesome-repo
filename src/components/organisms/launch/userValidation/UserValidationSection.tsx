import React from 'react';
import { useSelector } from 'react-redux';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import UserValidationFields from 'components/molecules/launch/userValidation/UserValidationFields';
import { IStore } from 'interfaces/store/IStore';
import { CLOSED, LAUNCH } from 'constants/general';
import { redirectToFirstStep } from '../../../../services/LaunchServices';
import { FULL } from 'constants/wall/launch';
import coreStyle from '../../../../sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render User Validation section
 *
 * @constructor
 */
const UserValidationSection = () => {
  const { confidentiality, type, programJourney } = useSelector((store: IStore) => store.launchReducer);
  const isClosedProgram = confidentiality === CLOSED;
  if (!isClosedProgram || !type) {
    redirectToFirstStep();
  }

  return (
    <>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId={`welcome.page.launch.${programJourney}${programJourney == FULL ? LAUNCH : ''}`}
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <UserValidationFields />
    </>
  );
};

export default UserValidationSection;
