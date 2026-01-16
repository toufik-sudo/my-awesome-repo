import React from 'react';

import ProgramJoinValidationControls from './ProgramJoinValidationControls';
import UserProgramAccessControls from './UserProgramAccessControls';
import { PENDING, ONGOING } from 'constants/wall/users';

/**
 * Component used to render program row actions based on user status on that particular program
 * @param rowData
 * @param type
 * @param rowStyle
 * @param actionHandlers
 * @constructor
 */
const UserProgramStatusActions = ({ rowData, type, rowStyle, ...actionHandlers }) => {
  let actions = null;

  if (type === ONGOING) {
    actions = <UserProgramAccessControls {...{ rowData, type, rowStyle, ...actionHandlers }} />;
  }

  if (type === PENDING) {
    const isValidating = actionHandlers.isValidatingJoin && actionHandlers.isValidatingJoin(rowData.id);
    actions = <ProgramJoinValidationControls {...{ programId: rowData.id, isValidating, ...actionHandlers }} />;
  }

  return actions;
};

export default UserProgramStatusActions;
