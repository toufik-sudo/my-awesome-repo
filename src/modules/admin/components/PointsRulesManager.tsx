import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { pointsRulesApi, type PointsRule } from '@/modules/admin/points-rules.api';
import { PointsRuleFormDialog } from './PointsRuleFormDialog';
import { Trophy, Coins, RefreshCw, Users, Gift, Plus, Pencil, Trash2, Globe, Building2, Layers, Compass, User, CalendarDays, Target } from 'lucide-react';

const SCOPE_LABELS: Record<string, string> = {
  global: 'Global',
  host: 'Hôte',
  property_group: 'Grp propriétés',
  service_group: 'Grp services',
  property: 'Propriété',
  service: 'Service',
};

const SCOPE_ICONS: Record<string, React.ReactNode> = {
  global: <Globe className="h-3 w-3" />,
  host: <User className="h-3 w-3" />,
  property_group: <Building2 className="h-3 w-3" />,
  service_group: <Layers className="h-3 w-3" />,
  property: <Building2 className="h-3 w-3" />,
  service: <Compass className="h-3 w-3" />,
};

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

  const formatValidity = (rule: PointsRule) => {
    if (!rule.validFrom && !rule.validTo) return null;
    const from = rule.validFrom ? new Date(rule.validFrom).toLocaleDateString('fr-FR') : '∞';
    const to = rule.validTo ? new Date(rule.validTo).toLocaleDateString('fr-FR') : '∞';
    return `${from} → ${to}`;
  };

  const RuleRow = ({ rule }: { rule: PointsRule }) => (
    <div className="flex items-start justify-between p-4 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors gap-3">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
          {rule.ruleType === 'earning' ? <Coins className="h-4 w-4 text-primary" /> : <Gift className="h-4 w-4 text-accent" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold">{rule.action.replace(/_/g, ' ')}</p>
            {rule.isDefault && <Badge variant="secondary" className="text-[10px]">Défaut</Badge>}
          </div>
          {rule.description && <p className="text-xs text-muted-foreground mt-0.5">{rule.description}</p>}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <Badge variant="outline" className="text-[10px] gap-1">
              <Users className="h-3 w-3" />{rule.targetRole === 'guest' ? 'Voyageur' : 'Manager'}
            </Badge>
            <Badge variant="outline" className="text-[10px] gap-1">
              {SCOPE_ICONS[rule.scope]}{SCOPE_LABELS[rule.scope] || rule.scope}
            </Badge>
            {rule.ruleType === 'earning' && (
              <Badge variant="secondary" className="font-mono text-[10px]">+{rule.pointsAmount} pts</Badge>
            )}
            {rule.multiplier > 1 && (
              <Badge className="bg-accent text-accent-foreground text-[10px]">×{rule.multiplier}</Badge>
            )}
            {rule.ruleType === 'conversion' && rule.conversionRate && (
              <Badge variant="outline" className="text-[10px]">{rule.conversionRate} {rule.currency}/pt</Badge>
            )}
            {rule.ruleType === 'conversion' && rule.minPointsForConversion && (
              <Badge variant="outline" className="text-[10px]">Min: {rule.minPointsForConversion} pts</Badge>
            )}
            {rule.maxPointsPerPeriod > 0 && (
              <Badge variant="outline" className="text-[10px]">Max: {rule.maxPointsPerPeriod}/{rule.period || '∞'}</Badge>
            )}
            {rule.minNights && rule.minNights > 0 && (
              <Badge variant="outline" className="text-[10px]">Min {rule.minNights} nuits</Badge>
            )}
          </div>
          {formatValidity(rule) && (
            <div className="flex items-center gap-1 mt-1">
              <CalendarDays className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{formatValidity(rule)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
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
