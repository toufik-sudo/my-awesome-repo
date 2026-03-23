import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  trustStars: number;
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const TRUST_CONFIG: Record<number, { label: string; color: string; bgColor: string; description: string }> = {
  0: { label: 'Unverified', color: 'text-muted-foreground', bgColor: 'bg-muted', description: 'No identity documents provided' },
  1: { label: 'ID Verified', color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200', description: 'Identity verified' },
  2: { label: 'Verified', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', description: 'Identity + utility bill verified' },
  3: { label: 'Trusted', color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200', description: 'Identity + property deed verified' },
  5: { label: 'Fully Verified', color: 'text-primary', bgColor: 'bg-primary/10 border-primary/20', description: 'All documents verified — highest trust level' },
};

const sizeMap = {
  sm: { star: 'h-3 w-3', shield: 'h-3.5 w-3.5', text: 'text-[10px]', gap: 'gap-0.5', px: 'px-1.5 py-0.5' },
  md: { star: 'h-3.5 w-3.5', shield: 'h-4 w-4', text: 'text-xs', gap: 'gap-1', px: 'px-2 py-1' },
  lg: { star: 'h-4 w-4', shield: 'h-5 w-5', text: 'text-sm', gap: 'gap-1.5', px: 'px-3 py-1.5' },
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  trustStars,
  isVerified,
  size = 'md',
  showLabel = true,
  className,
}) => {
  const config = TRUST_CONFIG[trustStars] || TRUST_CONFIG[0];
  const s = sizeMap[size];
  const ShieldIcon = trustStars >= 3 ? ShieldCheck : trustStars >= 1 ? Shield : ShieldAlert;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center rounded-full border font-medium',
              config.bgColor,
              config.color,
              s.gap,
              s.px,
              s.text,
              className
            )}
          >
            <ShieldIcon className={cn(s.shield, 'shrink-0')} />
            {/* Trust stars */}
            <span className={cn('flex items-center', s.gap)}>
              {Array.from({ length: Math.min(trustStars, 5) }).map((_, i) => (
                <Star key={i} className={cn(s.star, 'fill-current')} />
              ))}
            </span>
            {showLabel && <span className="font-semibold">{config.label}</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px]">
          <p className="text-xs font-medium">{config.label}</p>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

TrustBadge.displayName = 'TrustBadge';
