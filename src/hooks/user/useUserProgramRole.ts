import { useState, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import UsersApi from 'api/UsersApi';
import { useUpdateEffect } from 'hooks/general/useUpdateEffect';
import {
  prepareManagedUsersData,
  hasUserRoleDataChanged,
  addManagedUsersErrors,
  hasValidRoleData
} from 'services/ProgramUsersManagementServices';
import useManageUsersList from './useManageUsersList';

const usersApi = new UsersApi();

/**
 * Hook used to manage user program role actions
 * @param userDetails user
 * @param userProgram program for which given user's role is updated
 * @param onUserRoleUpdated
 * */
const useUserProgramRole = (userDetails, userProgram, onUserRoleUpdated) => {
  const intl = useIntl();
  const { uuid: userUuid, id: userId } = userDetails;
  const [isPeopleManager, setIsPeopleManager] = useState(userProgram && userProgram.isPeopleManager);
  const [isValidating, setValidating] = useState(false);
  const {
    currentUsers,
    handleLoadUsers,
    setCurrentUsers,
    setManagedStatus,
    allManaged,
    setAllManagedStatus
  } = useManageUsersList(userId, userProgram, isPeopleManager);

  const validate = useCallback(async () => {
    setValidating(true);
    try {
      const managedUsers = prepareManagedUsersData(userId, { users: currentUsers.users, isPeopleManager, allManaged });

      await usersApi.setPeopleManager(userUuid, { programId: userProgram.id, ...managedUsers });
      toast(intl.formatMessage({ id: 'wall.user.details.role.updated' }));

      onUserRoleUpdated(userProgram.isPeopleManager !== isPeopleManager);
    } catch ({ response }) {
      if (response.invalidUsers) {
        setCurrentUsers(addManagedUsersErrors(currentUsers, response.invalidUsers));
      }

      toast(intl.formatMessage({ id: 'wall.user.details.role.failedUpdate' }));
    }
    setValidating(false);
  }, [isPeopleManager, allManaged, currentUsers.users, userProgram, userId, intl]);

  useUpdateEffect(() => {
    setIsPeopleManager(userProgram && userProgram.isPeopleManager);
  }, [userProgram]);

  const isValidRoleData = useMemo(
    () => hasValidRoleData({ isPeopleManager, users: currentUsers.users, managerId: userId }),
    [isPeopleManager, currentUsers.users, userId]
  );

  const hasRoleChanged = useMemo(
    () => hasUserRoleDataChanged({ userProgram, isPeopleManager, allManaged, currentUsers }),
    [userProgram, isPeopleManager, allManaged, currentUsers]
  );

  return {
    isPeopleManager,
    setIsPeopleManager,
    users: {
      ...currentUsers,
      handleLoadUsers
    },
    setManagedStatus,
    allManaged,
    setAllManagedStatus,
    isValidating,
    canValidate: isValidRoleData && hasRoleChanged,
    validate
  };
};

export default useUserProgramRole;
