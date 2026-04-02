import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Percent, DollarSign, Plus, Edit, Trash2, Star, Info, ArrowDown, Globe, Users, Building, Layers } from 'lucide-react';
import { serviceFeesApi, type ServiceFeeRule } from '../service-fees.api';
import { cn } from '@/lib/utils';

const SCOPE_LABELS: Record<string, string> = {
  global: 'Global (tous)',
  host: 'Par hôte (admin)',
  property_group: 'Groupe de propriétés',
  property: 'Propriété spécifique',
  service_group: 'Groupe de services',
  service: 'Service spécifique',
};

const CALC_LABELS: Record<string, string> = {
  percentage: 'Pourcentage',
  fixed: 'Montant fixe',
  percentage_plus_fixed: 'Pourcentage + fixe',
  fixed_then_percentage: 'Fixe puis pourcentage',
};

const CALC_DESCRIPTIONS: Record<string, string> = {
  percentage: 'Frais = montant × taux%',
  fixed: 'Frais = montant fixe constant',
  percentage_plus_fixed: 'Frais = montant × taux% + montant fixe',
  fixed_then_percentage: 'Frais = fixe si montant ≤ seuil, sinon fixe + (montant - seuil) × taux%, plafonné au max',
};

const emptyForm = (): Partial<ServiceFeeRule> => ({
  scope: 'global',
  calculationType: 'percentage',
  percentageRate: 15,
  fixedAmount: 0,
  fixedThreshold: undefined,
  minFee: undefined,
  maxFee: undefined,
  priority: 100,
  description: '',
  isDefault: false,
  isActive: true,
  targetHostId: undefined,
  targetPropertyGroupId: undefined,
  targetPropertyId: undefined,
  targetServiceGroupId: undefined,
  targetServiceId: undefined,
});

