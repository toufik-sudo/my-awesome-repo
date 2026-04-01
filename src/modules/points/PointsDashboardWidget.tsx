import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Star, Gift, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { usePointsSummary, useLeaderboard } from './points.hooks';
import { TIER_CONFIG, ACTION_LABELS } from './points.api';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { GlassCard, GlassStat } from '@/modules/admin/components/GlassCard';
import { format, parseISO } from 'date-fns';

export const PointsDashboardWidget: React.FC = memo(() => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split('-')[0] || 'fr';
  const { user } = useAuth();
  const { data: summary, loading } = usePointsSummary();
  const { data: leaderboard } = useLeaderboard(10);

  if (loading) return <LoadingSpinner size="sm" />;
  if (!summary) return null;

  const tierCfg = TIER_CONFIG[summary.tier] || TIER_CONFIG.bronze;

  return (
    <div className="space-y-4">
      {/* Points Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <GlassStat
          title={t('points.totalPoints', 'Points totaux')}
          value={summary.totalPoints.toLocaleString()}
          icon={<Star className="h-5 w-5" />}
          color="primary"
        />
        <GlassStat
          title={t('points.available', 'Disponibles')}
          value={summary.availablePoints.toLocaleString()}
          icon={<Gift className="h-5 w-5" />}
          color="accent"
        />
        <GlassStat
          title={t('points.tier', 'Niveau')}
          value={`${tierCfg.icon} ${tierCfg.label}`}
          icon={<Trophy className="h-5 w-5" />}
          color="secondary"
        />
        <GlassStat
          title={t('points.lifetime', 'Cumulés')}
          value={summary.lifetimePoints.toLocaleString()}
          icon={<TrendingUp className="h-5 w-5" />}
          color="amber"
        />
      </div>

      {/* Tier Progress */}
      {summary.nextTier && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {tierCfg.icon} {tierCfg.label} → {TIER_CONFIG[summary.nextTier.tier]?.icon} {TIER_CONFIG[summary.nextTier.tier]?.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {summary.nextTier.pointsNeeded} pts restants
              </span>
            </div>
            <Progress value={summary.tierProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('points.recentActivity', 'Activité récente')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summary.recentTransactions.slice(0, 6).map(tx => {
              const actionLabel = ACTION_LABELS[tx.action];
              const label = actionLabel?.[lang as keyof typeof actionLabel] || tx.description;
              return (
                <div key={tx.id} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-2">
                    {tx.points > 0 ? (
                      <ArrowUp className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span className="text-sm">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={tx.points > 0 ? 'secondary' : 'destructive'} className="text-xs">
                      {tx.points > 0 ? '+' : ''}{tx.points}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {format(parseISO(tx.createdAt), 'dd/MM')}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Mini Leaderboard */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              {t('points.leaderboard', 'Classement')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaderboard.slice(0, 6).map((entry, idx) => {
              const entryTier = TIER_CONFIG[entry.tier] || TIER_CONFIG.bronze;
              const isMe = entry.userId === Number(user?.id);
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between py-1.5 border-b border-border/30 last:border-0 ${isMe ? 'bg-primary/5 -mx-2 px-2 rounded' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground w-5">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <span className="text-sm font-medium">
                      {entry.user?.firstName || 'User'} {entry.user?.lastName || ''}
                      {isMe && <Badge variant="outline" className="ml-1 text-[10px]">Vous</Badge>}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{entryTier.icon}</span>
                    <span className="text-sm font-semibold">{entry.lifetimePoints.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

PointsDashboardWidget.displayName = 'PointsDashboardWidget';
