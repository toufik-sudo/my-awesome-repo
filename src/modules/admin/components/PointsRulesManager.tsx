import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { pointsRulesApi, type PointsRule } from '@/modules/admin/points-rules.api';
import { PointsRuleFormDialog } from './PointsRuleFormDialog';
import { Trophy, Coins, RefreshCw, Users, Gift, Plus, Pencil, Trash2 } from 'lucide-react';

export const PointsRulesManager: React.FC = memo(() => {
  const [rules, setRules] = useState<PointsRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PointsRule | null>(null);

  const loadRules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pointsRulesApi.getAll();
      setRules(data);
    } catch {
      toast.error('Erreur chargement des règles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRules(); }, [loadRules]);

  const handleToggle = useCallback(async (rule: PointsRule) => {
    try {
      await pointsRulesApi.update(rule.id, { isActive: !rule.isActive });
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: !r.isActive } : r));
      toast.success(`Règle ${!rule.isActive ? 'activée' : 'désactivée'}`);
    } catch {
      toast.error('Erreur de mise à jour');
    }
  }, []);

  const handleDelete = useCallback(async (ruleId: string) => {
    const confirmed = await toast.confirm('Supprimer cette règle ?');
    if (!confirmed) return;
    try {
      await pointsRulesApi.remove(ruleId);
      setRules(prev => prev.filter(r => r.id !== ruleId));
      toast.success('Règle supprimée');
    } catch {
      toast.error('Erreur de suppression');
    }
  }, []);

  const handleEdit = useCallback((rule: PointsRule) => {
    setEditingRule(rule);
    setDialogOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingRule(null);
    setDialogOpen(true);
  }, []);

  if (loading) return <LoadingSpinner size="sm" />;

  const earningRules = rules.filter(r => r.ruleType === 'earning');
  const conversionRules = rules.filter(r => r.ruleType === 'conversion');

  const RuleRow = ({ rule }: { rule: PointsRule }) => (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          {rule.ruleType === 'earning' ? <Coins className="h-4 w-4 text-primary" /> : <Gift className="h-4 w-4 text-accent" />}
        </div>
        <div>
          <p className="text-sm font-medium">{rule.action.replace(/_/g, ' ')}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className="text-[10px]"><Users className="h-3 w-3 mr-1" />{rule.targetRole}</Badge>
            {rule.description && <span className="text-xs text-muted-foreground">{rule.description}</span>}
            {rule.isDefault && <Badge variant="secondary" className="text-[10px]">Défaut</Badge>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {rule.ruleType === 'earning' && (
          <Badge variant="secondary" className="font-mono">+{rule.pointsAmount} pts</Badge>
        )}
        {rule.multiplier > 1 && (
          <Badge className="bg-accent text-accent-foreground text-[10px]">×{rule.multiplier}</Badge>
        )}
        {rule.ruleType === 'conversion' && rule.conversionRate && (
          <span className="text-xs text-muted-foreground">{rule.conversionRate} {rule.currency}/pt</span>
        )}
        {rule.maxPointsPerPeriod > 0 && (
          <span className="text-[10px] text-muted-foreground">Max: {rule.maxPointsPerPeriod}/{rule.period}</span>
        )}
        <Switch checked={rule.isActive} onCheckedChange={() => handleToggle(rule)} />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(rule)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(rule.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" /> Règles de gain de points</CardTitle>
              <CardDescription>{earningRules.length} règles configurées</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadRules}><RefreshCw className="h-4 w-4 mr-1" /> Rafraîchir</Button>
              <Button size="sm" onClick={handleCreate} className="gap-1"><Plus className="h-4 w-4" /> Ajouter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {earningRules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune règle de gain</p>
          ) : (
            <div className="space-y-3">{earningRules.map(rule => <RuleRow key={rule.id} rule={rule} />)}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5 text-accent" /> Règles de conversion</CardTitle>
          <CardDescription>{conversionRules.length} règles de conversion configurées</CardDescription>
        </CardHeader>
        <CardContent>
          {conversionRules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune règle de conversion</p>
          ) : (
            <div className="space-y-3">{conversionRules.map(rule => <RuleRow key={rule.id} rule={rule} />)}</div>
          )}
        </CardContent>
      </Card>

      <PointsRuleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rule={editingRule}
        onSuccess={loadRules}
      />
    </div>
  );
});

PointsRulesManager.displayName = 'PointsRulesManager';
