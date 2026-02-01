import React from 'react';
import { useIntl } from 'react-intl';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IDeclarationHeader, ISortable, SortDirection, DeclarationSorting } from '../types';
import { DECLARATION_HEADERS } from '../constants';
import { cn } from '@/lib/utils';

interface DeclarationHeaderProps {
  headers?: IDeclarationHeader[];
  sortState: ISortable;
  onSort: (sort: ISortable) => void;
  isLoading?: boolean;
}

/**
 * Header row for declarations table with sorting support
 */
export const DeclarationHeader: React.FC<DeclarationHeaderProps> = ({
  headers = DECLARATION_HEADERS,
  sortState,
  onSort,
  isLoading = false,
}) => {
  const intl = useIntl();

  const handleSort = (header: IDeclarationHeader) => {
    if (header.isNotSortable || header.sortBy === DeclarationSorting.NONE) return;

    const newDirection =
      sortState.sortBy === header.sortBy && sortState.sortDirection === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    onSort({
      sortBy: header.sortBy,
      sortDirection: newDirection,
    });
  };

  const getSortIcon = (header: IDeclarationHeader) => {
    if (header.isNotSortable || header.sortBy === DeclarationSorting.NONE) return null;

    if (sortState.sortBy !== header.sortBy) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />;
    }

    return sortState.sortDirection === SortDirection.ASC ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 p-3 bg-muted/50 border-b font-medium text-sm">
      {headers.map((header) => {
        const isSortable = !header.isNotSortable && header.sortBy !== DeclarationSorting.NONE;
        const isActive = sortState.sortBy === header.sortBy;

        return (
          <div key={header.id} className="flex items-center">
            {isSortable ? (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-auto p-0 hover:bg-transparent font-medium',
                  isActive && 'text-primary'
                )}
                onClick={() => handleSort(header)}
                disabled={isLoading}
              >
                {intl.formatMessage({ id: `declarations.header.${header.id}` })}
                {getSortIcon(header)}
              </Button>
            ) : (
              <span className="text-muted-foreground">
                {intl.formatMessage({ id: `declarations.header.${header.id}` })}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DeclarationHeader;
