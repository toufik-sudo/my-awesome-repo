import React, { useState, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { DynamicTabs } from '@/modules/shared/components/DynamicTabs';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { GlassStat } from '@/modules/admin/components/GlassCard';
import { usePointsSummary, useLeaderboard, usePointsTransactions } from '@/modules/points/points.hooks';
import type { PointTransaction } from '@/modules/points/points.api';
import { useBadgeProgress } from '@/modules/points/badges.hooks';
import { TIER_CONFIG, ACTION_LABELS } from '@/modules/points/points.api';
import {
  Trophy, Star, Gift, TrendingUp, ArrowUp, ArrowDown,
  Award, Target, Zap, Crown, Medal, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
const BADGE_CATEGORIES = ['booking', 'review', 'social', 'loyalty', 'achievement', 'special'] as const;
const CATEGORY_LABELS: Record<string, { fr: string; en: string; ar: string }> = {
  booking: { fr: 'Réservations', en: 'Bookings', ar: 'حجوزات' },
  review: { fr: 'Avis', en: 'Reviews', ar: 'تقييمات' },
  social: { fr: 'Social', en: 'Social', ar: 'اجتماعي' },
  loyalty: { fr: 'Fidélité', en: 'Loyalty', ar: 'ولاء' },
  achievement: { fr: 'Réalisations', en: 'Achievements', ar: 'إنجازات' },
  special: { fr: 'Spécial', en: 'Special', ar: 'خاص' },
};

const PointsPage: React.FC = memo(() => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.split('-')[0] || 'fr') as 'fr' | 'en' | 'ar';
  const { data: summary, loading: summaryLoading } = usePointsSummary();
  const { data: leaderboard } = useLeaderboard(20);
  const { data: badgeProgress, loading: badgesLoading } = useBadgeProgress();
  const { data: transactions, loading: txLoading, page, setPage, totalPages } = usePointsTransactions();

  const tierCfg = TIER_CONFIG[summary?.tier || 'bronze'];
  const unlockedCount = useMemo(() => badgeProgress.filter(b => b.unlocked).length, [badgeProgress]);
  const totalBadges = badgeProgress.length;

  if (summaryLoading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;
  if (!summary) return null;

  const tabs = [
    {
      value: 'overview',
      label: t('points.tabs.overview', 'Vue d\'ensemble'),
      icon: <Star className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <GlassStat title={t('points.totalPoints', 'Points totaux')} value={summary.totalPoints.toLocaleString()} icon={<Star className="h-5 w-5" />} color="primary" />
            <GlassStat title={t('points.available', 'Disponibles')} value={summary.availablePoints.toLocaleString()} icon={<Gift className="h-5 w-5" />} color="accent" />
            <GlassStat title={t('points.tier', 'Niveau')} value={`${tierCfg.icon} ${tierCfg.label}`} icon={<Trophy className="h-5 w-5" />} color="secondary" />
            <GlassStat title={t('points.badges', 'Badges')} value={`${unlockedCount}/${totalBadges}`} icon={<Award className="h-5 w-5" />} color="amber" />
          </div>

          {/* Tier Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Crown className="h-5 w-5 text-primary" /> Progression des niveaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TIER_ORDER.map((tier, idx) => {
                  const cfg = TIER_CONFIG[tier];
                  const isCurrentOrAbove = TIER_ORDER.indexOf(summary.tier) >= idx;
                  const progress = isCurrentOrAbove ? 100 : summary.tier === TIER_ORDER[idx - 1]
                    ? summary.tierProgress : 0;
                  return (
                    <div key={tier} className="flex items-center gap-4">
                      <div className={`text-2xl w-10 text-center ${isCurrentOrAbove ? '' : 'opacity-30 grayscale'}`}>{cfg.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${isCurrentOrAbove ? 'text-foreground' : 'text-muted-foreground'}`}>{cfg.label}</span>
                          <span className="text-xs text-muted-foreground">{cfg.minPoints} pts</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      {summary.tier === tier && <Badge variant="default" className="text-xs">Actuel</Badge>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activité récente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {summary.recentTransactions.slice(0, 10).map(tx => {
                const label = ACTION_LABELS[tx.action]?.[lang] || tx.description;
                return (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-3">
                      {tx.points > 0 ? <ArrowUp className="h-4 w-4 text-emerald-500" /> : <ArrowDown className="h-4 w-4 text-destructive" />}
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{format(parseISO(tx.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                      </div>
                    </div>
                    <Badge variant={tx.points > 0 ? 'secondary' : 'destructive'}>{tx.points > 0 ? '+' : ''}{tx.points} pts</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      value: 'badges',
      label: t('points.tabs.badges', 'Badges'),
      icon: <Award className="h-4 w-4" />,
      badge: unlockedCount,
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold">{unlockedCount} / {totalBadges} badges débloqués</h2>
              <Progress value={(unlockedCount / Math.max(totalBadges, 1)) * 100} className="h-2 mt-1 w-48" />
            </div>
          </div>

          {BADGE_CATEGORIES.map(category => {
            const categoryBadges = badgeProgress.filter(b => b.badge.category === category);
            if (categoryBadges.length === 0) return null;
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {CATEGORY_LABELS[category]?.[lang] || category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryBadges.map(({ badge: b, progress, total, unlocked }) => (
                    <Card key={b.id} className={`transition-all ${unlocked ? 'border-primary/40 bg-primary/5' : 'opacity-70'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`text-3xl ${unlocked ? '' : 'grayscale opacity-40'}`}>{b.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold truncate">{b.name[lang] || b.name.fr}</p>
                              {unlocked && <Badge variant="default" className="text-[10px] px-1">✓</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{b.description[lang] || b.description.fr}</p>
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>{progress}/{total}</span>
                                {b.bonusPoints > 0 && <span className="text-primary">+{b.bonusPoints} pts</span>}
                              </div>
                              <Progress value={(progress / Math.max(total, 1)) * 100} className="h-1.5" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      value: 'history',
      label: t('points.tabs.history', 'Historique'),
      icon: <TrendingUp className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historique complet des transactions</CardTitle>
              <CardDescription>Page {page} / {totalPages || 1}</CardDescription>
            </CardHeader>
            <CardContent>
              {txLoading ? <LoadingSpinner size="sm" /> : (
                <div className="space-y-2">
                  {transactions.map(tx => {
                    const label = ACTION_LABELS[tx.action]?.[lang] || tx.description;
                    return (
                      <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                        <div className="flex items-center gap-3">
                          {tx.points > 0 ? <ArrowUp className="h-4 w-4 text-emerald-500" /> : <ArrowDown className="h-4 w-4 text-destructive" />}
                          <div>
                            <p className="text-sm font-medium">{label}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-[10px]">{tx.type}</Badge>
                              <span className="text-xs text-muted-foreground">{format(parseISO(tx.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={tx.points > 0 ? 'secondary' : 'destructive'} className="font-mono">
                          {tx.points > 0 ? '+' : ''}{tx.points} pts
                        </Badge>
                      </div>
                    );
                  })}
                  {transactions.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aucune transaction</p>}
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      value: 'leaderboard',
      label: t('points.tabs.leaderboard', 'Classement'),
      icon: <Trophy className="h-4 w-4" />,
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" /> Classement général</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaderboard.map((entry, idx) => {
              const entryTier = TIER_CONFIG[entry.tier] || TIER_CONFIG.bronze;
              return (
                <div key={entry.id} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold w-8 text-center">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{entry.user?.firstName || 'User'} {entry.user?.lastName || ''}</p>
                      <span className="text-xs text-muted-foreground">{entryTier.icon} {entryTier.label}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{entry.lifetimePoints.toLocaleString()} pts</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 dark:from-primary/20 dark:to-accent/10 p-6 sm:p-8 border border-border/30">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{tierCfg.icon}</div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('points.pageTitle', 'Points & Récompenses')}</h1>
            <p className="text-muted-foreground mt-1">{summary.lifetimePoints.toLocaleString()} points cumulés • {tierCfg.label} • {unlockedCount} badges</p>
          </div>
        </div>
      </div>

      <DynamicTabs tabs={tabs} defaultValue="overview" variant="underline" fullWidth />
    </div>
  );
});

PointsPage.displayName = 'PointsPage';
export default PointsPage;
