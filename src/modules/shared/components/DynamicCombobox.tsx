import React, { memo, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { BaseComponentProps } from '@/types/component.types';
import { buildComponentStyles } from '@/utils/styleBuilder';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ComboboxOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
  group?: string;
  disabled?: boolean;
}

export interface DynamicComboboxProps extends BaseComponentProps {
  options: ComboboxOption[];
  value?: string | string[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  multiSelect?: boolean;
  maxSelections?: number;
  clearable?: boolean;
  creatable?: boolean;
  grouped?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  triggerClassName?: string;
  contentClassName?: string;
  onSelect?: (value: string, option: ComboboxOption) => void;
  onDeselect?: (value: string) => void;
  onClear?: () => void;
  onCreate?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onSearch?: (query: string) => void;
  renderOption?: (option: ComboboxOption, isSelected: boolean) => React.ReactNode;
  renderValue?: (selected: ComboboxOption[]) => React.ReactNode;
}

export interface DynamicComboboxOutput {
  selectedValues: string[];
  selectedOptions: ComboboxOption[];
  isOpen: boolean;
  searchQuery: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const DynamicCombobox: React.FC<DynamicComboboxProps> = memo(({
  options,
  value,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  multiSelect = false,
  maxSelections,
  clearable = true,
  creatable = false,
  grouped = false,
  size = 'md',
  variant = 'default',
  triggerClassName,
  contentClassName,
  onSelect,
  onDeselect,
  onClear,
  onCreate,
  onOpenChange,
  onSearch,
  renderOption,
  renderValue,
  ...baseProps
}) => {
  const { t } = useTranslation();
  const { style, className } = buildComponentStyles(baseProps);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const selectedOptions = useMemo(() => {
    return options.filter(opt => selectedValues.includes(opt.value));
  }, [options, selectedValues]);

  const groupedOptions = useMemo(() => {
    if (!grouped) return { '': options };
    return options.reduce<Record<string, ComboboxOption[]>>((acc, opt) => {
      const group = opt.group || '';
      if (!acc[group]) acc[group] = [];
      acc[group].push(opt);
      return acc;
    }, {});
  }, [options, grouped]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
    if (!isOpen) setSearchQuery('');
  }, [onOpenChange]);

  const handleSelect = useCallback((optionValue: string) => {
    const option = options.find(o => o.value === optionValue);
    if (!option || option.disabled) return;

    if (multiSelect) {
      if (selectedValues.includes(optionValue)) {
        onDeselect?.(optionValue);
      } else {
        if (maxSelections && selectedValues.length >= maxSelections) return;
        onSelect?.(optionValue, option);
      }
    } else {
      onSelect?.(optionValue, option);
      setOpen(false);
    }
  }, [options, multiSelect, selectedValues, maxSelections, onSelect, onDeselect]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClear?.();
  }, [onClear]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  if (baseProps.hidden) return null;

  const sizeClasses: Record<string, string> = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  const getDisplayValue = () => {
    if (renderValue) return renderValue(selectedOptions);
    if (selectedOptions.length === 0) return (
      <span className="text-muted-foreground">{placeholder || t('combobox.select')}</span>
    );
    if (!multiSelect) {
      const opt = selectedOptions[0];
      return (
        <span className="flex items-center gap-2 truncate">
          {opt.icon}{opt.label}
        </span>
      );
    }
    return (
      <div className="flex flex-wrap gap-1 max-w-full">
        {selectedOptions.slice(0, 3).map(opt => (
          <Badge key={opt.value} variant="secondary" className="text-xs gap-1">
            {opt.label}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={(e) => { e.stopPropagation(); onDeselect?.(opt.value); }}
            />
          </Badge>
        ))}
        {selectedOptions.length > 3 && (
          <Badge variant="outline" className="text-xs">+{selectedOptions.length - 3}</Badge>
        )}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={variant === 'default' ? 'outline' : variant as any}
          role="combobox"
          aria-expanded={open}
          disabled={baseProps.disabled}
          className={cn(
            'w-full justify-between font-normal',
            sizeClasses[size],
            triggerClassName,
            className
          )}
          style={style}
        >
          <div className="flex-1 text-left truncate">{getDisplayValue()}</div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {clearable && selectedValues.length > 0 && (
              <X
                className="h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[--radix-popover-trigger-width] p-0', contentClassName)} align="start">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder || t('combobox.search')}
            value={searchQuery}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>
              {creatable && searchQuery ? (
                <button
                  className="w-full px-2 py-1.5 text-sm text-left hover:bg-accent rounded cursor-pointer"
                  onClick={() => { onCreate?.(searchQuery); setSearchQuery(''); }}
                >
                  {t('combobox.create', { value: searchQuery })}
                </button>
              ) : (
                emptyMessage || t('combobox.noResults')
              )}
            </CommandEmpty>
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <CommandGroup key={group} heading={group || undefined}>
                {groupOptions.map(option => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className="cursor-pointer"
                    >
                      {renderOption ? renderOption(option, isSelected) : (
                        <>
                          <Check className={cn('mr-2 h-4 w-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {option.icon}
                            <div className="flex flex-col min-w-0">
                              <span className="truncate">{option.label}</span>
                              {option.description && (
                                <span className="text-xs text-muted-foreground truncate">{option.description}</span>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

DynamicCombobox.displayName = 'DynamicCombobox';
