import { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import UsersApi from 'api/UsersApi';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { DEFAULT_OFFSET, VIEW_TYPE, DEFAULT_USERS_LIST_SIZE } from 'constants/api';
import { USER_PROGRAM_STATUS, USERS_DEFAULT_SORTING, NO_MANAGER_ASSIGNED_FILTER } from 'constants/api/userPrograms';
import { useUpdateEffect } from 'hooks/general/useUpdateEffect';
import {
  updateManagedUsers,
  updateAllManagedUsers,
  computeNextManagedUsersLoadingParams,
  updateManagedUsersListState,
  shouldLoadUnmanagedUsers,
  getManagedUsersInitialState
} from 'services/ProgramUsersManagementServices';

const usersApi = new UsersApi();

/**
 * Hook used to manage users
 * @param userId user id
 * @param userProgram program for which given user's role is updated
 * @param isPeopleManager role currently set for user
 * */
const useManageUsersList = (userId, userProgram, isPeopleManager) => {
  const intl = useIntl();
  const platform = usePlatformIdSelection();
  const [allManaged, setAllManaged] = useState(false);
  const [currentUsers, setCurrentUsers] = useState(getManagedUsersInitialState(userId, userProgram));

  const loadUsers = useCallback(
    async (offset, managerId) => {
      if (!userProgram) {
        return { entries: [], hasMore: false };
      }

      let size = DEFAULT_USERS_LIST_SIZE;
      if (managerId) {
        // making sure all managed users are loaded, in order to prevent possible users loss
        size = await usersApi.getManagedUsersCount(platform, userProgram.id, managerId);
      }

      const usersPage = await usersApi.getUsers({
        ...USERS_DEFAULT_SORTING,
        platform,
        view: VIEW_TYPE.LIST,
        size,
        offset,
        filters: {
          program: userProgram.id,
          status: [USER_PROGRAM_STATUS.ACTIVE],
          peopleManager: managerId || NO_MANAGER_ASSIGNED_FILTER
        }
      });

      return {
        ...usersPage,
        hasMore: offset + size < usersPage.total
      };
    },
    [userProgram, platform]
  );

  const handleLoadUsers = useCallback(
    async (page: number) => {
      setCurrentUsers(state => ({
        ...state,
        loading: true
      }));
      try {
        const loadingParams = computeNextManagedUsersLoadingParams(page, currentUsers);
        const loadedUsers = await loadUsers(loadingParams.offset, loadingParams.managerId);

        setCurrentUsers(updateManagedUsersListState(loadingParams, loadedUsers, allManaged));
      } catch (e) {
        toast(intl.formatMessage({ id: 'wall.user.details.users.failedToLoad' }));
        setCurrentUsers(state => ({
          ...state,
          loading: false
        }));
      }
    },
    [loadUsers, currentUsers, allManaged, intl]
  );

  const setManagedStatus = useCallback((userIndex, managedUserId, isManaged) => {
    setCurrentUsers(state => updateManagedUsers(state, { userIndex, managedUserId, isManaged }));
    if (!isManaged) {
      setAllManaged(false);
    }
  }, []);

  const setAllManagedStatus = useCallback(allManaged => {
    setAllManaged(allManaged);
    setCurrentUsers(state => updateAllManagedUsers(state, allManaged));
  }, []);

  useUpdateEffect(() => {
    setCurrentUsers(getManagedUsersInitialState(userId, userProgram));
    setAllManaged(false);
  }, [userId, userProgram, platform]);

  useUpdateEffect(() => {
    if (shouldLoadUnmanagedUsers(isPeopleManager, currentUsers, DEFAULT_USERS_LIST_SIZE)) {
      handleLoadUsers(DEFAULT_OFFSET + 1);
    }
  }, [isPeopleManager, currentUsers.managerId, currentUsers.hasMore, currentUsers.users.length]);

  useEffect(() => {
    if (isPeopleManager && !currentUsers.users.length) {
      handleLoadUsers(DEFAULT_OFFSET);
    }
  }, [isPeopleManager, currentUsers.users.length]);

  return {
    currentUsers,
    handleLoadUsers,
    setCurrentUsers,
    setManagedStatus,
    allManaged,
    setAllManagedStatus
  };
};

export default useManageUsersList;
