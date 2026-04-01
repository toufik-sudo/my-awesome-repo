import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { serviceFeesApi, type ServiceFeeRule } from '@/modules/admin/service-fees.api';
import { ServiceFeeFormDialog } from './ServiceFeeFormDialog';
import { FeeSimulator } from './FeeSimulator';
import { DollarSign, RefreshCw, Globe, User, Building2, Plus, Pencil, Trash2 } from 'lucide-react';

const SCOPE_ICONS: Record<string, React.ReactNode> = {
  global: <Globe className="h-4 w-4 text-primary" />,
  host: <User className="h-4 w-4 text-secondary-foreground" />,
  property_group: <Building2 className="h-4 w-4 text-accent" />,
  property: <Building2 className="h-4 w-4 text-muted-foreground" />,
};

export const ServiceFeesManager: React.FC = memo(() => {
  const [rules, setRules] = useState<ServiceFeeRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ServiceFeeRule | null>(null);

  const loadRules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceFeesApi.getAll();
      setRules(data);
    } catch {
      toast.error('Erreur chargement des frais');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRules(); }, [loadRules]);

  const handleToggle = useCallback(async (rule: ServiceFeeRule) => {
    try {
      await serviceFeesApi.update(rule.id, { isActive: !rule.isActive });
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: !r.isActive } : r));
      toast.success(`Règle ${!rule.isActive ? 'activée' : 'désactivée'}`);
    } catch {
      toast.error('Erreur de mise à jour');
    }
  }, []);

  const handleDelete = useCallback(async (ruleId: string) => {
    const confirmed = await toast.confirm('Supprimer cette règle de frais ?');
    if (!confirmed) return;
    try {
      await serviceFeesApi.remove(ruleId);
      setRules(prev => prev.filter(r => r.id !== ruleId));
      toast.success('Règle supprimée');
    } catch {
      toast.error('Erreur de suppression');
    }
  }, []);

  const handleEdit = useCallback((rule: ServiceFeeRule) => {
    setEditingRule(rule);
    setDialogOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingRule(null);
    setDialogOpen(true);
  }, []);

  if (loading) return <LoadingSpinner size="sm" />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" /> Règles de frais de service</CardTitle>
              <CardDescription>{rules.length} règles configurées</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadRules}><RefreshCw className="h-4 w-4 mr-1" /> Rafraîchir</Button>
              <Button size="sm" onClick={handleCreate} className="gap-1"><Plus className="h-4 w-4" /> Ajouter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune règle de frais</p>
          ) : (
            <div className="space-y-3">
              {rules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {SCOPE_ICONS[rule.scope] || <DollarSign className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{rule.description || `Frais ${rule.scope}`}</p>
                        {rule.isDefault && <Badge variant="secondary" className="text-[10px]">Défaut</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{rule.scope}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {rule.calculationType === 'percentage' && `${rule.percentageRate}%`}
                          {rule.calculationType === 'fixed' && `${rule.fixedAmount} DA fixe`}
                          {rule.calculationType === 'percentage_plus_fixed' && `${rule.percentageRate}% + ${rule.fixedAmount} DA`}
                        </span>
                        <span className="text-xs text-muted-foreground">Priorité: {rule.priority}</span>
                        {rule.minFee != null && <span className="text-[10px] text-muted-foreground">Min: {rule.minFee} DA</span>}
                        {rule.maxFee != null && <span className="text-[10px] text-muted-foreground">Max: {rule.maxFee} DA</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={rule.isActive} onCheckedChange={() => handleToggle(rule)} />
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(rule)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(rule.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FeeSimulator />

      <ServiceFeeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rule={editingRule}
        onSuccess={loadRules}
      />
    </div>
  );
});

ServiceFeesManager.displayName = 'ServiceFeesManager';
