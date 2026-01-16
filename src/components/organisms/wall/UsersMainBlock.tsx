import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import SendUsersInvitation from 'components/molecules/wall/SendUsersInvitation';
import UsersList from 'components/molecules/wall/users/UsersList';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import useUserDeclarationsMenuControls from 'hooks/declarations/useUserDeclarationsMenuControls';
import GlobalSlider from 'components/molecules/wall/globalSlider/GlobalSlider';
import { DynamicFormattedMessage } from '../../atoms/ui/DynamicFormattedMessage';
import LinkBack from '../../atoms/ui/LinkBack';

import { IStore } from 'interfaces/store/IStore';
import { WALL_ROUTE } from 'constants/routes';
import { findProgramById } from 'services/ProgramServices';
import { HTML_TAGS, WALL_TYPE } from 'constants/general';
import { useWallRoute } from 'hooks/wall/useWallRoute';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import userHeaderStyle from 'sass-boilerplate/stylesheets/components/wall/UsersHeader.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import sliderStyle from 'sass-boilerplate/stylesheets/components/wall/ProgramsSlider.module.scss';
import declarationStyle from 'sass-boilerplate/stylesheets/components/wall/UsersDeclaration.module.scss';

/**
 * Organism component used to render Users Main Block
 *
 * @constructor
 */
const UsersMainBlock = () => {
  const { selectedProgramId, programs } = useSelector((store: IStore) => store.wallReducer);
  const program = useMemo(() => findProgramById(programs, selectedProgramId), [selectedProgramId, programs]);
  const { px4, mLargePx15, withShadowFullElement, borderRadius1, withBackgroundDefault } = coreStyle;
  const { isProgramSelectionLocked } = useUserDeclarationsMenuControls();
  const { userDeclarationListHeader } = declarationStyle;
  const { isUsersRoute } = useWallRoute();
  const { colorSidebar } = useSelectedProgramDesign();

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <div className={`${px4} ${mLargePx15}`}>
        <div className={` ${borderRadius1} ${withShadowFullElement} ${withBackgroundDefault}`}>
          <div
            style={{ background: isUsersRoute ? colorSidebar : '' }}
            className={` ${userHeaderStyle.usersHeaderDefaults} ${userDeclarationListHeader} ${tableStyle.tableHeaderResponsiveMobile} ${tableStyle.tablePage} ${coreStyle['flex-space-between']}`}
          >
            <LinkBack
              className={`${tableStyle.tableHeaderElem}`}
              to={WALL_ROUTE}
              messageId="wall.userDeclarations.back.to.wall"
            />
            <div className={coreStyle.relative}>
              <GlobalSlider
                key={`${selectedProgramId}${isProgramSelectionLocked}`}
                className={`${sliderStyle.white}  ${tableStyle.tableHeaderElem}`}
                isOnUserDeclarations={true}
              />
            </div>
            <SendUsersInvitation />
          </div>
          <UsersList programId={selectedProgramId} programStatus={program.programStatus} />
        </div>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id="users.note.teamManager" />
      </div>
    </LeftSideLayout>
  );
};

export default UsersMainBlock;
