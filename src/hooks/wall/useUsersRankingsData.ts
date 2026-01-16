import { useCallback } from 'react';

import UserApi from 'api/UsersApi';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import useInfiniteScrollLoader from 'hooks/general/useInfiniteScrollLoader';
import { DEFAULT_USERS_LIST_SIZE } from 'constants/api';
import { useUpdateEffect } from 'hooks/general/useUpdateEffect';

const usersApi = new UserApi();
/**
 * Hook used to load user rankings.
 */
const useUsersRankingsData = (programId: number) => {
  const platformId = usePlatformIdSelection();

  const loadUsers = useCallback(criteria => usersApi.getUsersRanking(criteria), []);
  const getListCriteria = useCallback(
    () => ({
      platformId,
      programId
    }),
    [platformId, programId]
  );

  const { entries, hasMore, isLoading, handleLoadMore, setListCriteria } = useInfiniteScrollLoader({
    initialListCriteria: getListCriteria(),
    loadMore: loadUsers,
    pageSize: DEFAULT_USERS_LIST_SIZE
  });

  useUpdateEffect(() => {
    setListCriteria(getListCriteria());
  }, [setListCriteria, getListCriteria]);

  return { users: entries, hasMore, isLoading, handleLoadMore };
};

export default useUsersRankingsData;
