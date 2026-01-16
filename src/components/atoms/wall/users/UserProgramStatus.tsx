import React from 'react';

import StatusCount from './StatusCount';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { USER_PROGRAM_STATUS } from 'constants/api/userPrograms';
import { getClassForUserProgramStatus } from 'services/WallServices';
import { isObject } from 'utils/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to user's status on platform programs.
 */
const UserProgramStatus = ({ userId, status, onProgramOnly, style }) => {
  if (onProgramOnly && !isObject(status)) {
    return (
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        className={`${style.userRowStatusElement} ${getClassForUserProgramStatus(status, style)}`}
        id={`wall.users.status.${status}`}
      />
    );
  }

  return (
    <div className={coreStyle.flex}>
      {[
        USER_PROGRAM_STATUS.ACTIVE,
        USER_PROGRAM_STATUS.INACTIVE,
        USER_PROGRAM_STATUS.BLOCKED,
        USER_PROGRAM_STATUS.PENDING
      ].map(statusType => (
        <StatusCount {...{ statusType, status, style }} key={`${userId}_statusCount_${statusType}`} />
      ))}
    </div>
  );
};

export default UserProgramStatus;
