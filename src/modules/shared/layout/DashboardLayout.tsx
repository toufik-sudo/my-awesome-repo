import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import {
  Menu, Bell, Search, Settings, User,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DashboardStatCard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive';
}

export interface DashboardQuickAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}

export interface DashboardLayoutProps {
  /** Page title */
  title?: string;
  /** Subtitle / description */
  subtitle?: string;
  /** Stats cards row */
  stats?: DashboardStatCard[];
  /** Quick action buttons */
  quickActions?: DashboardQuickAction[];
  /** Header actions (right side) */
  headerActions?: React.ReactNode;
  /** Sidebar content */
  sidebar?: React.ReactNode;
  /** Whether sidebar is on right */
  sidebarPosition?: 'left' | 'right';
  /** Main content */
  children: React.ReactNode;
  /** Activity feed / notifications panel */
  activityFeed?: React.ReactNode;
  /** Show breadcrumbs */
  breadcrumbs?: React.ReactNode;
  /** Custom header */
  customHeader?: React.ReactNode;
  /** Grid layout for children */
  gridCols?: 1 | 2 | 3 | 4;
  /** Padding */
  padded?: boolean;
  className?: string;
  /** Callbacks */
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

const StatCard: React.FC<DashboardStatCard> = memo(({
  title, value, change, changeLabel, icon, color = 'primary'
}) => {
  const colorMap: Record<string, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    destructive: 'text-destructive',
  };

  const bgMap: Record<string, string> = {
    primary: 'bg-primary/10',
    secondary: 'bg-secondary/10',
    accent: 'bg-accent/10',
    destructive: 'bg-destructive/10',
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : change < 0 ? (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                ) : (
                  <Minus className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={change > 0 ? 'text-green-500' : change < 0 ? 'text-destructive' : 'text-muted-foreground'}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
                {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
              </div>
            )}
          </div>
          {icon && (
            <div className={cn('p-2.5 rounded-lg', bgMap[color])}>
              <div className={colorMap[color]}>{icon}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
StatCard.displayName = 'StatCard';

// ─── Component ───────────────────────────────────────────────────────────────

export const DashboardLayout: React.FC<DashboardLayoutProps> = memo(({
  title,
  subtitle,
  stats,
  quickActions,
  headerActions,
  sidebar,
  sidebarPosition = 'right',
  children,
  activityFeed,
  breadcrumbs,
  customHeader,
  gridCols = 1,
  padded = true,
  className,
  onMenuClick,
  onSearchClick,
  onNotificationClick,
  onSettingsClick,
  onProfileClick,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const gridColsClass: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('min-h-full', className)}>
      {/* Header */}
      {customHeader || (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {onMenuClick && isMobile && (
              <Button variant="ghost" size="icon" onClick={onMenuClick}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div>
              {breadcrumbs}
              {title && <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>}
              {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            {onSearchClick && (
              <Button variant="ghost" size="icon" onClick={onSearchClick}>
                <Search className="h-4 w-4" />
              </Button>
            )}
            {onNotificationClick && (
              <Button variant="ghost" size="icon" onClick={onNotificationClick} className="relative">
                <Bell className="h-4 w-4" />
              </Button>
            )}
            {onSettingsClick && (
              <Button variant="ghost" size="icon" onClick={onSettingsClick}>
                <Settings className="h-4 w-4" />
              </Button>
            )}
            {onProfileClick && (
              <Button variant="ghost" size="icon" onClick={onProfileClick}>
                <User className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Stats Row */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <ErrorBoundary key={i}>
              <StatCard {...stat} />
            </ErrorBoundary>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {quickActions && quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {quickActions.map((action, i) => (
            <Button
              key={i}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
              className="gap-2"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className={cn(
        'flex gap-6',
        sidebarPosition === 'left' && 'flex-row-reverse'
      )}>
        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className={cn('grid gap-4 sm:gap-6', gridColsClass[gridCols])}>
            {children}
          </div>
        </div>

        {/* Sidebar */}
        {sidebar && !isMobile && (
          <aside className="w-72 xl:w-80 shrink-0">
            <div className="sticky top-6 space-y-4">
              <ErrorBoundary>{sidebar}</ErrorBoundary>
            </div>
          </aside>
        )}
      </div>

      {/* Activity Feed */}
      {activityFeed && (
        <div className="mt-6">
          <ErrorBoundary>{activityFeed}</ErrorBoundary>
        </div>
      )}
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
