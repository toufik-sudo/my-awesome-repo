import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BaseComponentProps } from '@/types/component.types';
import { buildComponentStyles } from '@/utils/styleBuilder';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DynamicTabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  tooltip?: string;
  content?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
}

export interface DynamicTabsProps extends BaseComponentProps {
  tabs: DynamicTabItem[];
  defaultValue?: string;
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'outline' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  animated?: boolean;
  scrollable?: boolean;
  onTabChange?: (value: string) => void;
  onTabHover?: (value: string) => void;
  onTabClick?: (value: string) => void;
  tabListSuffix?: React.ReactNode;
  tabListClassName?: string;
  children?: React.ReactNode;
}

export interface DynamicTabsOutput {
  activeTab: string;
  tabCount: number;
  visibleTabs: string[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export const DynamicTabs: React.FC<DynamicTabsProps> = memo(({
  tabs,
  defaultValue,
  value: controlledValue,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  animated = true,
  scrollable = true,
  onTabChange,
  onTabHover,
  onTabClick,
  tabListSuffix,
  tabListClassName,
  children,
  ...baseProps
}) => {
  const { t } = useTranslation();
  const { style, className } = buildComponentStyles(baseProps);

  const visibleTabs = tabs.filter(tab => !tab.hidden);
  const resolvedDefault = defaultValue || visibleTabs[0]?.value || '';
  const [internalValue, setInternalValue] = useState(resolvedDefault);
  const activeValue = controlledValue ?? internalValue;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, visibleTabs.length]);

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  const handleValueChange = useCallback((val: string) => {
    setInternalValue(val);
    onTabChange?.(val);
  }, [onTabChange]);

  const handleTabClick = useCallback((val: string) => {
    onTabClick?.(val);
  }, [onTabClick]);

  const handleTabHover = useCallback((val: string) => {
    onTabHover?.(val);
  }, [onTabHover]);

  if (baseProps.hidden) return null;

  const sizeClasses: Record<string, string> = {
    sm: 'text-xs h-8',
    md: 'text-sm h-9',
    lg: 'text-base h-11',
  };

  const variantListClasses: Record<string, string> = {
    default: '',
    outline: 'bg-transparent border border-border rounded-lg p-1',
    pills: 'bg-transparent gap-1',
    underline: 'bg-transparent border-b border-border rounded-none h-auto pb-0',
  };

  const variantTriggerClasses: Record<string, string> = {
    default: '',
    outline: 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md',
    pills: 'rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted/50',
    underline: 'rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2',
  };

  const renderTrigger = (tab: DynamicTabItem) => {
    const trigger = (
      <TabsTrigger
        key={tab.value}
        value={tab.value}
        disabled={tab.disabled}
        className={cn(
          sizeClasses[size],
          variantTriggerClasses[variant],
          fullWidth && 'flex-1',
          'gap-2 transition-all whitespace-nowrap',
          tab.triggerClassName
        )}
        onClick={() => handleTabClick(tab.value)}
        onMouseEnter={() => handleTabHover(tab.value)}
      >
        {tab.icon && <span className="shrink-0">{tab.icon}</span>}
        <span>{tab.label}</span>
        {tab.badge != null && (
          <Badge variant={tab.badgeVariant || 'secondary'} className="ml-1 h-5 min-w-[20px] px-1.5 text-[10px]">
            {tab.badge}
          </Badge>
        )}
      </TabsTrigger>
    );

    if (tab.tooltip) {
      return (
        <TooltipProvider key={tab.value}>
          <Tooltip>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent><p>{tab.tooltip}</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return trigger;
  };

  const showArrows = scrollable && orientation === 'horizontal';

  return (
    <Tabs
      value={activeValue}
      onValueChange={handleValueChange}
      orientation={orientation}
      className={cn(
        orientation === 'vertical' && 'flex gap-4',
        className
      )}
      style={style}
    >
      <div className={cn(
        orientation === 'vertical' && 'flex flex-col',
        'relative flex items-center gap-1'
      )}>
        {/* Left Arrow */}
        {showArrows && canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-muted/80 hover:bg-muted border border-border/50 shadow-sm transition-all z-10"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
        )}

        <div
          ref={scrollRef}
          className={cn(
            'flex-1 overflow-x-auto scrollbar-none',
            showArrows && 'scroll-smooth'
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <TabsList className={cn(
            variantListClasses[variant],
            orientation === 'vertical' && 'flex-col h-auto w-48 items-stretch',
            fullWidth && 'w-full',
            showArrows && 'w-max min-w-full',
            tabListClassName
          )}>
            {visibleTabs.map(renderTrigger)}
          </TabsList>
        </div>

        {/* Right Arrow */}
        {showArrows && canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-muted/80 hover:bg-muted border border-border/50 shadow-sm transition-all z-10"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        )}

        {tabListSuffix && (
          <div className="ml-auto flex items-center shrink-0">{tabListSuffix}</div>
        )}
      </div>

      <div className={cn(
        'mt-2',
        orientation === 'vertical' && 'mt-0 flex-1',
        animated && 'transition-all duration-200'
      )}>
        {visibleTabs.map(tab => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className={cn(
              animated && 'animate-in fade-in-50 duration-200',
              tab.contentClassName
            )}
          >
            {tab.content || (
              <p className="text-muted-foreground text-sm">{t('tabs.noContent')}</p>
            )}
          </TabsContent>
        ))}
        {children}
      </div>
    </Tabs>
  );
});

DynamicTabs.displayName = 'DynamicTabs';
