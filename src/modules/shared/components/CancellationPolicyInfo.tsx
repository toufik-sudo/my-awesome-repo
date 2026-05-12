import React from 'react';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type CancellationPolicy = 'flexible' | 'moderate' | 'strict' | string;

const POLICY_DETAILS: Record<string, { label: string; summary: string; bullets: string[] }> = {
  flexible: {
    label: 'Flexible',
    summary: 'Full refund up to 24 hours before the start time.',
    bullets: [
      'Full refund if cancelled at least 24h before the start.',
      'No refund afterwards or for no-shows.',
      'Service fee is always refunded if cancelled within the free window.',
    ],
  },
  moderate: {
    label: 'Moderate',
    summary: 'Full refund up to 5 days before the start time.',
    bullets: [
      'Full refund if cancelled at least 5 days before the start.',
      '50% refund of the remaining nights/sessions if cancelled later.',
      'No refund for the first night/session or no-shows.',
    ],
  },
  strict: {
    label: 'Strict',
    summary: 'Partial refund only if cancelled within 48h of booking.',
    bullets: [
      '50% refund if cancelled at least 7 days before the start.',
      'No refund within 7 days of the start date.',
      'Strict policies typically apply to high-demand or long-stay bookings.',
    ],
  },
};

interface CancellationPolicyInfoProps {
  policy?: CancellationPolicy;
  /** Render the policy label next to the icon. */
  showLabel?: boolean;
  className?: string;
  iconClassName?: string;
}

export const CancellationPolicyInfo: React.FC<CancellationPolicyInfoProps> = ({
  policy = 'flexible',
  showLabel = false,
  className,
  iconClassName,
}) => {
  const key = String(policy || 'flexible').toLowerCase();
  const details = POLICY_DETAILS[key] || {
    label: key.charAt(0).toUpperCase() + key.slice(1),
    summary: 'Cancellation conditions defined by the host.',
    bullets: ['Contact the host for full cancellation terms.'],
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 align-middle', className)}>
      {showLabel && (
        <span className="capitalize font-medium text-foreground">{details.label}</span>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Cancellation policy: ${details.label}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-full cursor-pointer"
          >
            <Info className={cn('h-4 w-4', iconClassName)} />
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="center" className="max-w-xs w-[280px] space-y-1.5 p-3 z-[60]">
          <p className="text-xs font-semibold text-foreground">
            {details.label} cancellation
          </p>
          <p className="text-xs text-muted-foreground">{details.summary}</p>
          <ul className="text-[11px] text-muted-foreground space-y-0.5 list-disc pl-4">
            {details.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </span>
  );
};

export default CancellationPolicyInfo;