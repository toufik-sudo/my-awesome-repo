import React from 'react';

import SendInvitationsLabel from 'components/molecules/launch/userInviteInfo/SendInvitationsLabel';
import SendInvitationsControls from 'components/molecules/launch/userInviteInfo/SendInvitationsControls';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useUserInviteConfirmation } from 'hooks/launch/userInvitationFields/useUserInviteConfirmation';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_MULTIPLIER } from 'constants/animations';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';

/**
 * Molecule component used to render email invitation section of user invites
 *
 * @param selectedFields
 * @constructor
 */
const UserInviteConfirmation = ({ selectedFields }) => {
  const { section, uploadFileList } = style;
  const { submitUserInviteListDecline, isClosedProgram, submitUserInviteFieldList } = useUserInviteConfirmation(
    selectedFields
  );

  if (!selectedFields.length) return null;

  return (
    <SpringAnimation settings={setTranslate(DELAY_MULTIPLIER)} className={section}>
      <>
        <SendInvitationsLabel />
        {isClosedProgram && (
          <DynamicFormattedMessage className={uploadFileList} tag="p" id="launchProgram.users.uploadUserFileList" />
        )}
        <SendInvitationsControls {...{ submitUserInviteFieldList, submitUserInviteListDecline }} />
      </>
    </SpringAnimation>
  );
};

export default UserInviteConfirmation;