export const ServiceFeeRulesPage: React.FC = () => {
  const [rules, setRules] = useState<ServiceFeeRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ServiceFeeRule>>(emptyForm());

  const loadRules = useCallback(async () => {
    setLoading(true);
    try { setRules(await serviceFeesApi.getAll()); } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadRules(); }, [loadRules]);

  const openCreate = () => { setEditingId(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (rule: ServiceFeeRule) => { setEditingId(rule.id); setForm({ ...rule }); setModalOpen(true); };
  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    try {
      if (editingId) {
        await serviceFeesApi.update(editingId, form);
        toast.success('Règle mise à jour');
      } else {
        await serviceFeesApi.create(form);
        toast.success('Règle créée');
      }
      setModalOpen(false);
      loadRules();
    } catch { toast.error('Erreur de sauvegarde'); }
  };

  const formatFeeInline = (rule: ServiceFeeRule): string => {
    switch (rule.calculationType) {
      case 'percentage': return `${rule.percentageRate}%`;
      case 'fixed': return `${rule.fixedAmount} MAD`;
      case 'percentage_plus_fixed': return `${rule.percentageRate}% + ${rule.fixedAmount} MAD`;
      case 'fixed_then_percentage': return `${rule.fixedAmount} MAD (≤${rule.fixedThreshold || 0}) puis ${rule.percentageRate}%`;
      default: return '';
    }
  };

  const handleDelete = async (id: string) => {
    try { await serviceFeesApi.remove(id); toast.success('Supprimée'); loadRules(); }
    catch { toast.error('Erreur'); }
  };

  const formatFee = formatFeeInline;

  const calcType = form.calculationType || 'percentage';
  const showPercentage = calcType !== 'fixed';
  const showFixed = calcType !== 'percentage';
  const showThreshold = calcType === 'fixed_then_percentage';

  const simulateExample = () => {
    const amount = 10000;
    const rate = (form.percentageRate || 0) / 100;
    const fixed = form.fixedAmount || 0;
    const threshold = form.fixedThreshold || 0;
    let fee = 0;
    if (calcType === 'percentage') fee = amount * rate;
    else if (calcType === 'fixed') fee = fixed;
    else if (calcType === 'percentage_plus_fixed') fee = amount * rate + fixed;
    else if (calcType === 'fixed_then_percentage') {
      fee = amount <= threshold ? fixed : fixed + (amount - threshold) * rate;
    }
    if (form.minFee && fee < form.minFee) fee = form.minFee;
    if (form.maxFee && fee > form.maxFee) fee = form.maxFee;
    return Math.round(fee * 100) / 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Règles de frais de service</h2>
          <p className="text-muted-foreground">Gérez les frais par propriété, service, groupe ou globalement</p>
        </div>
        <DynamicButton onClick={openCreate} icon={<Plus className="h-4 w-4" />}>Nouvelle règle</DynamicButton>
      </div>

      {/* Priority explanation */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm text-foreground">Comment fonctionne la priorité ?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Un nombre de priorité <strong>plus bas = plus prioritaire</strong>. Quand plusieurs règles correspondent 
                (ex: une règle globale et une règle par propriété), celle avec la priorité la plus basse est appliquée.
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Badge variant="default" className="text-xs">Priorité 1</Badge>
                <ArrowDown className="h-3 w-3" />
                <Badge variant="secondary" className="text-xs">Priorité 50</Badge>
                <ArrowDown className="h-3 w-3" />
                <Badge variant="outline" className="text-xs">Priorité 100 (défaut)</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {rules.map(rule => (
          <Card key={rule.id} className={cn(!rule.isActive && 'opacity-50')}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {rule.calculationType === 'percentage' ? <Percent className="h-5 w-5 text-primary" /> : <DollarSign className="h-5 w-5 text-primary" />}
                  </div>
                  <Badge variant="outline" className="text-[10px]">P{rule.priority}</Badge>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{formatFee(rule)}</span>
                    <Badge variant={rule.scope === 'global' ? 'default' : 'secondary'}>{SCOPE_LABELS[rule.scope]}</Badge>
                    {rule.isDefault && <Badge variant="outline"><Star className="h-3 w-3 mr-1" />Défaut</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                  {(rule.minFee || rule.maxFee) && (
                    <p className="text-xs text-muted-foreground">
                      {rule.minFee ? `Min: ${rule.minFee} MAD ` : ''}{rule.maxFee ? `Max: ${rule.maxFee} MAD` : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <DynamicButton variant="outline" size="sm" onClick={() => openEdit(rule)}><Edit className="h-4 w-4" /></DynamicButton>
                <DynamicButton variant="destructive" size="sm" onClick={() => handleDelete(rule.id)} disabled={rule.isDefault}><Trash2 className="h-4 w-4" /></DynamicButton>
              </div>
            </CardContent>
          </Card>
        ))}
        {rules.length === 0 && !loading && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Aucune règle de frais configurée</CardContent></Card>
        )}
      </div>

      <DynamicModal open={modalOpen} onOpenChange={open => { if (!open) setModalOpen(false); }}
        title={editingId ? 'Modifier la règle de frais' : 'Nouvelle règle de frais'}>
        <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
          {/* Scope */}
          <div className="space-y-2">
            <Label>Portée d'application <span className="text-destructive">*</span></Label>
            <Select value={form.scope || 'global'} onValueChange={v => updateForm('scope', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(SCOPE_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.scope === 'host' && (
            <div className="space-y-2">
              <Label>ID de l'hôte</Label>
              <Input type="number" value={form.targetHostId || ''} onChange={e => updateForm('targetHostId', parseInt(e.target.value) || undefined)} />
            </div>
          )}
          {form.scope === 'property_group' && (
            <div className="space-y-2">
              <Label>ID du groupe de propriétés</Label>
              <Input value={form.targetPropertyGroupId || ''} onChange={e => updateForm('targetPropertyGroupId', e.target.value)} />
            </div>
          )}
          {form.scope === 'property' && (
            <div className="space-y-2">
              <Label>ID de la propriété</Label>
              <Input value={form.targetPropertyId || ''} onChange={e => updateForm('targetPropertyId', e.target.value)} />
            </div>
          )}
          {form.scope === 'service_group' && (
            <div className="space-y-2">
              <Label>ID du groupe de services</Label>
              <Input value={form.targetServiceGroupId || ''} onChange={e => updateForm('targetServiceGroupId', e.target.value)} />
            </div>
          )}
          {form.scope === 'service' && (
            <div className="space-y-2">
              <Label>ID du service</Label>
              <Input value={form.targetServiceId || ''} onChange={e => updateForm('targetServiceId', e.target.value)} />
            </div>
          )}

          {/* Calculation type */}
          <div className="space-y-2">
            <Label>Type de calcul <span className="text-destructive">*</span></Label>
            <Select value={calcType} onValueChange={v => updateForm('calculationType', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(CALC_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{CALC_DESCRIPTIONS[calcType]}</p>
          </div>

          {/* Conditional fields */}
          <div className="grid grid-cols-2 gap-4">
            {showPercentage && (
              <div className="space-y-2">
                <Label>Taux (%)</Label>
                <Input type="number" step="0.1" value={form.percentageRate ?? ''} onChange={e => updateForm('percentageRate', parseFloat(e.target.value) || 0)} />
              </div>
            )}
            {showFixed && (
              <div className="space-y-2">
                <Label>Montant fixe (MAD)</Label>
                <Input type="number" step="0.01" value={form.fixedAmount ?? ''} onChange={e => updateForm('fixedAmount', parseFloat(e.target.value) || 0)} />
              </div>
            )}
          </div>

          {showThreshold && (
            <div className="space-y-2">
              <Label>Seuil (MAD)</Label>
              <Input type="number" step="0.01" value={form.fixedThreshold ?? ''} onChange={e => updateForm('fixedThreshold', parseFloat(e.target.value) || 0)} />
              <p className="text-xs text-muted-foreground">En dessous de ce montant → frais fixe uniquement. Au-dessus → fixe + pourcentage sur le dépassement.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frais minimum (MAD)</Label>
              <Input type="number" step="0.01" value={form.minFee ?? ''} onChange={e => updateForm('minFee', parseFloat(e.target.value) || undefined)} />
            </div>
            <div className="space-y-2">
              <Label>Frais maximum (MAD)</Label>
              <Input type="number" step="0.01" value={form.maxFee ?? ''} onChange={e => updateForm('maxFee', parseFloat(e.target.value) || undefined)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priorité</Label>
            <Input type="number" value={form.priority ?? 100} onChange={e => updateForm('priority', parseInt(e.target.value) || 100)} />
            <p className="text-xs text-muted-foreground">Plus bas = plus prioritaire. Défaut: 100</p>
          </div>

          {/* Simulation */}
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-foreground">Simulation (montant: 10 000 MAD)</p>
              <p className="text-lg font-bold text-primary mt-1">{simulateExample()} MAD</p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description || ''} onChange={e => updateForm('description', e.target.value)} />
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Checkbox checked={form.isDefault || false} onCheckedChange={v => updateForm('isDefault', v)} />
              <Label>Règle par défaut</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={form.isActive !== false} onCheckedChange={v => updateForm('isActive', v)} />
              <Label>Active</Label>
            </div>
          </div>

          <div className="flex gap-2 mt-6 sticky bottom-0 bg-background pt-4">
            <DynamicButton variant="primary" onClick={handleSave}>{editingId ? 'Mettre à jour' : 'Créer'}</DynamicButton>
            <DynamicButton variant="outline" onClick={() => setModalOpen(false)}>Annuler</DynamicButton>
          </div>
        </div>
      </DynamicModal>
    </div>
  );
};
