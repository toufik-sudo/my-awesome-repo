// -----------------------------------------------------------------------------
// usePostsListData Hook
// Migrated from old_app/src/hooks/wall/usePostsListData.ts
// Fetches and manages posts data with infinite scroll
// -----------------------------------------------------------------------------

import { useState, useCallback } from 'react';
import { useWallSelection } from '@/hooks/wall';
import { isUserBeneficiary } from '@/services/security/accessServices';
import { VIEWS } from '@/constants/wall/programButtons';
import { useInfiniteScrollLoader } from '@/hooks/general/useInfiniteScrollLoader';
import { useUpdateEffect } from '@/hooks/general/useUpdateEffect';
import { postsApi } from '@/api/PostsApi';
import { groupPostsByDate } from '@/services/wall/posts';
import type { IPost } from '../components/PostBlock';

export interface IListCriteria extends Record<string, unknown> {
  program: number | null;
  platform: number;
  view: string;
  offset?: number;
  size?: number;
}

/**
 * Hook used to retrieve posts data and return posts state
 */
export const usePostsListData = () => {
  const {
    selectedProgramId,
    selectedPlatform: { role, id: platformId }
  } = useWallSelection();
  
  const [forceReloaded, setForceReloaded] = useState(0);
  const [triggerPin, setTriggerPin] = useState(0);
  const isBeneficiary = isUserBeneficiary(role);

  const triggerPostsReload = useCallback(() => {
    setForceReloaded(i => i + 1);
  }, []);

  // Load posts from API
  const loadMore = useCallback(async (listCriteria: Record<string, unknown>) => {
    if (!listCriteria.platform) {
      return { entries: [], total: 0 };
    }

    try {
      const response = await postsApi.getPosts({
        platform: listCriteria.platform as number,
        program: listCriteria.program as number | undefined,
        view: listCriteria.view as string,
        offset: listCriteria.offset as number,
        size: listCriteria.size as number
      });

      // Handle different response formats
      const posts = response.posts || response.data || response || [];
      const total = response.total || posts.length;
      
      // Group posts by date if needed
      const groupedPosts = groupPostsByDate ? groupPostsByDate(posts) : posts;

      return { 
        entries: groupedPosts as IPost[], 
        total 
      };
    } catch (error) {
      console.error('[usePostsListData] Error loading posts:', error);
      return { entries: [], total: 0 };
    }
  }, []);

  const initialListCriteria: IListCriteria = {
    program: selectedProgramId ?? null,
    platform: platformId ?? 0,
    view: VIEWS.WALL
  };

  const { 
    entries, 
    hasMore, 
    isLoading, 
    setListCriteria, 
    handleLoadMore, 
    scrollRef 
  } = useInfiniteScrollLoader<IPost>({
    loadMore,
    initialListCriteria,
    pageSize: 10,
    onErrorMessageId: 'wall.posts.load.error'
  });

  // Reload posts when platform/program changes
  useUpdateEffect(() => {
    if (platformId) {
      setListCriteria({
        program: selectedProgramId ?? null,
        platform: platformId,
        view: VIEWS.WALL
      });
      window.scrollTo(0, 0);
    }
  }, [selectedProgramId, platformId, forceReloaded, triggerPin]);

  return {
    postsListData: entries,
    isLoading,
    hasMore,
    setTriggerPin,
    triggerPostsReload,
    isBeneficiary,
    handleLoadMoreItems: handleLoadMore,
    scrollRef,
    selectedProgramId,
    platformId
  };
};

export default usePostsListData;
