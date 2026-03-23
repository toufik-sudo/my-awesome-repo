import React, { memo, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RankingUser {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  previousRank?: number;
  subtitle?: string;
  badge?: string;
  metadata?: Record<string, string | number>;
}

export interface RankingColumn {
  key: string;
  label: string;
  render?: (value: any, user: RankingUser) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DynamicRankingProps {
  users: RankingUser[];
  title?: string;
  subtitle?: string;
  columns?: RankingColumn[];
  currentUserId?: string;
  showTrend?: boolean;
  showMedals?: boolean;
  maxItems?: number;
  scoreLabel?: string;
  scoreFormatter?: (score: number) => string;
  onUserClick?: (user: RankingUser) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'card';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getMedalIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="h-5 w-5 text-yellow-500 drop-shadow" />;
    case 2: return <Medal className="h-5 w-5 text-gray-400" />;
    case 3: return <Medal className="h-5 w-5 text-amber-600" />;
    default: return null;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1: return 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/15';
    case 2: return 'bg-gray-500/5 border-gray-400/20 hover:bg-gray-500/10';
    case 3: return 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10';
    default: return 'hover:bg-accent/50';
  }
};

const TrendIndicator: React.FC<{ current: number; previous?: number }> = memo(({ current, previous }) => {
  if (previous === undefined) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  const diff = previous - current; // positive = moved up
  if (diff > 0) return (
    <span className="flex items-center text-green-500 text-xs font-medium gap-0.5">
      <TrendingUp className="h-3.5 w-3.5" /> {diff}
    </span>
  );
  if (diff < 0) return (
    <span className="flex items-center text-destructive text-xs font-medium gap-0.5">
      <TrendingDown className="h-3.5 w-3.5" /> {Math.abs(diff)}
    </span>
  );
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
});
TrendIndicator.displayName = 'TrendIndicator';

// ─── Component ───────────────────────────────────────────────────────────────

export const DynamicRanking: React.FC<DynamicRankingProps> = memo(({
  users,
  title,
  subtitle,
  columns,
  currentUserId,
  showTrend = true,
  showMedals = true,
  maxItems,
  scoreLabel,
  scoreFormatter,
  onUserClick,
  loading = false,
  emptyMessage,
  className,
  variant = 'default',
}) => {
  const { t } = useTranslation();

  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => b.score - a.score);
    return maxItems ? sorted.slice(0, maxItems) : sorted;
  }, [users, maxItems]);

  const formatScore = useCallback((score: number) => {
    if (scoreFormatter) return scoreFormatter(score);
    return score.toLocaleString();
  }, [scoreFormatter]);

  const renderRow = useCallback((user: RankingUser, index: number) => {
    const rank = index + 1;
    const isCurrentUser = user.id === currentUserId;

    return (
      <div
        key={user.id}
        onClick={() => onUserClick?.(user)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent transition-all',
          getRankStyle(rank),
          isCurrentUser && 'ring-2 ring-primary/30 bg-primary/5',
          onUserClick && 'cursor-pointer',
          variant === 'compact' && 'py-2 px-3',
        )}
      >
        {/* Rank */}
        <div className="w-8 text-center shrink-0">
          {showMedals && rank <= 3 ? (
            getMedalIcon(rank)
          ) : (
            <span className={cn(
              'text-sm font-bold',
              rank <= 3 ? 'text-primary' : 'text-muted-foreground'
            )}>
              {rank}
            </span>
          )}
        </div>

        {/* Avatar */}
        <Avatar className={cn('shrink-0', variant === 'compact' ? 'h-8 w-8' : 'h-10 w-10')}>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              'font-semibold truncate',
              variant === 'compact' ? 'text-sm' : 'text-base',
              isCurrentUser && 'text-primary'
            )}>
              {user.name}
            </span>
            {user.badge && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                {user.badge}
              </Badge>
            )}
            {isCurrentUser && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0 border-primary text-primary">
                {t('ranking.you')}
              </Badge>
            )}
          </div>
          {user.subtitle && variant !== 'compact' && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user.subtitle}</p>
          )}
        </div>

        {/* Extra columns */}
        {columns?.map(col => (
          <div
            key={col.key}
            className={cn('shrink-0 text-sm', col.width || 'w-20')}
            style={{ textAlign: col.align || 'center' }}
          >
            {col.render
              ? col.render(user.metadata?.[col.key], user)
              : user.metadata?.[col.key] ?? '-'}
          </div>
        ))}

        {/* Score */}
        <div className="shrink-0 text-right">
          <span className={cn(
            'font-bold',
            variant === 'compact' ? 'text-sm' : 'text-base',
            rank <= 3 ? 'text-primary' : 'text-foreground'
          )}>
            {formatScore(user.score)}
          </span>
          {scoreLabel && variant !== 'compact' && (
            <p className="text-[10px] text-muted-foreground">{scoreLabel}</p>
          )}
        </div>

        {/* Trend */}
        {showTrend && (
          <div className="w-10 shrink-0 flex justify-center">
            <TrendIndicator current={rank} previous={user.previousRank} />
          </div>
        )}
      </div>
    );
  }, [currentUserId, showMedals, showTrend, scoreLabel, variant, columns, onUserClick, formatScore, t]);


  if (loading) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                <div className="w-8 h-5 bg-muted rounded" />
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1 h-4 bg-muted rounded" />
                <div className="w-16 h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {(title || subtitle) && (
        <CardHeader>
          {title && (
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> {title}
            </CardTitle>
          )}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </CardHeader>
      )}
      <CardContent>
        {/* Column headers */}
        {columns && columns.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border mb-2">
            <div className="w-8 text-center">#</div>
            <div className="h-10 w-10 shrink-0" />
            <div className="flex-1">{t('ranking.name')}</div>
            {columns.map(col => (
              <div key={col.key} className={cn('shrink-0 text-sm', col.width || 'w-20')} style={{ textAlign: col.align || 'center' }}>
                {col.label}
              </div>
            ))}
            <div className="w-20 text-right">{scoreLabel || t('ranking.score')}</div>
            {showTrend && <div className="w-10 text-center">{t('ranking.trend')}</div>}
          </div>
        )}

        {sortedUsers.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            {emptyMessage || t('ranking.empty')}
          </div>
        ) : (
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-1">
              {sortedUsers.map((user, i) => renderRow(user, i))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
});

DynamicRanking.displayName = 'DynamicRanking';
