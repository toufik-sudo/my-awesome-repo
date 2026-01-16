import { useState, useEffect, useRef, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { DEFAULT_OFFSET, DEFAULT_LIST_SIZE } from 'constants/api';
import { IInfiniteScrollLoaderProps } from 'interfaces/IGeneral';
import { emptyFn } from 'utils/general';
import axios from 'axios';

/**
 * Hook used to handle loading results on infinite scroll
 * @param initialListCriteria
 * @param loadMore
 * @param pageSize
 * @param onErrorMessageId
 * @param mutateEntries
 */
const useInfiniteScrollLoader = ({
  loadMore,
  initialListCriteria = {},
  pageSize = DEFAULT_LIST_SIZE,
  onErrorMessageId = 'toast.message.generic.error',
  mutateEntries = emptyFn()
}: IInfiniteScrollLoaderProps) => {
  const { formatMessage } = useIntl();
  const [listEntries, setEntries] = useState({ entries: [], hasMore: false });
  const [listCriteria, setListCriteria] = useState<any>(initialListCriteria);
  const [isLoading, setLoading] = useState(true);
  const scrollRef = useRef<any>();

  const onMutateEntries = (...props) => {
    mutateEntries(setEntries, ...props);
  };

  const getMoreEntries = useCallback(
    async (listCriteria: any, currentEntries: any[]) => {
      const offset = currentEntries.length;
      const additionalEntries = await loadMore({
        ...listCriteria,
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

  const handleLoadMore = async (page: number) => {
    setLoading(true);
    try {
      let currentEntries = listEntries.entries;
      if (DEFAULT_OFFSET === page) {
        currentEntries = [];
      }

      const loadedEntries = await getMoreEntries(listCriteria, currentEntries);
      setEntries(loadedEntries);
    } catch (e) {
      console.log(e);
      toast(formatMessage({ id: onErrorMessageId }));
    }
    setLoading(false);
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    setEntries({ entries: [], hasMore: false });
    if (scrollRef.current) {
      scrollRef.current.pageLoaded = DEFAULT_OFFSET;
    }

    handleLoadMore(DEFAULT_OFFSET);
    return()=>{
      source.cancel();
    }
  }, [listCriteria]);

  return {
    ...listEntries,
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
