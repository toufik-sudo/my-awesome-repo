import React from 'react';
import { useSelector } from 'react-redux';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { CLOSED } from 'constants/general';
import { IStore } from 'interfaces/store/IStore';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';

/**
 * Molecule component used to render invitation controls
 *
 * @param submitUserInviteFieldList
 * @param submitUserInviteListDecline
 * @constructor
 *
 * @see SendInvitationsControlsStory
 */
const SendInvitationsControls = ({ submitUserInviteFieldList, submitUserInviteListDecline }) => {
  const { confidentiality } = useSelector((store: IStore) => store.launchReducer);
  const isClosedProgram = confidentiality === CLOSED;
  const declineButtonType = isClosedProgram ? BUTTON_MAIN_TYPE.DISABLED : BUTTON_MAIN_TYPE.DANGER;

  return (
    <div className={style.buttonWrapper}>
      {isClosedProgram && (
        <DynamicFormattedMessage tag={Button} onClick={submitUserInviteFieldList} id="form.submit.next" />
      )}
      {!isClosedProgram && (
        <>
          <DynamicFormattedMessage tag={Button} onClick={submitUserInviteFieldList} id="form.label.radio.accept" />
          <DynamicFormattedMessage
            type={declineButtonType}
            tag={Button}
            onClick={submitUserInviteListDecline}
            id="form.label.radio.decline"
          />
        </>
      )}
    </div>
  );
};

export default SendInvitationsControls;
