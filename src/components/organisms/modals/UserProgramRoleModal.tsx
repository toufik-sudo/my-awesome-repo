import React, { useCallback } from 'react';

import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import ManageUsersList from 'components/molecules/wall/user-details/userManagement/ManageUsersList';
import ProgramRoleOptions from 'components/molecules/wall/user-details/userManagement/ProgramRoleOptions';
import useUserProgramRole from 'hooks/user/useUserProgramRole';
import useUserProgramRoleModalData from 'hooks/modals/useUserProgramRoleModal';
import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_VARIANT, BUTTON_MAIN_TYPE } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { emptyFn } from 'utils/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render user program role
 * @param userId
 * @param refreshPrograms
 * @constructor
 */
const UserProgramRoleModal = ({ userDetails, refreshPrograms }) => {
  const { displayFlex, withPrimaryColor, maxWidth50, w100, textLg, borderRadius1, pb5, heightAuto, mt5 } = coreStyle;
  const {
    modalState: { data, active },
    closeModal
  } = useUserProgramRoleModalData();

  const onUserRoleUpdated = useCallback(
    wasRoleChanged => {
      wasRoleChanged && refreshPrograms();
      closeModal();
    },
    [refreshPrograms]
  );

  const {
    isPeopleManager,
    setIsPeopleManager,
    users,
    setManagedStatus,
    allManaged,
    setAllManagedStatus,
    isValidating,
    validate
  } = useUserProgramRole(userDetails, data.program, onUserRoleUpdated);

  return (
    <FlexibleModalContainer
      className={`${displayFlex} ${borderRadius1} ${heightAuto} ${pb5} ${maxWidth50} ${coreStyle['flex-direction-column']}`}
      isModalOpen={active}
      closeModal={isValidating ? emptyFn : closeModal}
      animationClass={w100}
    >
      <>
        <DynamicFormattedMessage
          tag={HTML_TAGS.H4}
          id="wall.user.program.role"
          className={`${withPrimaryColor} ${textLg}`}
        />
        <ProgramRoleOptions {...{ isPeopleManager, setIsPeopleManager }} />

        {isPeopleManager && (
          <ManageUsersList
            {...users}
            {...{ managerUuid: userDetails.uuid, setManagedStatus, allManaged, setAllManagedStatus, isValidating }}
          />
        )}

        <DynamicFormattedMessage
          tag={Button}
          onClick={validate}
          id="label.button.validate"
          variant={BUTTON_MAIN_VARIANT.INVERTED}
          type={BUTTON_MAIN_TYPE.PRIMARY}
          loading={isValidating}
          className={mt5}
        />
      </>
    </FlexibleModalContainer>
  );
};

export default UserProgramRoleModal;
