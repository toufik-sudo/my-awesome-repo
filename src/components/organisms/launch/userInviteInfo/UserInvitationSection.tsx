import React from 'react';

import UserInformationMandatoryFields from 'components/molecules/launch/userInviteInfo/UserInformationMandatoryFields';
import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';

import coreStyle from '../../../../sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render Participants invitation for Users step
 *
 * @constructor
 */
const UserInvitationSection = () => (
  <div>
    <LaunchProgramTitle
      titleId="launchProgram.title"
      subtitleId="launchProgram.users.subtitle"
      subtitleCustomClass={coreStyle.withSecondaryColor}
    />
    <UserInformationMandatoryFields />
  </div>
);

export default UserInvitationSection;
