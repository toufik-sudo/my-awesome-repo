import { useState, useEffect, useCallback } from 'react';

import UserApi from 'api/UsersApi';
import { DEBOUNCE_DELAY } from 'constants/general';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';

const userApi = new UserApi();
/**
 * Hook used to load/search active program users.
 * @param programId
 */
const useActiveProgramUsersLoader = (programId: number) => {
  const [userQuery, setQuery] = useState();
  const loadUsers = useCallback((query, callback) => setQuery({ query, callback }), []);
  const platformId = usePlatformIdSelection();

  const handleSearch = useCallback(
    async ({ query, callback }) => {
      callback(await userApi.getActiveProgramUsers(platformId, programId, query));
    },
    [platformId, programId]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => userQuery && handleSearch(userQuery), DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [handleSearch, userQuery]);

  return { loadUsers };
};

export default useActiveProgramUsersLoader;
