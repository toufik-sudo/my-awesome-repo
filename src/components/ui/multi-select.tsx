// -----------------------------------------------------------------------------
// Multi-Select Component
// Reusable multi-select dropdown with All and Clear buttons
// -----------------------------------------------------------------------------

import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export interface MultiSelectOption {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  allLabel?: string;
  clearLabel?: string;
  className?: string;
  disabled?: boolean;
  maxDisplay?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Select items...',
  emptyMessage = 'No items found.',
  allLabel = 'All',
  clearLabel = 'Clear',
  className,
  disabled = false,
  maxDisplay = 2,
}) => {
  const [open, setOpen] = useState(false);

  const selectedLabels = useMemo(() => {
    return selected
      .map(val => options.find(opt => opt.value === val)?.label)
      .filter(Boolean) as string[];
  }, [selected, options]);

  const handleSelect = (value: string | number) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleSelectAll = () => {
    onChange(options.map(opt => opt.value));
  };

  const handleClear = () => {
    onChange([]);
  };

  const displayValue = () => {
    if (selected.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }
    
    if (selected.length === options.length) {
      return <span>{allLabel}</span>;
    }

    if (selected.length <= maxDisplay) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedLabels.map((label, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <Badge variant="secondary" className="text-xs">
          {selectedLabels[0]}
        </Badge>
        <span className="text-xs text-muted-foreground">
          +{selected.length - 1} more
        </span>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between min-h-[40px] h-auto bg-card border-border',
            className
          )}
        >
          <div className="flex-1 text-left">{displayValue()}</div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-popover border-border z-50" align="start">
        {/* All and Clear buttons */}
        <div className="flex items-center justify-between p-2 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="h-8 px-2 text-xs"
          >
            <Check className="mr-1 h-3 w-3" />
            {allLabel}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="mr-1 h-3 w-3" />
            {clearLabel}
          </Button>
        </div>

        <ScrollArea className="max-h-[300px]">
          {options.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              {emptyMessage}
            </p>
          ) : (
            <div className="p-1">
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors',
                      'hover:bg-muted/50',
                      isSelected && 'bg-primary/10 text-primary'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded border',
                        isSelected
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted-foreground/30'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span className="flex-1 truncate">{option.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
