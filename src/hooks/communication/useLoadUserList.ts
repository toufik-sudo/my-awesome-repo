import { useEffect, useState } from 'react';

import CommunicationsApi from 'api/CommunicationsApi';
import usePrevious from 'hooks/general/usePrevious';
import useInfiniteScrollLoader from 'hooks/general/useInfiniteScrollLoader';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { ISortable } from 'interfaces/api/ISortable';
import { DEFAULT_FILTER_CREATE_USER_LIST, DEFAULT_GET_USERS_QUERY } from 'constants/communications/campaign';

const communicationsApi = new CommunicationsApi();

/**
 * Hook for Communication email user list page
 *
 */
const useLoadUserList = ({ programId: currentProgramId, currentEditableUserListId, forcedEditProgramId }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const platform = usePlatformIdSelection();
  const program = currentEditableUserListId ? forcedEditProgramId : currentProgramId;
  const initialListCriteria = { ...DEFAULT_GET_USERS_QUERY, platform, filters: { program }, search: undefined };

  const [sortingFilter, setSortingFilter] = useState<ISortable>(DEFAULT_FILTER_CREATE_USER_LIST);
  const previousState = usePrevious({ searchValue });
  const [isLoadingEditUserList, setLoadingEditUserList] = useState(!!currentEditableUserListId);

  const loadMore = async criteria => {
    if (!program) {
      return { entries: [], total: 0 };
    }
    const {
      data: { data: entries, total }
    } = await communicationsApi.getUsersData(criteria);
    setLoadingEditUserList(false);

    return { entries, total };
  };

  const { entries, hasMore, handleLoadMore, scrollRef, listCriteria, setListCriteria } = useInfiniteScrollLoader({
    loadMore,
    initialListCriteria
  });

  useEffect(() => {
    setListCriteria({ ...listCriteria, filters: { program } });
  }, [program]);

  const applySearchFilter = () => {
    if (previousState && previousState.searchValue !== searchValue) {
      setListCriteria({ ...listCriteria, search: searchValue });
    }
  };

  return {
    isLoading: isLoadingEditUserList,
    applySearchFilter,
    searchValue,
    setSearchValue,
    hasMore,
    users: entries,
    scrollRef,
    loadMore: handleLoadMore,
    sortingFilter,
    setSortingFilter
  };
};

export default useLoadUserList;
