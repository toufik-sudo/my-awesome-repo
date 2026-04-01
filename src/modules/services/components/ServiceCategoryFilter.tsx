import React, { useState, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, X } from 'lucide-react';
import { CATEGORY_ICONS, SERVICE_CATEGORIES } from '../services.constants';

interface CategoryCount {
  category: string;
  count: number;
}

interface ServiceCategoryFilterProps {
  /** Categories with counts from the API or mock data */
  categoryCounts: CategoryCount[];
  /** Currently selected categories */
  selected: string[];
  /** Called when selection changes */
  onChange: (selected: string[]) => void;
  /** How many popular categories to show by default */
  defaultVisible?: number;
}

export const ServiceCategoryFilter: React.FC<ServiceCategoryFilterProps> = memo(({
  categoryCounts,
  selected,
  onChange,
  defaultVisible = 5,
}) => {
  const { t } = useTranslation();
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Sort categories by popularity (count desc)
  const sortedCategories = useMemo(() => {
    return [...categoryCounts].sort((a, b) => b.count - a.count);
  }, [categoryCounts]);

  // Top N popular categories
  const topCategories = useMemo(() => {
    return sortedCategories.slice(0, defaultVisible);
  }, [sortedCategories, defaultVisible]);

  // All remaining categories
  const otherCategories = useMemo(() => {
    return sortedCategories.slice(defaultVisible);
  }, [sortedCategories, defaultVisible]);

  // Categories currently shown as pills (top + any manually-added extras)
  const [extraCategories, setExtraCategories] = useState<string[]>([]);

  const visibleCategories = useMemo(() => {
    const topIds = topCategories.map(c => c.category);
    const merged = [...topIds, ...extraCategories.filter(e => !topIds.includes(e))];
    return merged;
  }, [topCategories, extraCategories]);

  const handleToggle = useCallback((cat: string) => {
    if (selected.includes(cat)) {
      onChange(selected.filter(c => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  }, [selected, onChange]);

  const handleAddCategory = useCallback((cat: string) => {
    if (!extraCategories.includes(cat)) {
      setExtraCategories(prev => [...prev, cat]);
    }
    if (!selected.includes(cat)) {
      onChange([...selected, cat]);
    }
  }, [extraCategories, selected, onChange]);

  const handleRemoveCategory = useCallback((cat: string) => {
    setExtraCategories(prev => prev.filter(c => c !== cat));
    onChange(selected.filter(c => c !== cat));
  }, [selected, onChange]);

  const clearAll = useCallback(() => {
    onChange([]);
    setExtraCategories([]);
  }, [onChange]);

  const getCategoryCount = useCallback((cat: string) => {
    return categoryCounts.find(c => c.category === cat)?.count || 0;
  }, [categoryCounts]);

  const isTopCategory = useCallback((cat: string) => {
    return topCategories.some(c => c.category === cat);
  }, [topCategories]);

  return (
    <div className="space-y-2">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2 items-center">
          {/* "All" button */}
          <Button
            variant={selected.length === 0 ? 'default' : 'outline'}
            size="sm"
            onClick={clearAll}
            className="shrink-0"
          >
            {t('services.allCategories', 'Tous')}
          </Button>

          {/* Visible category pills */}
          {visibleCategories.map(cat => {
            const icon = CATEGORY_ICONS[cat] || '✨';
            const count = getCategoryCount(cat);
            const isSelected = selected.includes(cat);
            const isExtra = !isTopCategory(cat);

            return (
              <div key={cat} className="shrink-0 flex items-center gap-0">
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToggle(cat)}
                  className="shrink-0 gap-1"
                >
                  <span>{icon}</span>
                  <span>{t(`services.categories.${cat}`, cat.replace(/_/g, ' '))}</span>
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0 h-4 bg-background/50">
                    {count}
                  </Badge>
                </Button>
                {isExtra && (
                  <button
                    onClick={() => handleRemoveCategory(cat)}
                    className="ml-0.5 p-0.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* "More" popover to add categories */}
          {otherCategories.length > 0 && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="shrink-0 gap-1">
                  <ChevronDown className="h-3.5 w-3.5" />
                  {t('services.moreCategories', 'Plus')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3" align="start">
                <div className="space-y-2 max-h-60 overflow-auto">
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    {t('services.addCategories', 'Ajouter des catégories')}
                  </p>
                  {SERVICE_CATEGORIES
                    .filter(cat => !visibleCategories.includes(cat))
                    .map(cat => {
                      const icon = CATEGORY_ICONS[cat] || '✨';
                      const count = getCategoryCount(cat);
                      return (
                        <label
                          key={cat}
                          className="flex items-center gap-2 p-1.5 rounded hover:bg-accent cursor-pointer text-sm"
                          onClick={() => handleAddCategory(cat)}
                        >
                          <span>{icon}</span>
                          <span className="flex-1">{t(`services.categories.${cat}`, cat.replace(/_/g, ' '))}</span>
                          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">{count}</Badge>
                        </label>
                      );
                    })}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
});

ServiceCategoryFilter.displayName = 'ServiceCategoryFilter';
