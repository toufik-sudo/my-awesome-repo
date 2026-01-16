import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'assets/style/components/launch/UserListDownload.module.scss';

/**
 * Molecule component used to display user invitation email results
 *
 * @constructor
 */
const UserInvitationResultNotice = () => {
  return (
    <div className={style.userListResults}>
      <DynamicFormattedMessage tag={HTML_TAGS.P} id="launch.userInvitation.result.notification.sent" />
    </div>
  );
};

export default UserInvitationResultNotice;
