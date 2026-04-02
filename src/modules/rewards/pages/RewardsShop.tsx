import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardsApi, Reward, REWARD_TYPE_LABELS, REWARD_CATEGORIES } from '@/modules/rewards/rewards.api';
import { pointsApi } from '@/modules/points/points.api';
import { Gift, Star, ShoppingBag, Ticket, Crown, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

const TIER_COLORS: Record<string, string> = {
  bronze: 'text-amber-700',
  silver: 'text-gray-400',
  gold: 'text-yellow-500',
  platinum: 'text-cyan-400',
  diamond: 'text-violet-400',
};

const RewardsShop: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: rewards = [], isLoading: loadingRewards } = useQuery({
    queryKey: ['rewards-shop'],
    queryFn: rewardsApi.getShop,
  });

  const { data: pointsSummary } = useQuery({
    queryKey: ['points-summary'],
    queryFn: pointsApi.getMySummary,
  });

  const { data: myRedemptions = [] } = useQuery({
    queryKey: ['my-redemptions'],
    queryFn: rewardsApi.getMyRedemptions,
  });

  const redeemMutation = useMutation({
    mutationFn: (rewardId: string) => rewardsApi.redeem(rewardId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rewards-shop'] });
      queryClient.invalidateQueries({ queryKey: ['points-summary'] });
      queryClient.invalidateQueries({ queryKey: ['my-redemptions'] });
      Swal.fire({
        icon: 'success',
        title: 'Récompense échangée !',
        html: `<p>Votre code : <strong class="text-lg">${data.code}</strong></p><p class="text-sm text-gray-500 mt-2">Valide 90 jours</p>`,
        confirmButtonColor: 'hsl(var(--primary))',
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Erreur lors de l\'échange');
    },
  });

  const categories = useMemo(() => {
    const cats = new Set(rewards.map(r => r.category));
    return ['all', ...Array.from(cats)];
  }, [rewards]);

  const filteredRewards = useMemo(() => {
    if (activeCategory === 'all') return rewards;
    return rewards.filter(r => r.category === activeCategory);
  }, [rewards, activeCategory]);

  const handleRedeem = async (reward: Reward) => {
    const result = await Swal.fire({
      title: 'Échanger cette récompense ?',
      html: `
        <div class="text-left">
          <p class="font-semibold text-lg">${reward.icon} ${reward.name}</p>
          <p class="text-sm text-gray-500 mt-1">${reward.description || ''}</p>
          <div class="mt-3 p-3 bg-amber-50 rounded-lg">
            <p class="text-amber-800 font-medium">${reward.pointsCost} points seront déduits</p>
            ${pointsSummary ? `<p class="text-sm text-amber-600">Solde actuel : ${pointsSummary.availablePoints} pts</p>` : ''}
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Échanger',
      cancelButtonText: 'Annuler',
      confirmButtonColor: 'hsl(var(--primary))',
    });
    if (result.isConfirmed) {
      redeemMutation.mutate(reward.id);
    }
  };

  const canAfford = (cost: number) => (pointsSummary?.availablePoints || 0) >= cost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Gift className="h-8 w-8 text-primary" />
              Boutique de Récompenses
            </h1>
            <p className="text-muted-foreground mt-1">
              Échangez vos points contre des réductions, surclassements et services gratuits
            </p>
          </div>

          {pointsSummary && (
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{pointsSummary.availablePoints}</p>
                  <p className="text-xs text-muted-foreground">Points disponibles</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center">
                  <p className={`text-lg font-semibold ${TIER_COLORS[pointsSummary.tier] || ''}`}>
                    {pointsSummary.tier.charAt(0).toUpperCase() + pointsSummary.tier.slice(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">Votre niveau</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="all" className="text-sm">Tout</TabsTrigger>
            {categories.filter(c => c !== 'all').map(cat => (
              <TabsTrigger key={cat} value={cat} className="text-sm">
                {REWARD_CATEGORIES[cat]?.fr || cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            {loadingRewards ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 bg-muted rounded-xl mb-4" />
                      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredRewards.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune récompense disponible dans cette catégorie</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map(reward => {
                  const affordable = canAfford(reward.pointsCost);
                  const soldOut = reward.maxRedemptions && reward.currentRedemptions >= reward.maxRedemptions;
                  const typeLabel = REWARD_TYPE_LABELS[reward.type];

                  return (
                    <Card
                      key={reward.id}
                      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                        !affordable ? 'opacity-70' : ''
                      } ${soldOut ? 'opacity-50' : ''}`}
                    >
                      {/* Decorative gradient */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <span className="text-4xl">{reward.icon}</span>
                          <Badge variant={affordable && !soldOut ? 'default' : 'secondary'} className="text-xs">
                            {soldOut ? 'Épuisé' : `${reward.pointsCost} pts`}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mt-2">{reward.name}</CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {reward.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {typeLabel?.fr || reward.type}
                          </Badge>
                          {reward.requiredTier && (
                            <Badge variant="outline" className={`text-xs ${TIER_COLORS[reward.requiredTier] || ''}`}>
                              <Crown className="h-3 w-3 mr-1" />
                              {reward.requiredTier}+
                            </Badge>
                          )}
                          {reward.discountPercent > 0 && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              <Tag className="h-3 w-3 mr-1" />
                              -{reward.discountPercent}%
                            </Badge>
                          )}
                          {reward.discountAmount > 0 && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              -{reward.discountAmount} {reward.currency}
                            </Badge>
                          )}
                        </div>

                        {reward.maxRedemptions && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Disponibilité</span>
                              <span>{reward.maxRedemptions - reward.currentRedemptions} restants</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${Math.max(5, ((reward.maxRedemptions - reward.currentRedemptions) / reward.maxRedemptions) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="pt-3 border-t">
                        <Button
                          className="w-full group-hover:bg-primary"
                          variant={affordable && !soldOut ? 'default' : 'secondary'}
                          disabled={!affordable || !!soldOut || redeemMutation.isPending}
                          onClick={() => handleRedeem(reward)}
                        >
                          {soldOut ? 'Épuisé' : !affordable ? 'Points insuffisants' : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Échanger
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* My Redemptions */}
        {myRedemptions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Mes Échanges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRedemptions.slice(0, 6).map(redemption => (
                <Card key={redemption.id} className="bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{redemption.reward?.icon || '🎁'}</span>
                      <Badge
                        variant={
                          redemption.status === 'confirmed' ? 'default' :
                          redemption.status === 'used' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {redemption.status === 'confirmed' ? 'Actif' :
                         redemption.status === 'used' ? 'Utilisé' :
                         redemption.status === 'expired' ? 'Expiré' :
                         redemption.status === 'cancelled' ? 'Annulé' : redemption.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm">{redemption.reward?.name || 'Récompense'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Code : <span className="font-mono font-semibold text-foreground">{redemption.code}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {redemption.pointsSpent} pts • {new Date(redemption.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsShop;
