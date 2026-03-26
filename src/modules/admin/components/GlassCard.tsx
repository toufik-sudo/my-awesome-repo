import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'accent' | 'stat';
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = false,
  onClick,
}) => {
  const variants = {
    default: 'bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-border/40 shadow-sm',
    elevated: 'bg-card/70 dark:bg-card/50 backdrop-blur-2xl border border-border/30 shadow-lg',
    accent: 'bg-gradient-to-br from-primary/5 via-card/60 to-secondary/5 dark:from-primary/10 dark:via-card/40 dark:to-secondary/10 backdrop-blur-xl border border-primary/20 shadow-md',
    stat: 'bg-card/50 dark:bg-card/30 backdrop-blur-xl border border-border/30 shadow-md',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        hover && 'hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/30 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// ─── Glass Stat Card ────────────────────────────────────────────────────────

interface GlassStatProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'emerald' | 'amber';
  change?: number;
  changeLabel?: string;
  onClick?: () => void;
}

const COLOR_MAP: Record<string, { bg: string; text: string; glow: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', glow: 'shadow-primary/20' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary', glow: 'shadow-secondary/20' },
  accent: { bg: 'bg-accent/10', text: 'text-accent', glow: 'shadow-accent/20' },
  destructive: { bg: 'bg-destructive/10', text: 'text-destructive', glow: 'shadow-destructive/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', glow: 'shadow-amber-500/20' },
};

export const GlassStat: React.FC<GlassStatProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  change,
  changeLabel,
  onClick,
}) => {
  const c = COLOR_MAP[color];

  return (
    <GlassCard variant="stat" hover onClick={onClick}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {change !== undefined && (
              <p className={cn('text-xs font-medium', change >= 0 ? 'text-emerald-500' : 'text-destructive')}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% {changeLabel}
              </p>
            )}
          </div>
          <div className={cn('p-3 rounded-xl', c.bg, `shadow-lg ${c.glow}`)}>
            <div className={c.text}>{icon}</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
