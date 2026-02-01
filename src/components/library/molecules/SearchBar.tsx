// -----------------------------------------------------------------------------
// SearchBar Molecule Component
// Migrated from old_app/src/components/molecules/wall/SearchBar.tsx
// -----------------------------------------------------------------------------

import React, { useState, useCallback, InputHTMLAttributes } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  showFilter?: boolean;
  debounceMs?: number;
  className?: string;
  inputClassName?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilter,
  showFilter = false,
  debounceMs = 300,
  className,
  inputClassName,
  placeholder = 'Search...',
  ...inputProps
}) => {
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        onSearch?.(value);
      }, debounceMs);

      setDebounceTimer(timer);
    },
    [debounceMs, debounceTimer, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch?.('');
  }, [onSearch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(query);
    },
    [onSearch, query]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'relative flex items-center gap-2',
        className
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-md border border-input bg-background py-2 pl-10 pr-10',
            'text-sm placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            inputClassName
          )}
          {...inputProps}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showFilter && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onFilter}
          className="shrink-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
};

export { SearchBar };
export default SearchBar;
