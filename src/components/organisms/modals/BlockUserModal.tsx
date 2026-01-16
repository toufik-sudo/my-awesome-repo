import React from 'react';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { HTML_TAGS } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { USER_STATUS_OPERATION } from 'constants/wall/design';
import useBlockUserModal from 'hooks/modals/useBlockUserModal';

import style from 'assets/style/components/Modals/LogoutModal.module.scss';

/**
 * Pending block user organism component that renders pending block user modal
 *
 * @constructor
 */
const BlockUserModal = () => {
  const { closeModal, confirmModal, blockUserModalState } = useBlockUserModal();
  const { logOutModal, title } = style;

  return (
    <FlexibleModalContainer className={logOutModal} closeModal={closeModal} isModalOpen={blockUserModalState.active}>
      <div>
        <DynamicFormattedMessage
          tag={HTML_TAGS.H4}
          className={title}
          id={`wall.user.details.programs.${USER_STATUS_OPERATION[blockUserModalState.data.status]}`}
        />
        <DynamicFormattedMessage onClick={confirmModal} tag={Button} id="confirmation.cta.yes" />
        <DynamicFormattedMessage
          tag={Button}
          type={BUTTON_MAIN_TYPE.DANGER}
          onClick={closeModal}
          id="confirmation.cta.no"
        />
      </div>
    </FlexibleModalContainer>
  );
};

export default BlockUserModal;
