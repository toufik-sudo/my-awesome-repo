import React, { memo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BaseComponentProps } from '@/types/component.types';
import { buildComponentStyles } from '@/utils/styleBuilder';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DynamicTabItem {
  /** Unique tab key */
  value: string;
  /** Display label */
  label: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Badge count or text */
  badge?: string | number;
  /** Badge variant */
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  /** Tooltip on hover */
  tooltip?: string;
  /** Tab content */
  content?: React.ReactNode;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Whether tab is hidden */
  hidden?: boolean;
  /** Custom class for the trigger */
  triggerClassName?: string;
  /** Custom class for the content panel */
  contentClassName?: string;
}

export interface DynamicTabsProps extends BaseComponentProps {
  /** Tab items configuration */
  tabs: DynamicTabItem[];
  /** Default active tab value */
  defaultValue?: string;
  /** Controlled active tab value */
  value?: string;
  /** Tab orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Tab list variant style */
  variant?: 'default' | 'outline' | 'pills' | 'underline';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width tabs */
  fullWidth?: boolean;
  /** Animate content transitions */
  animated?: boolean;
  /** Called when tab changes */
  onTabChange?: (value: string) => void;
  /** Called when a tab is hovered */
  onTabHover?: (value: string) => void;
  /** Called when a tab is clicked */
  onTabClick?: (value: string) => void;
  /** Extra content next to tab list */
  tabListSuffix?: React.ReactNode;
  /** Custom class for tab list */
  tabListClassName?: string;
  /** Children (alternative to tabs[].content) */
  children?: React.ReactNode;
}

// ─── Outputs ─────────────────────────────────────────────────────────────────

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
          'gap-2 transition-all',
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
        <TabsList className={cn(
          variantListClasses[variant],
          orientation === 'vertical' && 'flex-col h-auto w-48 items-stretch',
          fullWidth && 'w-full',
          tabListClassName
        )}>
          {visibleTabs.map(renderTrigger)}
        </TabsList>
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
