import React, { useState, useCallback, memo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { rewardsApi, REWARD_TYPE_LABELS, REWARD_CATEGORIES, type Reward, type RewardRedemption } from '@/modules/rewards/rewards.api';
import { RewardFormDialog } from './RewardFormDialog';
import { Gift, Plus, Edit2, Trash2, Eye, Users, TrendingUp, ShoppingBag } from 'lucide-react';

export const RewardsManager: React.FC = memo(() => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const lang = (i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : 'en') as 'fr' | 'en' | 'ar';

  const [formOpen, setFormOpen] = useState(false);
  const [editReward, setEditReward] = useState<Reward | null>(null);
  const [redemptionsOpen, setRedemptionsOpen] = useState(false);

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ['admin-rewards'],
    queryFn: rewardsApi.getAll,
  });

  const { data: redemptions = [], isLoading: redemptionsLoading } = useQuery({
    queryKey: ['admin-redemptions'],
    queryFn: rewardsApi.getAllRedemptions,
    enabled: redemptionsOpen,
  });

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
  }, [queryClient]);

  const handleEdit = useCallback((reward: Reward) => {
    setEditReward(reward);
    setFormOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditReward(null);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await rewardsApi.remove(id);
      toast.success(t('rewards.deleted', 'Récompense supprimée'));
      handleRefresh();
    } catch {
      toast.error(t('rewards.deleteError', 'Erreur lors de la suppression'));
    }
  }, [handleRefresh, t]);

  const handleToggleStatus = useCallback(async (reward: Reward) => {
    try {
      const newStatus = reward.status === 'active' ? 'paused' : 'active';
      await rewardsApi.update(reward.id, { status: newStatus });
      handleRefresh();
    } catch {
      toast.error(t('common.error'));
    }
  }, [handleRefresh, t]);

  const statusVariant = (s: string) => {
    if (s === 'active') return 'default';
    if (s === 'paused') return 'secondary';
    if (s === 'expired') return 'outline';
    return 'destructive';
  };

  // Stats
  const activeCount = rewards.filter(r => r.status === 'active').length;
  const totalRedemptions = rewards.reduce((acc, r) => acc + r.currentRedemptions, 0);
  const totalPointsSpent = rewards.reduce((acc, r) => acc + r.currentRedemptions * r.pointsCost, 0);

  if (isLoading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Gift className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{rewards.length}</p>
              <p className="text-xs text-muted-foreground">{t('rewards.totalRewards', 'Total récompenses')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10"><ShoppingBag className="h-5 w-5 text-secondary-foreground" /></div>
            <div>
              <p className="text-2xl font-bold">{totalRedemptions}</p>
              <p className="text-xs text-muted-foreground">{t('rewards.totalRedemptions', 'Échanges totaux')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10"><TrendingUp className="h-5 w-5 text-accent-foreground" /></div>
            <div>
              <p className="text-2xl font-bold">{totalPointsSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{t('rewards.pointsSpent', 'Points dépensés')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" /> {t('rewards.manageTitle', 'Catalogue des récompenses')}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setRedemptionsOpen(true)}>
            <Users className="h-4 w-4 mr-1.5" /> {t('rewards.viewRedemptions', 'Voir les échanges')}
          </Button>
          <Button size="sm" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1.5" /> {t('rewards.create', 'Nouvelle récompense')}
          </Button>
        </div>
      </div>

      {/* Rewards Grid */}
      {rewards.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            {t('rewards.empty', 'Aucune récompense configurée')}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map(reward => {
            const typeInfo = REWARD_TYPE_LABELS[reward.type];
            const catInfo = REWARD_CATEGORIES[reward.category];
            return (
              <Card key={reward.id} className="relative group hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <CardTitle className="text-sm font-semibold">{reward.name}</CardTitle>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className="text-[10px]">{typeInfo?.icon} {typeInfo?.[lang] || reward.type}</Badge>
                          <Badge variant="secondary" className="text-[10px]">{catInfo?.[lang] || reward.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge variant={statusVariant(reward.status)} className="text-[10px]">{reward.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reward.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{reward.description}</p>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">{t('rewards.cost', 'Coût')}: </span>
                      <span className="font-semibold text-primary">{reward.pointsCost} pts</span>
                    </div>
                    {reward.discountPercent > 0 && (
                      <div>
                        <span className="text-muted-foreground">{t('rewards.discount', 'Remise')}: </span>
                        <span className="font-semibold">{reward.discountPercent}%</span>
                      </div>
                    )}
                    {reward.discountAmount > 0 && (
                      <div>
                        <span className="text-muted-foreground">{t('rewards.amount', 'Montant')}: </span>
                        <span className="font-semibold">{reward.discountAmount} {reward.currency}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">{t('rewards.redeemed', 'Échangés')}: </span>
                      <span className="font-semibold">{reward.currentRedemptions}{reward.maxRedemptions ? `/${reward.maxRedemptions}` : ''}</span>
                    </div>
                    {reward.requiredTier && (
                      <div>
                        <span className="text-muted-foreground">{t('rewards.tier', 'Tier')}: </span>
                        <Badge variant="outline" className="text-[10px]">{reward.requiredTier}</Badge>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Switch
                      checked={reward.status === 'active'}
                      onCheckedChange={() => handleToggleStatus(reward)}
                    />
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(reward)}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(reward.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reward Form Dialog */}
      <RewardFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        reward={editReward}
        onSuccess={handleRefresh}
      />

      {/* Redemptions Modal */}
      <DynamicModal
        open={redemptionsOpen}
        onOpenChange={setRedemptionsOpen}
        title={t('rewards.redemptionsTitle', 'Historique des échanges')}
        size="lg"
      >
        {redemptionsLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-2">
              {redemptions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t('rewards.noRedemptions', 'Aucun échange')}</p>
              ) : redemptions.map((rd: RewardRedemption) => (
                <div key={rd.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{rd.reward?.icon || '🎁'}</span>
                    <div>
                      <p className="text-sm font-medium">{rd.reward?.name || 'Reward'}</p>
                      <p className="text-xs text-muted-foreground">Code: {rd.code} · {rd.pointsSpent} pts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={rd.status === 'used' ? 'default' : rd.status === 'confirmed' ? 'secondary' : 'outline'} className="text-[10px]">{rd.status}</Badge>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(rd.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DynamicModal>
    </div>
  );
});

RewardsManager.displayName = 'RewardsManager';
