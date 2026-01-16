import { useState, useEffect, useRef, useCallback } from 'react';

import UserApi from 'api/UsersApi';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import useProgramJoinValidation from 'hooks/user/useProgramJoinValidation';
import { VIEW_TYPE, DEFAULT_OFFSET } from 'constants/api';
import { DEFAULT_USERS_LIST_SIZE, USERS_DEFAULT_SORTING } from 'constants/api/userPrograms';
import { ISortable } from 'interfaces/api/ISortable';
import { updateUsersListOnJoinValidated } from 'services/WallServices';

const usersApi = new UserApi();

/**
 * Hook used to load platform users.
 */
const useUsersData = (programId: number) => {
  const [currentUsers, setCurrentUsers] = useState({ users: [], hasMore: false, programId });
  const [isLoading, setLoading] = useState(false);
  const [sorting, setSorting] = useState({ ...USERS_DEFAULT_SORTING });
  const scrollRef = useRef<any>();
  const platform = usePlatformIdSelection();

  const { confirmJoinAction, validateJoinRequest, isValidatingJoin } = useProgramJoinValidation();

  const handleValidateJoinRequest = useCallback(
    async ({ operation, userId }) => {
      if (!programId) {
        return;
      }

      if (await validateJoinRequest({ userId, operation, programId })) {
        setCurrentUsers(usersState => updateUsersListOnJoinValidated(usersState, { userId, operation, programId }));
      }
    },
    [programId, validateJoinRequest]
  );

  const handleIsValidatingJoin = useCallback(userId => programId && isValidatingJoin(userId, programId), [
    programId,
    isValidatingJoin
  ]);

  const loadUsers = async (page: number, sort: ISortable = {}, currentUsers: any[]) => {
    const usersPage = await usersApi.getUsers({
      platform,
      view: VIEW_TYPE.LIST,
      offset: page * DEFAULT_USERS_LIST_SIZE,
      size: DEFAULT_USERS_LIST_SIZE,
      ...sort,
      filters: {
        program: programId
      }
    });

    let existingUsers = currentUsers;
    if (DEFAULT_OFFSET === page) {
      existingUsers = [];
    }

    return {
      users: [...existingUsers, ...usersPage.entries],
      hasMore: (page + 1) * DEFAULT_USERS_LIST_SIZE < usersPage.total,
      programId
    };
  };

  const handleLoadMore = async (page: number, sort?: ISortable) => {
    setLoading(true);
    try {
      const loadedUsers = await loadUsers(page, sort, currentUsers.users);
      setCurrentUsers(loadedUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!platform) {
      return;
    }
    setCurrentUsers({ users: [], hasMore: false, programId });
    if (scrollRef.current) {
      scrollRef.current.pageLoaded = DEFAULT_OFFSET;
    }
    handleLoadMore(DEFAULT_OFFSET, sorting);
  }, [programId, sorting, platform]);

  return {
    ...currentUsers,
    isLoading,
    handleLoadMore,
    sorting,
    setSorting,
    scrollRef,
    validateJoinRequest: handleValidateJoinRequest,
    isValidatingJoin: handleIsValidatingJoin,
    confirmJoinAction
  };
};

export default useUsersData;
