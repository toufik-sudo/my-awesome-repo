import React, { useState, useEffect, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { serviceFeesApi, type ServiceFeeRule } from '@/modules/admin/service-fees.api';
import { useScopeEntities } from '@/modules/admin/hooks/useScopeEntities';
import { MultiScopeSelector } from '@/modules/admin/components/MultiScopeSelector';

const SCOPE_OPTIONS = [
  { value: 'global', label: 'Global (tous)' },
  { value: 'host', label: 'Par hôte (admin)' },
  { value: 'property_group', label: 'Groupe de propriétés' },
  { value: 'property', label: 'Propriété spécifique' },
  { value: 'service_group', label: 'Groupe de services' },
  { value: 'service', label: 'Service spécifique' },
];

const CALC_OPTIONS = [
  { value: 'percentage', label: 'Pourcentage', desc: 'Frais = montant × taux%' },
  { value: 'fixed', label: 'Montant fixe', desc: 'Frais = montant fixe constant' },
  { value: 'percentage_plus_fixed', label: '% + Fixe', desc: 'Frais = montant × taux% + montant fixe' },
  { value: 'fixed_then_percentage', label: 'Fixe puis %', desc: 'Fixe si ≤ seuil, sinon fixe + (excédent) × taux%, plafonné au max' },
];

const SCOPE_TARGET_KEY: Record<string, string> = {
  host: 'targetHostId',
  property_group: 'targetPropertyGroupId',
  service_group: 'targetServiceGroupId',
  property: 'targetPropertyId',
  service: 'targetServiceId',
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: ServiceFeeRule | null;
  onSuccess: () => void;
}

export const ServiceFeeFormDialog: React.FC<Props> = memo(({ open, onOpenChange, rule, onSuccess }) => {
  const isEdit = !!rule;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<ServiceFeeRule>>({});

  useEffect(() => {
    if (open) {
      setForm({
        scope: rule?.scope || 'global',
        calculationType: rule?.calculationType || 'percentage',
        percentageRate: rule?.percentageRate ?? 5,
        fixedAmount: rule?.fixedAmount ?? 0,
        fixedThreshold: rule?.fixedThreshold ?? undefined,
        minFee: rule?.minFee ?? undefined,
        maxFee: rule?.maxFee ?? undefined,
        isDefault: rule?.isDefault || false,
        isActive: rule?.isActive ?? true,
        description: rule?.description || '',
        priority: rule?.priority ?? 100,
        targetHostId: rule?.targetHostId ?? undefined,
        targetPropertyGroupId: rule?.targetPropertyGroupId ?? undefined,
        targetPropertyId: rule?.targetPropertyId ?? undefined,
        targetServiceGroupId: rule?.targetServiceGroupId ?? undefined,
        targetServiceId: rule?.targetServiceId ?? undefined,
      });
    }
  }, [open, rule]);

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const currentScope = form.scope || 'global';
  const { entities: scopeEntities, loading: entitiesLoading } = useScopeEntities(currentScope);

  const targetKey = SCOPE_TARGET_KEY[currentScope];
  const currentTargetValue = targetKey ? String(form[targetKey as keyof ServiceFeeRule] || '') : '';
  const isMultiScope = currentScope === 'property' || currentScope === 'service';
  const multiTargetIds = isMultiScope && currentTargetValue ? currentTargetValue.split(',').filter(Boolean) : [];

  const handleScopeChange = (newScope: string) => {
    setForm(f => ({
      ...f,
      scope: newScope as ServiceFeeRule['scope'],
      targetHostId: undefined,
      targetPropertyGroupId: undefined,
      targetServiceGroupId: undefined,
      targetPropertyId: undefined,
      targetServiceId: undefined,
    }));
  };

  const handleTargetChange = (value: string) => {
    if (!targetKey) return;
    update(targetKey, currentScope === 'host' ? Number(value) : value);
  };

  const handleMultiTargetChange = (ids: string[]) => {
    if (!targetKey) return;
    update(targetKey, ids.join(','));
  };

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEdit) {
        await serviceFeesApi.update(rule!.id, form);
        toast.success('Règle mise à jour');
      } else {
        await serviceFeesApi.create(form);
        toast.success('Règle créée');
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const calcDesc = CALC_OPTIONS.find(c => c.value === calcType)?.desc || '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la règle de frais' : 'Nouvelle règle de frais'}</DialogTitle>
          <DialogDescription>Configurez le type de calcul et les paramètres</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Scope + Calc Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Portée</Label>
              <Select value={currentScope} onValueChange={handleScopeChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SCOPE_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Type de calcul</Label>
              <Select value={form.calculationType} onValueChange={v => update('calculationType', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CALC_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">{calcDesc}</p>
            </div>
          </div>

          {/* Scope Target Selector */}
          {currentScope !== 'global' && (
            isMultiScope ? (
              <MultiScopeSelector
                scope={currentScope}
                selectedIds={multiTargetIds}
                onSelectionChange={handleMultiTargetChange}
                label={SCOPE_OPTIONS.find(o => o.value === currentScope)?.label || 'Cible'}
                placeholder="Sélectionner..."
              />
            ) : (
              <div>
                <Label className="text-sm">
                  {SCOPE_OPTIONS.find(o => o.value === currentScope)?.label || 'Cible'}
                </Label>
                <Select value={currentTargetValue} onValueChange={handleTargetChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={entitiesLoading ? 'Chargement...' : 'Sélectionner...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {scopeEntities.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                    ))}
                    {scopeEntities.length === 0 && !entitiesLoading && (
                      <SelectItem value="__empty" disabled>Aucun élément trouvé</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )
          )}

          {/* Rates */}
          <div className="grid grid-cols-2 gap-3">
            {showPercentage && (
              <div>
                <Label className="text-sm">Taux (%)</Label>
                <Input type="number" value={form.percentageRate ?? ''} onChange={e => update('percentageRate', Number(e.target.value))} min={0} max={100} step={0.5} />
              </div>
            )}
            {showFixed && (
              <div>
                <Label className="text-sm">Montant fixe (DA)</Label>
                <Input type="number" value={form.fixedAmount ?? ''} onChange={e => update('fixedAmount', Number(e.target.value))} min={0} />
              </div>
            )}
          </div>

          {showThreshold && (
            <div>
              <Label className="text-sm">Seuil (DA)</Label>
              <Input type="number" value={form.fixedThreshold ?? ''} onChange={e => update('fixedThreshold', Number(e.target.value) || undefined)} placeholder="Montant seuil" />
              <p className="text-xs text-muted-foreground mt-1">En dessous → frais fixe uniquement. Au-dessus → fixe + % sur le dépassement.</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-sm">Frais minimum</Label>
              <Input type="number" value={form.minFee || ''} onChange={e => update('minFee', Number(e.target.value) || undefined)} placeholder="Aucun" />
            </div>
            <div>
              <Label className="text-sm">Frais maximum</Label>
              <Input type="number" value={form.maxFee || ''} onChange={e => update('maxFee', Number(e.target.value) || undefined)} placeholder="Aucun" />
            </div>
            <div>
              <Label className="text-sm">Priorité</Label>
              <Input type="number" value={form.priority ?? 100} onChange={e => update('priority', Number(e.target.value))} min={0} />
            </div>
          </div>

          {/* Simulation */}
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-3">
              <p className="text-sm font-medium text-foreground">Simulation (montant: 10 000 DA)</p>
              <p className="text-lg font-bold text-primary mt-1">{simulateExample()} DA</p>
            </CardContent>
          </Card>

          <div>
            <Label className="text-sm">Description</Label>
            <Textarea value={form.description || ''} onChange={e => update('description', e.target.value)} rows={2} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={v => update('isActive', v)} />
              <Label className="text-sm">Actif</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isDefault} onCheckedChange={v => update('isDefault', v)} />
              <Label className="text-sm">Par défaut</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ServiceFeeFormDialog.displayName = 'ServiceFeeFormDialog';
