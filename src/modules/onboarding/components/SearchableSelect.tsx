/**
 * SearchableSelect — combobox built on cmdk + Popover.
 * - Searchable input filters options on label + searchable text
 * - Scrollable list (max-height with overflow-y-auto)
 * - Optional `allowCustom`: lets user pick a free-text value not in the list
 * - Fully accessible (keyboard arrows, Enter to select, Esc to close)
 * - Themed exclusively with semantic tokens
 */
import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';

export interface SearchableSelectOption {
  value: string;          // unique key
  label: string;          // displayed in the trigger when selected and in the list
  description?: string;   // optional secondary line
  searchable?: string;    // additional text to match (e.g. dial code, country name)
  leading?: React.ReactNode; // icon / flag rendered before the label
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  /** Free-text values allowed (string typed in the search input) */
  allowCustom?: boolean;
  /** Label shown for the "use custom value" row (when allowCustom + no exact match) */
  customLabel?: (input: string) => string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No results.',
  disabled,
  className,
  triggerClassName,
  allowCustom = false,
  customLabel = (s) => `Use "${s}"`,
}) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const selected = options.find((o) => o.value === value);
  const triggerLabel = selected?.label || (value && allowCustom ? value : '');

  const trimmed = query.trim();
  const exactMatch = trimmed
    ? options.some(
        (o) => o.label.toLowerCase() === trimmed.toLowerCase() ||
               o.value.toLowerCase() === trimmed.toLowerCase(),
      )
    : true;
  const showCustomRow = allowCustom && trimmed.length > 0 && !exactMatch;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between font-normal',
            !triggerLabel && 'text-muted-foreground',
            triggerClassName,
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {selected?.leading}
            <span className="truncate">{triggerLabel || placeholder}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0 w-[--radix-popover-trigger-width] min-w-[320px]', className)}
        align="start"
      >
        <Command shouldFilter>
          <div className="flex items-center border-b px-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
              className="border-0 focus:ring-0 h-11 text-sm"
            />
          </div>
          <CommandList className="max-h-[22rem] overflow-y-auto">
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={`${opt.label} ${opt.searchable || ''} ${opt.value}`}
                  onSelect={() => {
                    onChange(opt.value);
                    setQuery('');
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  {opt.leading}
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{opt.label}</div>
                    {opt.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {opt.description}
                      </div>
                    )}
                  </div>
                  <Check
                    className={cn(
                      'h-4 w-4 shrink-0',
                      value === opt.value ? 'opacity-100 text-primary' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
              {showCustomRow && (
                <CommandItem
                  value={`__custom__${trimmed}`}
                  onSelect={() => {
                    onChange(trimmed);
                    setQuery('');
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 text-primary"
                >
                  <Check className="h-4 w-4 opacity-60" />
                  <span className="truncate">{customLabel(trimmed)}</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

SearchableSelect.displayName = 'SearchableSelect';
