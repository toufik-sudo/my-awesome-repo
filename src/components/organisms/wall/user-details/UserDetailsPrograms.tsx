import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import BlockUserModal from 'components/organisms/modals/BlockUserModal';
import UserDetailsProgram from 'components/organisms/wall/user-details/UserDetailsProgram';
import UserProgramRoleModal from 'components/organisms/modals/UserProgramRoleModal';
import useUserProgramsDetailsData from 'hooks/user/useUserProgramsDetailsData';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { FINISHED, ONGOING, PENDING } from 'constants/wall/users';
import { setModalState } from 'store/actions/modalActions';
import { USER_PROGRAM_ROLE_MODAL } from 'constants/modal';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDetails.module.scss';

/**
 * Organism component used to render user detials programs
 * @constructor
 */
const UserDetailsPrograms = ({ userDetails }) => {
  const { withPrimaryColor, withBoldFont, withFontLarge } = coreStyle;
  const { userDetailsPrograms } = style;
  const { uuid: userUuid } = userDetails;
  const {
    ongoingList,
    finishedList,
    pendingList,
    validateJoinRequest,
    isValidatingJoin,
    confirmJoinAction,
    refreshPrograms
  } = useUserProgramsDetailsData(userUuid);

  const dispatch = useDispatch();
  const openRoleModal = useCallback(program => dispatch(setModalState(true, USER_PROGRAM_ROLE_MODAL, { program })), [
    dispatch
  ]);

  return (
    <div className={userDetailsPrograms}>
      <DynamicFormattedMessage
        className={`${withFontLarge} ${withPrimaryColor} ${withBoldFont}`}
        id={'wall.user.details.programs.title'}
        tag={HTML_TAGS.P}
      />
      <UserDetailsProgram list={pendingList} type={PENDING} {...{ confirmJoinAction, isValidatingJoin }} />
      <UserDetailsProgram list={ongoingList} type={ONGOING} {...{ userUuid, refreshPrograms, openRoleModal }} />
      <UserDetailsProgram list={finishedList} type={FINISHED} />
      <UserProgramRoleModal {...{ userDetails, refreshPrograms }} />
      <BlockUserModal />
      <ConfirmationModal
        question="wall.user.details.programs.join.confirm"
        onAccept={validateJoinRequest}
        onAcceptArgs="payload"
      />
    </div>
  );
};

export default UserDetailsPrograms;
