import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ServerPagination from './ServerPagination';
import type { UsePaginatedListResult } from '../hooks/usePaginatedList';

interface Props<T> {
  paginated: UsePaginatedListResult<T>;
  loadMoreLabel?: string;
}

/**
 * Footer-only renderer for `usePaginatedList`.
 * Use when you already render items yourself (e.g. inside a custom grid)
 * but want responsive pagination controls (numbered desktop / load more mobile).
 */
export function PaginationFooter<T>({ paginated, loadMoreLabel = 'Load more' }: Props<T>) {
  if (paginated.isMobile) {
    if (!paginated.hasMore) return null;
    return (
      <div className="flex justify-center mt-4">
        <Button variant="outline" size="sm" onClick={paginated.loadMore} disabled={paginated.isFetching}>
          {paginated.isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {loadMoreLabel}
        </Button>
      </div>
    );
  }
  return (
    <ServerPagination
      page={paginated.page}
      limit={paginated.limit}
      total={paginated.total}
      totalPages={paginated.totalPages}
      onPageChange={paginated.setPage}
      onLimitChange={paginated.setLimit}
      isLoading={paginated.isFetching}
    />
  );
}

export default PaginationFooter;
