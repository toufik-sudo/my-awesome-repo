// -----------------------------------------------------------------------------
// useInfiniteScroll Hook
// Generic infinite scroll loader with pagination support
// Migrated from old_app/src/hooks/general/useInfiniteScrollLoader.ts
// -----------------------------------------------------------------------------

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface InfiniteScrollLoaderConfig<T, C = Record<string, any>> {
  /**
   * Function to load more entries
   * @param criteria - Current list criteria with offset and size
   * @returns Promise with entries array and total count
   */
  loadMore: (criteria: C & { offset: number; size: number }) => Promise<{
    entries: T[];
    total: number;
  }>;
  
  /** Initial criteria for filtering/sorting */
  initialCriteria?: C;
  
  /** Number of items per page */
  pageSize?: number;
  
  /** Error message to show on failure */
  errorMessage?: string;
  
  /** Whether to load immediately on mount */
  loadOnMount?: boolean;
}

export interface InfiniteScrollLoaderResult<T, C = Record<string, any>> {
  /** Current list of entries */
  entries: T[];
  
  /** Whether more entries can be loaded */
  hasMore: boolean;
  
  /** Whether currently loading */
  isLoading: boolean;
  
  /** Load more entries */
  loadMore: () => Promise<void>;
  
  /** Reset and reload with new criteria */
  setCriteria: React.Dispatch<React.SetStateAction<C>>;
  
  /** Current criteria */
  criteria: C;
  
  /** Ref for scroll container */
  scrollRef: React.RefObject<HTMLElement>;
  
  /** Reset list to initial state */
  reset: () => void;
  
  /** Manually mutate entries */
  setEntries: React.Dispatch<React.SetStateAction<{ entries: T[]; hasMore: boolean }>>;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_OFFSET = 0;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useInfiniteScroll<T, C = Record<string, any>>({
  loadMore: loadMoreFn,
  initialCriteria = {} as C,
  pageSize = DEFAULT_PAGE_SIZE,
  errorMessage = 'Failed to load more items',
  loadOnMount = true
}: InfiniteScrollLoaderConfig<T, C>): InfiniteScrollLoaderResult<T, C> {
  const [listState, setListState] = useState<{ entries: T[]; hasMore: boolean }>({
    entries: [],
    hasMore: false
  });
  const [criteria, setCriteria] = useState<C>(initialCriteria);
  const [isLoading, setIsLoading] = useState(loadOnMount);
  const scrollRef = useRef<HTMLElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load more entries
  const getMoreEntries = useCallback(
    async (currentEntries: T[]): Promise<{ entries: T[]; hasMore: boolean }> => {
      const offset = currentEntries.length;
      
      const result = await loadMoreFn({
        ...criteria,
        offset,
        size: pageSize
      });

      return {
        entries: [...currentEntries, ...result.entries],
        hasMore: offset + pageSize < result.total
      };
    },
    [loadMoreFn, criteria, pageSize]
  );

  // Handle loading more
  const handleLoadMore = useCallback(async (reset = false) => {
    setIsLoading(true);
    
    try {
      const currentEntries = reset ? [] : listState.entries;
      const loadedEntries = await getMoreEntries(currentEntries);
      setListState(loadedEntries);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Infinite scroll load error:', error);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getMoreEntries, listState.entries, errorMessage]);

  // Reset function
  const reset = useCallback(() => {
    setListState({ entries: [], hasMore: false });
    setCriteria(initialCriteria);
  }, [initialCriteria]);

  // Load on criteria change
  useEffect(() => {
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Reset list and load
    setListState({ entries: [], hasMore: false });
    
    if (loadOnMount || Object.keys(criteria).length > 0) {
      handleLoadMore(true);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [criteria]);

  return {
    entries: listState.entries,
    hasMore: listState.hasMore && !isLoading,
    isLoading,
    loadMore: () => handleLoadMore(false),
    setCriteria,
    criteria,
    scrollRef: scrollRef as React.RefObject<HTMLElement>,
    reset,
    setEntries: setListState
  };
}

export default useInfiniteScroll;
