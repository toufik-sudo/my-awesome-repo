import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { getClassForUserProgramStatus } from 'services/WallServices';

/**
 * Atom component used to user's status counts on programs.
 */
const StatusCount = ({ statusType, status, style }) => {
  const { userRowStatusElement } = style;

  if (!status[statusType]) {
    return null;
  }

  return (
    <DynamicFormattedMessage
      tag={HTML_TAGS.P}
      className={`${userRowStatusElement} ${getClassForUserProgramStatus(statusType, style)}`}
      id={`wall.users.status.count.${statusType}`}
      values={{ count: status[statusType] || 0 }}
    />
  );
};

export default StatusCount;
