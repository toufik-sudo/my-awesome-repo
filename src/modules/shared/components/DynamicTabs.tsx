import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

  // Scroll state for horizontal tabs
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, visibleTabs.length]);

  const scrollBy = useCallback((dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
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
          'gap-2 transition-all whitespace-nowrap shrink-0',
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

  const showArrows = orientation === 'horizontal' && (canScrollLeft || canScrollRight);

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
        'relative'
      )}>
        <div className="flex items-center gap-1">
          {showArrows && canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full border border-border bg-background shadow-sm hover:bg-muted"
              onClick={() => scrollBy(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide flex-1"
          >
            <TabsList className={cn(
              variantListClasses[variant],
              orientation === 'vertical' && 'flex-col h-auto w-48 items-stretch',
              fullWidth && 'w-full',
              'inline-flex w-auto max-w-none',
              tabListClassName
            )}>
              {visibleTabs.map(renderTrigger)}
            </TabsList>
          </div>
          {showArrows && canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full border border-border bg-background shadow-sm hover:bg-muted"
              onClick={() => scrollBy(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        {tabListSuffix && (
          <div className="ml-auto flex items-center">{tabListSuffix}</div>
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
