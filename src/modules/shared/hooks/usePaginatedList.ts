import { useState, useMemo, useEffect } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_LIMIT, type Paginated } from '../types/pagination';

interface Options<T> {
  queryKey: readonly unknown[];
  fetcher: (params: { page: number; limit: number }) => Promise<Paginated<T>>;
  initialLimit?: number;
  enabled?: boolean;
  /**
   * On mobile, switch to infinite-scroll behavior:
   * each new page is appended to the previous accumulated items.
   * On desktop, classic numbered pagination (replace items per page).
   */
  mobileInfinite?: boolean;
  staleTime?: number;
}

export interface UsePaginatedListResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  isMobile: boolean;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  loadMore: () => void;
  hasMore: boolean;
  refetch: () => void;
}

/**
 * Generic paginated list hook.
 * Desktop -> numbered pagination (use `setPage` + `total/totalPages`).
 * Mobile (when mobileInfinite=true) -> infinite scroll (`loadMore`, `hasMore`).
 */
export function usePaginatedList<T>({
  queryKey,
  fetcher,
  initialLimit = DEFAULT_LIMIT,
  enabled = true,
  mobileInfinite = true,
  staleTime = 30_000,
}: Options<T>): UsePaginatedListResult<T> {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [accumulated, setAccumulated] = useState<T[]>([]);

  const useInfinite = isMobile && mobileInfinite;

  // Reset accumulated items when switching mode or limit
  useEffect(() => {
    setAccumulated([]);
    setPage(1);
  }, [useInfinite, limit, JSON.stringify(queryKey)]);

  const query = useQuery({
    queryKey: [...queryKey, { page, limit }],
    queryFn: () => fetcher({ page, limit }),
    enabled,
    staleTime,
    placeholderData: (prev) => prev,
  } as UseQueryOptions<Paginated<T>>);

  // Append to accumulated for infinite scroll
  useEffect(() => {
    if (!useInfinite || !query.data) return;
    setAccumulated((prev) => {
      if (page === 1) return query.data!.data;
      return [...prev, ...query.data!.data];
    });
  }, [query.data, page, useInfinite]);

  const total = query.data?.total ?? 0;
  const totalPages = query.data?.totalPages ?? 1;

  const items = useMemo(() => {
    if (useInfinite) return accumulated;
    return query.data?.data ?? [];
  }, [useInfinite, accumulated, query.data]);

  const hasMore = page < totalPages;

  return {
    items,
    page,
    limit,
    total,
    totalPages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isMobile,
    setPage,
    setLimit,
    loadMore: () => { if (hasMore) setPage((p) => p + 1); },
    hasMore,
    refetch: () => query.refetch(),
  };
}
