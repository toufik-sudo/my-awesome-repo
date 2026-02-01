// -----------------------------------------------------------------------------
// UserDeclarationHeader Component
// Migrated from old_app/src/components/molecules/wall/declarations/UserDeclarationHeader.tsx
// Columns match old_app layout: source, id, programName, programType, date, declarant, company, target, product, quantity, amount, status, validatedBy
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ISortState } from './UserDeclarationsList';
import { USER_DECLARATIONS_SORTING } from '@/constants/api/declarations';

interface IHeaderColumn {
  key: string;
  label: string;
  sortBy: string;
  sortable?: boolean;
  className?: string;
}

const DECLARATION_HEADERS: IHeaderColumn[] = [
  { key: 'source', label: 'declarations.header.source', sortBy: USER_DECLARATIONS_SORTING.SOURCE, sortable: true },
  { key: 'id', label: 'declarations.header.id', sortBy: USER_DECLARATIONS_SORTING.ID, sortable: true },
  { key: 'programName', label: 'declarations.header.programName', sortBy: USER_DECLARATIONS_SORTING.PROGRAM_NAME, sortable: true },
  { key: 'programType', label: 'declarations.header.programType', sortBy: USER_DECLARATIONS_SORTING.PROGRAM_TYPE, sortable: true },
  { key: 'occurredOn', label: 'declarations.header.occurredOn', sortBy: USER_DECLARATIONS_SORTING.OCCURRED_ON, sortable: true },
  { key: 'declarant', label: 'declarations.header.declarant', sortBy: USER_DECLARATIONS_SORTING.USER, sortable: true },
  { key: 'customerCompany', label: 'declarations.header.customerCompany', sortBy: USER_DECLARATIONS_SORTING.COMPANY_NAME, sortable: true },
  { key: 'target', label: 'declarations.header.target', sortBy: USER_DECLARATIONS_SORTING.FIRST_NAME, sortable: true },
  { key: 'product', label: 'declarations.header.product', sortBy: USER_DECLARATIONS_SORTING.PRODUCT_NAME, sortable: true },
  { key: 'quantity', label: 'declarations.header.quantity', sortBy: USER_DECLARATIONS_SORTING.QUANTITY, sortable: true },
  { key: 'amount', label: 'declarations.header.amount', sortBy: USER_DECLARATIONS_SORTING.AMOUNT, sortable: true },
  { key: 'status', label: 'declarations.header.status', sortBy: USER_DECLARATIONS_SORTING.STATUS, sortable: true },
  { key: 'by', label: 'declarations.header.by', sortBy: USER_DECLARATIONS_SORTING.VALIDATED_BY, sortable: true },
];

interface IUserDeclarationHeaderProps {
  sortState: ISortState;
  onSort: (sortBy: string) => void;
  headers?: IHeaderColumn[];
  className?: string;
  isLoading?: boolean;
}

/**
 * Header row for user declarations table with sorting
 */
const UserDeclarationHeader: React.FC<IUserDeclarationHeaderProps> = ({
  sortState,
  onSort,
  headers = DECLARATION_HEADERS,
  className,
  isLoading = false
}) => {
  const { formatMessage } = useIntl();

  const getSortIcon = (sortBy: string) => {
    if (sortState.sortBy !== sortBy) {
      return <ChevronsUpDown className="h-3 w-3 opacity-50" />;
    }
    
    return sortState.sortDirection === 'ASC' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className={cn(
      'grid grid-cols-[40px_60px_minmax(100px,1fr)_100px_100px_minmax(100px,1fr)_minmax(100px,1fr)_minmax(80px,1fr)_minmax(80px,1fr)_60px_80px_100px_100px] gap-2 px-3 py-2.5 bg-muted/50 font-medium text-xs text-muted-foreground sticky top-0',
      className
    )}>
      {headers.map(header => (
        <div key={header.key} className={cn('flex items-center', header.className)}>
          {header.sortable ? (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-auto p-0 hover:bg-transparent font-medium text-xs',
                sortState.sortBy === header.sortBy && 'text-foreground'
              )}
              onClick={() => onSort(header.sortBy)}
              disabled={isLoading}
            >
              <span className="mr-1">{formatMessage({ id: header.label })}</span>
              {getSortIcon(header.sortBy)}
            </Button>
          ) : (
            <span>{formatMessage({ id: header.label })}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserDeclarationHeader;
