import React, { useContext } from 'react';
import NavigationPrompt from 'react-router-navigation-prompt';

import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import LeaveJourneyModal from 'components/organisms/modals/LeaveJourneyModal';
import MultiStepWrapper from 'components/molecules/launch/MultiStepWrapper';
import PageIndexList from 'components/organisms/launch/PageIndexList';
import Loading from 'components/atoms/ui/Loading';
import { UserContext } from 'components/App';
import { LOADER_TYPE, WALL_TYPE } from 'constants/general';
import { LAUNCH_BASE, LOGIN } from 'constants/routes';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';

/**
 * Template component used to render quick launch page
 *
 * @constructor
 */
const LaunchPage = () => {
  const { userData, imgLoaded } = useContext(UserContext);

  if (!userData.firstName && !imgLoaded) return <Loading type={LOADER_TYPE.INTERMEDIARY} />;

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <NavigationPrompt
        when={(currentLocation, nextLocation) =>
          nextLocation &&
          !(
            (nextLocation.pathname !== LAUNCH_BASE && nextLocation.pathname.startsWith(LAUNCH_BASE)) ||
            nextLocation.pathname.includes(LOGIN)
          )
        }
      >
        {({ onConfirm, onCancel }) => (
          <LeaveJourneyModal
            visible={true}
            onCancel={onCancel}
            onConfirm={onConfirm}
            titleId="modal.launch.exit.title"
          />
        )}
      </NavigationPrompt>
      <div className={style.generalWallStructure}>
        <MultiStepWrapper />
        <PageIndexList />
      </div>
    </LeftSideLayout>
  );
};

export default LaunchPage;
