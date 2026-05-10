import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ServerPagination from './ServerPagination';
import { usePaginatedList } from '../hooks/usePaginatedList';
import type { Paginated } from '../types/pagination';

interface Props<T> {
  queryKey: readonly unknown[];
  fetcher: (params: { page: number; limit: number }) => Promise<Paginated<T>>;
  renderItem: (item: T, index: number) => React.ReactNode;
  initialLimit?: number;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  containerClassName?: string;
  showPageSize?: boolean;
}

/**
 * High-level paginated list view:
 *  - Desktop (md+): numbered pagination via ServerPagination
 *  - Mobile (<md): infinite scroll with explicit "Load more" button
 *
 * Backed by `usePaginatedList`. The fetcher must return the standard
 * `{ data, total, page, limit, totalPages }` shape.
 */
export function PaginatedListView<T>({
  queryKey,
  fetcher,
  renderItem,
  initialLimit = 20,
  emptyState,
  loadingState,
  containerClassName = 'space-y-2',
  showPageSize = true,
}: Props<T>) {
  const {
    items, page, limit, total, totalPages,
    isLoading, isFetching, isMobile,
    setPage, setLimit, loadMore, hasMore,
  } = usePaginatedList<T>({ queryKey, fetcher, initialLimit });

  if (isLoading && items.length === 0) {
    return loadingState ?? (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return emptyState ?? (
      <div className="text-center text-sm text-muted-foreground p-6">No results</div>
    );
  }

  return (
    <div>
      <div className={containerClassName}>
        {items.map((it, i) => renderItem(it, i))}
      </div>

      {isMobile ? (
        hasMore && (
          <div className="flex justify-center mt-4">
            <Button variant="outline" size="sm" onClick={loadMore} disabled={isFetching}>
              {isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Load more
            </Button>
          </div>
        )
      ) : (
        <ServerPagination
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={showPageSize ? setLimit : undefined}
          isLoading={isFetching}
        />
      )}
    </div>
  );
}

export default PaginatedListView;
