import React from 'react';
import { useSelector } from 'react-redux';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import { LAUNCH_PROGRAM, FULL } from 'constants/wall/launch';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { IStore } from 'interfaces/store/IStore';
import { LAUNCH } from 'constants/general';

import style from 'assets/style/components/launch/UserListDownload.module.scss';
import coreStyle from '../../../../sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render user list titles
 *
 * @constructor
 */
const UserListMainTitle = () => {
  const { programJourney } = useSelector((store: IStore) => store.launchReducer);
  return (
    <>
      <LaunchProgramTitle
        titleId={`${LAUNCH_PROGRAM}.title`}
        subtitleId={`welcome.page.launch.${programJourney}${programJourney == FULL ? LAUNCH : ''}`}
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <DynamicFormattedMessage
        className={style.userListTitle}
        id={`${LAUNCH_PROGRAM}.users.download.template`}
        tag="h6"
      />
    </>
  );
};

export default UserListMainTitle;
