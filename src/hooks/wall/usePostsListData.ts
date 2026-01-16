import { useState } from 'react';

import { getPostsData } from 'store/actions/wallActions';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserBeneficiary } from 'services/security/accessServices';
import { VIEWS } from 'constants/wall/programButtons';
import useInfiniteScrollLoader from 'hooks/general/useInfiniteScrollLoader';
import { useUpdateEffect } from 'hooks/general/useUpdateEffect';

/**
 * Hook used to retrieve posts data and return posts stat
 */
export const usePostsListData = () => {
  const {
    selectedProgramId,
    selectedPlatform: { role, id: platform }
  } = useWallSelection();
  const [forceReloaded, setForceReloaded] = useState(0);
  const isBeneficiary = isUserBeneficiary(role);
  const [triggerPin, setTriggerPin] = useState(0);

  const triggerPostsReload = () => setForceReloaded(i => i + 1);

  const loadMore = async listCriteria => {
    const { groupedPosts, total } = await getPostsData({
      ...listCriteria
    });

    return { entries: groupedPosts, total };
  };
  const initialListCriteria = { program: selectedProgramId, platform, view: VIEWS.WALL };
  const { entries, hasMore, isLoading, setListCriteria, handleLoadMore, scrollRef } = useInfiniteScrollLoader({
    loadMore,
    initialListCriteria
  });

  useUpdateEffect(() => {
    setListCriteria(() => {
      window.scrollTo(0, 0);

      return {
        program: selectedProgramId,
        platform,
        view: VIEWS.WALL
      };
    });
  }, [selectedProgramId, platform, forceReloaded, triggerPin]);

  return {
    postsListData: entries,
    isLoading,
    hasMore,
    setTriggerPin,
    triggerPostsReload,
    isBeneficiary,
    handleLoadMoreItems: handleLoadMore,
    scrollRef
  };
};
