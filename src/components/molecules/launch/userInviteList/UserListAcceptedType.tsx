import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { LAUNCH_PROGRAM, USER_LIST_ACCEPTED_TYPE_LABELS } from 'constants/wall/launch';
import style from 'assets/style/components/launch/UserListDownload.module.scss';

/**
 * Molecule component used to render the accepted type label
 *
 * @constructor
 */
const UserListAcceptedType = () => {
  return (
    <p>
      {USER_LIST_ACCEPTED_TYPE_LABELS.map(label => (
        <DynamicFormattedMessage
          className={style[`userListAccepted${label}`]}
          key={label}
          tag="span"
          id={`${LAUNCH_PROGRAM}.users.download.acceptedType.${label}`}
        />
      ))}
    </p>
  );
};

export default UserListAcceptedType;
