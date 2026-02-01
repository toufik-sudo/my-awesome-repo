// -----------------------------------------------------------------------------
// useInfiniteScrollLoader Hook
// Migrated from old_app/src/hooks/general/useInfiniteScrollLoader.ts
// -----------------------------------------------------------------------------

import { useState, useEffect, useRef, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { DEFAULT_OFFSET, DEFAULT_LIST_SIZE } from '@/constants/api';

export interface IInfiniteScrollLoaderProps<T = unknown> {
  loadMore: (criteria: Record<string, unknown>) => Promise<{ entries: T[]; total: number }>;
  initialListCriteria?: Record<string, unknown>;
  pageSize?: number;
  onErrorMessageId?: string;
  mutateEntries?: (
    setEntries: React.Dispatch<React.SetStateAction<{ entries: T[]; hasMore: boolean }>>,
    ...args: unknown[]
  ) => void;
}

/**
 * Hook used to handle loading results on infinite scroll
 */
const useInfiniteScrollLoader = <T = unknown>({
  loadMore,
  initialListCriteria = {},
  pageSize = DEFAULT_LIST_SIZE,
  onErrorMessageId = 'toast.message.generic.error',
  mutateEntries
}: IInfiniteScrollLoaderProps<T>) => {
  const { formatMessage } = useIntl();
  const [listEntries, setEntries] = useState<{ entries: T[]; hasMore: boolean }>({ 
    entries: [], 
    hasMore: false 
  });
  const [listCriteria, setListCriteria] = useState<Record<string, unknown>>(initialListCriteria);
  const [isLoading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const onMutateEntries = useCallback((...props: unknown[]) => {
    if (mutateEntries) {
      mutateEntries(setEntries, ...props);
    }
  }, [mutateEntries]);

  const getMoreEntries = useCallback(
    async (criteria: Record<string, unknown>, currentEntries: T[]) => {
      const offset = currentEntries.length;
      const additionalEntries = await loadMore({
        ...criteria,
        offset,
        size: pageSize
      });

      return {
        entries: [...currentEntries, ...additionalEntries.entries],
        hasMore: offset + pageSize < additionalEntries.total
      };
    },
    [loadMore, pageSize]
  );

  const handleLoadMore = useCallback(async (page?: number) => {
    setLoading(true);
    try {
      let currentEntries = listEntries.entries;
      if (page === DEFAULT_OFFSET || page === 0) {
        currentEntries = [];
      }

      const loadedEntries = await getMoreEntries(listCriteria, currentEntries);
      setEntries(loadedEntries);
    } catch (e) {
      // Only show error if it's not an abort
      if (e instanceof Error && e.name !== 'AbortError') {
        console.error('Error loading more entries:', e);
        toast.error(formatMessage({ id: onErrorMessageId, defaultMessage: 'An error occurred' }));
      }
    }
    setLoading(false);
  }, [listEntries.entries, listCriteria, getMoreEntries, formatMessage, onErrorMessageId]);

  useEffect(() => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setEntries({ entries: [], hasMore: false });
    
    // Reset scroll position
    if (scrollRef.current && 'pageLoaded' in scrollRef.current) {
      (scrollRef.current as unknown as { pageLoaded: number }).pageLoaded = DEFAULT_OFFSET;
    }

    handleLoadMore(DEFAULT_OFFSET);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [listCriteria]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    entries: listEntries.entries,
    hasMore: listEntries.hasMore && !isLoading,
    isLoading,
    handleLoadMore,
    setListCriteria,
    listCriteria,
    scrollRef,
    onMutateEntries
  };
};

export default useInfiniteScrollLoader;
export { useInfiniteScrollLoader };
