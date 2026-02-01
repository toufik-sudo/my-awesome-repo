// -----------------------------------------------------------------------------
// Badge Atom Component
// Custom badge variants extending shadcn Badge
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        success: 'bg-accent/20 text-accent-foreground',
        warning: 'bg-primary/20 text-primary-foreground',
        info: 'bg-secondary/20 text-secondary-foreground',
        outline: 'border border-input bg-background text-foreground',
        muted: 'bg-muted text-muted-foreground',
        // Ranking badges
        gold: 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground',
        silver: 'bg-gradient-to-r from-muted to-muted-foreground/50 text-foreground',
        bronze: 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Ranking badge with position number
interface RankingBadgeProps extends Omit<BadgeProps, 'variant'> {
  position: number;
}

export const RankingBadge: React.FC<RankingBadgeProps> = ({
  position,
  className,
  ...props
}) => {
  const variant =
    position === 1
      ? 'gold'
      : position === 2
      ? 'silver'
      : position === 3
      ? 'bronze'
      : 'muted';

  return (
    <Badge variant={variant} className={cn('min-w-[2rem] justify-center', className)} {...props}>
      #{position}
    </Badge>
  );
};

// Status badge
type StatusType = 'active' | 'inactive' | 'pending' | 'completed' | 'error';

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: StatusType;
}

const statusVariantMap: Record<StatusType, VariantProps<typeof badgeVariants>['variant']> = {
  active: 'success',
  inactive: 'muted',
  pending: 'warning',
  completed: 'info',
  error: 'destructive',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  ...props
}) => {
  return (
    <Badge variant={statusVariantMap[status]} {...props}>
      {children || status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export { Badge, badgeVariants };
export default Badge;
