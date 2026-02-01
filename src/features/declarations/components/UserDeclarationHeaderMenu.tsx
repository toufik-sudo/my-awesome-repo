// -----------------------------------------------------------------------------
// UserDeclarationHeaderMenu Component
// Migrated from old_app/src/components/molecules/wall/declarations/UserDeclarationHeaderMenu.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Filter, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface IUserDeclarationHeaderMenuProps {
  className?: string;
  onSearch?: (query: string) => void;
  onFilterChange?: (status: string) => void;
  onExport?: () => void;
  onCreateNew?: () => void;
  showCreateButton?: boolean;
}

/**
 * Header menu for user declarations with search, filter, and actions
 */
const UserDeclarationHeaderMenu: React.FC<IUserDeclarationHeaderMenuProps> = ({
  className,
  onSearch,
  onFilterChange,
  onExport,
  onCreateNew,
  showCreateButton = false
}) => {
  const { formatMessage } = useIntl();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder={formatMessage({ id: 'declarations.search.placeholder' })}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>
      
      {/* Status Filter */}
      <Select onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder={formatMessage({ id: 'declarations.filter.status' })} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {formatMessage({ id: 'declarations.filter.all' })}
          </SelectItem>
          <SelectItem value="pending">
            {formatMessage({ id: 'declarations.filter.pending' })}
          </SelectItem>
          <SelectItem value="validated">
            {formatMessage({ id: 'declarations.filter.validated' })}
          </SelectItem>
          <SelectItem value="declined">
            {formatMessage({ id: 'declarations.filter.declined' })}
          </SelectItem>
        </SelectContent>
      </Select>
      
      {/* Export Button */}
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        {formatMessage({ id: 'declarations.export' })}
      </Button>
      
      {/* Create New Button */}
      {showCreateButton && (
        <Button size="sm" onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          {formatMessage({ id: 'declarations.create' })}
        </Button>
      )}
    </div>
  );
};

export default UserDeclarationHeaderMenu;
