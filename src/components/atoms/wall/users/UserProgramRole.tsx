import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { ROLE } from 'constants/security/access';
import { isObject } from 'utils/general';

/**
 * Atom component used to user's role/roles on platform programs.
 */
const UserProgramRole = ({ user, onProgramOnly, style }) => {
  const { userRowRoleElement, userRowRoleElementManager } = style;
  const usersRoleLabel = 'wall.users.role.';

  const { role, isPeopleManager, peopleManager = 0 } = user;

  if (!role) {
    return null;
  }

  if (onProgramOnly && !isObject(role)) {
    return (
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        className={userRowRoleElement}
        id={`${usersRoleLabel}${isPeopleManager ? 'peopleManager' : 'user'}`}
      />
    );
  }

  const userCount = role[ROLE.BENEFICIARY] - peopleManager;

  return (
    <>
      {userCount > 0 && (
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          className={userRowRoleElement}
          id={`${usersRoleLabel}count.user`}
          values={{ count: userCount }}
        />
      )}
      {peopleManager > 0 && (
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          className={`${userRowRoleElement} ${userRowRoleElementManager}`}
          id={`${usersRoleLabel}count.peopleManager`}
          values={{ count: peopleManager }}
        />
      )}
    </>
  );
};

export default UserProgramRole;
