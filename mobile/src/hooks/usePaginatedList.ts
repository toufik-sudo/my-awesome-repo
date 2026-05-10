import { useCallback, useEffect, useRef, useState } from 'react';
import { usePermissions } from './usePermissions';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsePaginatedListOptions<TFilters> {
  /** Async fetcher that receives `{ page, limit, ...filters }`. */
  fetcher: (params: { page: number; limit: number } & TFilters) => Promise<PaginatedResponse<any>>;
  /** Extra filters merged into each request. Pagination resets when these change. */
  filters?: TFilters;
  /** Items per page (default 20, max 100). */
  limit?: number;
  /** Optional UI permission key (e.g. MOBILE_UI_PERM.PROPERTY_VIEW). When set & not allowed, no fetch happens. */
  permKey?: string;
  /** Disable initial fetch. */
  enabled?: boolean;
}

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

/**
 * Mobile server-side pagination helper with infinite-scroll semantics.
 * Wire to FlatList: `onEndReached={loadMore}` + `refreshControl` using `refresh`.
 *
 * RBAC: when `permKey` is provided, the hook is short-circuited unless `canUI(permKey)`
 * resolves true via the dynamic RBAC context.
 *
 * Concurrency guarantees:
 *   - A `reset` call always wins: it bumps a request token so any in-flight
 *     `append` is discarded on completion (no duplicates, no stale totals).
 *   - State (`items`, `page`, `totalPages`, `total`) is wiped synchronously on
 *     reset to avoid showing stale end-of-list indicators during refresh.
 */
export function usePaginatedList<T, TFilters extends Record<string, any> = Record<string, any>>(
  opts: UsePaginatedListOptions<TFilters>,
) {
  const { fetcher, filters, limit = DEFAULT_LIMIT, permKey, enabled = true } = opts;
  const safeLimit = Math.min(limit, MAX_LIMIT);
  const { canUI, permissionsLoaded } = usePermissions();
  const allowed = !permKey || canUI(permKey);

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const filtersKey = JSON.stringify(filters || {});
  /** Monotonic token incremented on every `reset` to invalidate stale appends. */
  const resetToken = useRef(0);
  const inFlight = useRef(false);

  const fetchPage = useCallback(
    async (targetPage: number, mode: 'reset' | 'append') => {
      if (!enabled || !allowed) return;
      // Reset always wins — drop any in-flight append.
      if (mode === 'reset') {
        resetToken.current += 1;
        // Wipe state synchronously so end-of-list / empty indicators don't flash.
        setItems([]);
        setPage(1);
        setTotalPages(1);
        setTotal(0);
        setLoading(true);
      } else if (inFlight.current) {
        return;
      }
      const myToken = resetToken.current;
      inFlight.current = true;
      try {
        setError(null);
        const res = await fetcher({ page: targetPage, limit: safeLimit, ...(filters as TFilters) });
        // Discard if a newer reset happened while we were awaiting.
        if (myToken !== resetToken.current) return;
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setPage(res.page);
        setItems((prev) => {
          if (mode === 'reset') return res.data;
          // Dedupe by `id` when appending (defensive: backend may double-emit).
          const seen = new Set(prev.map((it: any) => it?.id).filter(Boolean));
          const additions = res.data.filter((it: any) => !it?.id || !seen.has(it.id));
          return [...prev, ...additions];
        });
      } catch (e) {
        if (myToken === resetToken.current) setError(e);
      } finally {
        inFlight.current = false;
        if (myToken === resetToken.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [enabled, allowed, fetcher, safeLimit, filters],
  );

  // Reset on filter / permission change.
  useEffect(() => {
    if (!enabled || !allowed) return;
    fetchPage(1, 'reset');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, allowed, enabled, permissionsLoaded]);

  const loadMore = useCallback(() => {
    if (loading || refreshing) return;
    if (page >= totalPages) return;
    fetchPage(page + 1, 'append');
  }, [loading, refreshing, page, totalPages, fetchPage]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchPage(1, 'reset');
  }, [fetchPage]);

  return {
    items,
    page,
    total,
    totalPages,
    hasMore: page < totalPages,
    loading,
    refreshing,
    error,
    loadMore,
    refresh,
    /** True when the current role lacks the required UI permission. */
    forbidden: !!permKey && permissionsLoaded && !allowed,
  };
}
