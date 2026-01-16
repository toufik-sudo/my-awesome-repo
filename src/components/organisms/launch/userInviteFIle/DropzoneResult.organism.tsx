import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import DropzoneResultLineDisplay from 'components/molecules/launch/userInviteList/DropzoneResultLineDisplay';
import UserInvitationResultNotice from 'components/molecules/launch/userInviteList/UserInvitationResultNotice';
import { LAUNCH } from 'constants/routes';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { useDropzoneSubmit } from 'hooks/launch/useDropzoneSubmit';
import { useResultNotice } from 'hooks/launch/useResultNotice';

import style from 'assets/style/components/launch/UserListDownload.module.scss';

/**
 * Organism component used to render userInviteList result
 *
 * @constructor
 */
const DropzoneResultOrganism = ({ uploadResponse, setUploadResponse }) => {
  const { userListResult, userListProceed, userListModify, userListResultButtons } = style;
  const history = useHistory();
  const { proceedUserList, setNextStep, removeFile } = useDropzoneSubmit();
  const { isLastStep, proceedAction } = useResultNotice(proceedUserList, uploadResponse, setNextStep);
  const {
    data: { totalLines, totalInvalid }
  } = uploadResponse;

  let resultOutput = <DropzoneResultLineDisplay {...{ totalLines, totalInvalid }} />;

  if (isLastStep) {
    resultOutput = <UserInvitationResultNotice />;
  }

  useEffect(() => {
    if (!history.location.pathname.includes(LAUNCH) && uploadResponse) {
      proceedUserList(uploadResponse.data, setNextStep);
    }
  }, [uploadResponse]);

  return (
    <div className={userListResult}>
      {resultOutput}
      <div className={userListResultButtons}>
        <DynamicFormattedMessage
          type={BUTTON_MAIN_TYPE.DANGER}
          tag={Button}
          className={userListModify}
          onClick={() => removeFile() && setUploadResponse(null)}
          id="launchProgram.users.download.modify"
        />
        {history.location.pathname.includes(LAUNCH) && (
          <DynamicFormattedMessage
            tag={Button}
            className={userListProceed}
            onClick={() => proceedAction()}
            id="launchProgram.users.download.proceed"
          />
        )}
      </div>
    </div>
  );
};

export default DropzoneResultOrganism;
