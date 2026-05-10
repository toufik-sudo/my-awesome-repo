import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export interface RefreshControlProps {
  /** Async refresh function. Should resolve when fresh data is loaded. */
  onRefresh: () => void | Promise<void>;
  /** Storage key — when provided, the user's auto-refresh choice is persisted across reloads. */
  storageKey?: string;
  /** Available auto-refresh intervals in seconds. 0 = off. */
  intervals?: number[];
  /** Default interval in seconds (0 = off). */
  defaultInterval?: number;
  /** Hide auto-refresh dropdown — show only the manual button. */
  manualOnly?: boolean;
  /** Hide the "last updated" label. */
  hideTimestamp?: boolean;
  /** Compact (icon-only) variant. */
  compact?: boolean;
  className?: string;
}

const DEFAULT_INTERVALS = [0, 10, 30, 60, 300];

/**
 * Reusable manual + auto refresh control.
 * - Manual: click to trigger an immediate refresh.
 * - Auto: optional interval picker (off / 10s / 30s / 1m / 5m).
 * - Persists user choice in localStorage when `storageKey` is provided.
 * - Pauses auto-refresh when the tab is hidden (visibilitychange) to save resources.
 */
export const RefreshControl: React.FC<RefreshControlProps> = ({
  onRefresh,
  storageKey,
  intervals = DEFAULT_INTERVALS,
  defaultInterval = 0,
  manualOnly = false,
  hideTimestamp = false,
  compact = false,
  className,
}) => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [interval, setInterval] = useState<number>(() => {
    if (!storageKey) return defaultInterval;
    const saved = localStorage.getItem(`refresh-interval:${storageKey}`);
    return saved ? Number(saved) : defaultInterval;
  });

  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const triggerRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await onRefreshRef.current();
      setLastUpdated(new Date());
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  // Persist choice
  useEffect(() => {
    if (storageKey) localStorage.setItem(`refresh-interval:${storageKey}`, String(interval));
  }, [interval, storageKey]);

  // Auto-refresh timer — pauses when tab hidden
  useEffect(() => {
    if (manualOnly || interval <= 0) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const tick = () => {
      if (document.visibilityState === 'visible') {
        triggerRefresh();
      }
      timer = setTimeout(tick, interval * 1000);
    };
    timer = setTimeout(tick, interval * 1000);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [interval, manualOnly, triggerRefresh]);

  const formatInterval = (s: number) =>
    s === 0
      ? t('refresh.off', 'Off')
      : s < 60
      ? t('refresh.seconds', '{{n}}s', { n: s })
      : t('refresh.minutes', '{{n}}m', { n: Math.round(s / 60) });

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {!hideTimestamp && lastUpdated && !compact && (
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {t('refresh.lastUpdated', 'Updated')}{' '}
          {lastUpdated.toLocaleTimeString()}
        </span>
      )}

      <Button
        variant="outline"
        size={compact ? 'icon' : 'sm'}
        onClick={triggerRefresh}
        disabled={refreshing}
        aria-label={t('refresh.refresh', 'Refresh')}
        className="gap-2"
      >
        <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
        {!compact && <span>{t('refresh.refresh', 'Refresh')}</span>}
      </Button>

      {!manualOnly && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 px-2">
              <span className="text-xs">{t('refresh.auto', 'Auto')}</span>
              <Badge variant={interval > 0 ? 'default' : 'secondary'} className="text-[10px] px-1.5">
                {formatInterval(interval)}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('refresh.autoRefresh', 'Auto-refresh')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {intervals.map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => setInterval(s)}
                className={cn(interval === s && 'bg-accent')}
              >
                {formatInterval(s)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default RefreshControl;
