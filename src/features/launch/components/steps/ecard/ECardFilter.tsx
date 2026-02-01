// -----------------------------------------------------------------------------
// ECard Filter Component
// Migrated from old_app/src/components/organisms/launch/eCard/eCardFilter.tsx
// Filter controls for eCard selection
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Search, Filter, X, CheckSquare, Square } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { IEcardFilters } from '@/features/launch/hooks/useEcardData';
import type { IECardCategory } from '@/api/ECardApi';

interface ECardFilterProps {
  filters: IEcardFilters;
  countries: string[];
  categories: IECardCategory[];
  selectedCount: number;
  totalCount: number;
  onFilterChange: (filters: Partial<IEcardFilters>) => void;
  onReset: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isAllSelected: boolean;
}

export const ECardFilter: React.FC<ECardFilterProps> = ({
  filters,
  countries,
  categories,
  selectedCount,
  totalCount,
  onFilterChange,
  onReset,
  onSelectAll,
  onDeselectAll,
  isAllSelected,
}) => {
  const { formatMessage } = useIntl();

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];
    onFilterChange({ categories: newCategories });
  };

  const hasActiveFilters = 
    filters.searchTerm || 
    filters.countryCode !== 'all' || 
    (filters.categories?.length ?? 0) > 0;

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      {/* First Row - Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={formatMessage({ id: 'eCard.filter.brand.placeholder', defaultMessage: 'Search by brand name...' })}
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Country Select */}
        <Select
          value={filters.countryCode}
          onValueChange={(value) => onFilterChange({ countryCode: value })}
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder={formatMessage({ id: 'eCard.filter.country', defaultMessage: 'Country' })} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {formatMessage({ id: 'eCard.filter.country.all', defaultMessage: 'All Countries' })}
            </SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full lg:w-48">
              <Filter className="h-4 w-4 mr-2" />
              {formatMessage({ id: 'eCard.filter.category', defaultMessage: 'Categories' })}
              {(filters.categories?.length ?? 0) > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.categories?.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
            <DropdownMenuLabel>
              {formatMessage({ id: 'eCard.filter.category.select', defaultMessage: 'Select Categories' })}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.value}
                checked={filters.categories?.includes(category.value)}
                onCheckedChange={() => handleCategoryToggle(category.value)}
              >
                {formatMessage({ id: category.label, defaultMessage: category.value })}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onReset} className="lg:w-auto">
            <X className="h-4 w-4 mr-2" />
            {formatMessage({ id: 'eCard.filter.reset', defaultMessage: 'Reset' })}
          </Button>
        )}
      </div>

      {/* Second Row - Selection Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
          >
            {isAllSelected ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                {formatMessage({ id: 'eCard.filter.deselectAll', defaultMessage: 'Deselect All' })}
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4 mr-2" />
                {formatMessage({ id: 'eCard.filter.selectAll', defaultMessage: 'Select All' })}
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {formatMessage(
              { id: 'eCard.filter.showing', defaultMessage: 'Showing {count} cards' },
              { count: totalCount }
            )}
          </span>
          {selectedCount > 0 && (
            <Badge variant="default" className="ml-2">
              {formatMessage(
                { id: 'eCard.filter.selected', defaultMessage: '{count} selected' },
                { count: selectedCount }
              )}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ECardFilter;
