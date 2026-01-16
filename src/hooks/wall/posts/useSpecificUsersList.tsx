import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { useState, useEffect } from 'react';
import { VIEW_TYPE } from 'constants/api';
import useInfiniteScrollLoader from 'hooks/general/useInfiniteScrollLoader';
import UserApi from 'api/UsersApi';

const userApi = new UserApi();

/**
 * Hook used to load specific users list
 *
 * @param programId
 */
export const useSpecificUsersList = programId => {
  const platform = usePlatformIdSelection();
  const [search, setSearch] = useState('');
  const initialListCriteria = { platform, search: '', view: VIEW_TYPE.LIST, filters: { program: programId } };
  const loadMore = async listCriteria => {
    if (!programId) {
      return { entries: [], total: 0 };
    }
    const { entries, total } = await userApi.getUsers(listCriteria);
    return { entries, total };
  };

  const {
    entries: specificUsers,
    hasMore,
    isLoading,
    setListCriteria,
    handleLoadMore,
    listCriteria,
    scrollRef
  } = useInfiniteScrollLoader({
    loadMore,
    initialListCriteria,
    pageSize: 20,
    onErrorMessageId: 'wall.posts.getUsers.error'
  });

  useEffect(() => {
    setListCriteria({ ...initialListCriteria, filters: { program: programId } });
  }, [programId]);

  const onSearch = () => setListCriteria({ ...listCriteria, search });
  return { search, setSearch, specificUsers, hasMore, isLoading, handleLoadMore, scrollRef, onSearch };
};
