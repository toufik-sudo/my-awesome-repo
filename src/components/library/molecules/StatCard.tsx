// -----------------------------------------------------------------------------
// StatCard Molecule Component
// Stats display card for dashboards
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: {
    value: number;
    label?: string;
  };
  className?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  className,
  loading = false,
}) => {
  const getTrendIcon = () => {
    if (!change) return null;
    if (change.value > 0) return TrendingUp;
    if (change.value < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (!change) return '';
    if (change.value > 0) return 'text-accent';
    if (change.value < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const TrendIcon = getTrendIcon();

  if (loading) {
    return (
      <Card className={cn('p-6', className)}>
        <CardContent className="p-0">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/3 rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6', className)}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <div className={cn('flex items-center gap-1 text-sm', getTrendColor())}>
                {TrendIcon && <TrendIcon className="h-4 w-4" />}
                <span>
                  {change.value > 0 ? '+' : ''}
                  {change.value}%
                </span>
                {change.label && (
                  <span className="text-muted-foreground">{change.label}</span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div className="rounded-full bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Stats grid for multiple stat cards
interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  children,
  columns = 4,
  className,
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
};

export { StatCard };
export default StatCard;
