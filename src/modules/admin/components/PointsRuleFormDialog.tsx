import React, { useState, useEffect, useMemo, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Calculator } from 'lucide-react';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { pointsRulesApi, type PointsRule } from '@/modules/admin/points-rules.api';
import { useScopeEntities } from '@/modules/admin/hooks/useScopeEntities';
import { MultiScopeSelector } from '@/modules/admin/components/MultiScopeSelector';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: PointsRule | null;
  onSuccess: () => void;
}

const SCOPE_OPTIONS = [
  { value: 'global', label: 'Global (tous)' },
  { value: 'host', label: 'Par hôte (admin)' },
  { value: 'property_group', label: 'Groupe de propriétés' },
  { value: 'property', label: 'Propriété spécifique' },
  { value: 'service_group', label: 'Groupe de services' },
  { value: 'service', label: 'Service spécifique' },
];

const ACTIONS = [
  'booking_completed', 'review_submitted', 'referral_signup', 'first_booking',
  'profile_completed', 'property_verified', 'service_created', 'five_star_review',
  'monthly_bonus', 'event_participation', 'photo_upload', 'social_share',
  'loyalty_milestone', 'points_conversion',
];

const SCOPE_TARGET_KEY: Record<string, string> = {
  host: 'targetHostId',
  property_group: 'targetPropertyGroupId',
  service_group: 'targetServiceGroupId',
  property: 'targetPropertyId',
  service: 'targetServiceId',
};

export const PointsRuleFormDialog: React.FC<Props> = memo(({ open, onOpenChange, rule, onSuccess }) => {
  const isEdit = !!rule;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<PointsRule>>({});
  const [simAmount, setSimAmount] = useState(1);

  useEffect(() => {
    if (open) {
      setForm({
        ruleType: rule?.ruleType || 'earning',
        targetRole: rule?.targetRole || 'guest',
        scope: rule?.scope || 'global',
        action: rule?.action || 'booking_completed',
        pointsAmount: rule?.pointsAmount || 50,
        conversionRate: rule?.conversionRate || undefined,
        currency: rule?.currency || 'DZD',
        minPointsForConversion: rule?.minPointsForConversion || undefined,
        maxPointsPerPeriod: rule?.maxPointsPerPeriod || 0,
        period: rule?.period || undefined,
        multiplier: rule?.multiplier || 1,
        validFrom: rule?.validFrom || undefined,
        validTo: rule?.validTo || undefined,
        isDefault: rule?.isDefault || false,
        isActive: rule?.isActive ?? true,
        description: rule?.description || '',
        targetHostId: rule?.targetHostId || undefined,
        targetPropertyGroupId: rule?.targetPropertyGroupId || undefined,
        targetServiceGroupId: rule?.targetServiceGroupId || undefined,
        targetPropertyId: rule?.targetPropertyId || undefined,
        targetServiceId: rule?.targetServiceId || undefined,
      });
    }
  }, [open, rule]);

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const currentScope = form.scope || 'global';
  const { entities: scopeEntities, loading: entitiesLoading } = useScopeEntities(currentScope);
  const isEarning = form.ruleType === 'earning';
  const isConversion = form.ruleType === 'conversion';
  const isMultiScope = currentScope === 'property' || currentScope === 'service';

  // Get current target value for scope (single or multi)
  const targetKey = SCOPE_TARGET_KEY[currentScope];
  const currentTargetValue = targetKey ? String(form[targetKey as keyof PointsRule] || '') : '';
  // For multi-select, parse comma-separated IDs
  const multiTargetIds = isMultiScope && currentTargetValue ? currentTargetValue.split(',').filter(Boolean) : [];

  const handleScopeChange = (newScope: string) => {
    setForm(f => ({
      ...f,
      scope: newScope as PointsRule['scope'],
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

  // Simulation
  const simulation = useMemo(() => {
    if (isEarning) {
      const pts = (form.pointsAmount || 0) * Number(form.multiplier || 1) * simAmount;
      return { label: `${simAmount} action(s)`, result: `${Math.round(pts)} pts gagnés` };
    }
    if (isConversion && form.conversionRate) {
      const pts = simAmount * 100;
      const money = pts / Number(form.conversionRate);
      return { label: `${pts} pts`, result: `= ${money.toFixed(2)} ${form.currency || 'DZD'}` };
    }
    return null;
  }, [isEarning, isConversion, form.pointsAmount, form.multiplier, form.conversionRate, form.currency, simAmount]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEdit) {
        await pointsRulesApi.update(rule!.id, form);
        toast.success('Règle mise à jour');
      } else {
        await pointsRulesApi.create(form);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la règle' : 'Nouvelle règle de points'}</DialogTitle>
          <DialogDescription>Configurez les paramètres de la règle</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type + Rôle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Type</Label>
              <Select value={form.ruleType} onValueChange={v => update('ruleType', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="earning">Gain</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Rôle cible</Label>
              <Select value={form.targetRole} onValueChange={v => update('targetRole', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scope */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Portée</Label>
              <Select value={currentScope} onValueChange={handleScopeChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SCOPE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
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
          </div>

          {/* Action */}
          <div>
            <Label className="text-sm">Action</Label>
            <Select value={form.action} onValueChange={v => update('action', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACTIONS.map(a => <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Earning-only fields */}
          {isEarning && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Points</Label>
                  <Input type="number" value={form.pointsAmount} onChange={e => update('pointsAmount', Number(e.target.value))} min={0} />
                </div>
                <div>
                  <Label className="text-sm">Multiplicateur</Label>
                  <Input type="number" value={form.multiplier} onChange={e => update('multiplier', Number(e.target.value))} min={0.1} max={10} step={0.1} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Max pts/période</Label>
                  <Input type="number" value={form.maxPointsPerPeriod} onChange={e => update('maxPointsPerPeriod', Number(e.target.value))} min={0} />
                </div>
                <div>
                  <Label className="text-sm">Période</Label>
                  <Select value={form.period || 'none'} onValueChange={v => update('period', v === 'none' ? undefined : v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Conversion-only fields */}
          {isConversion && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-sm">Taux conversion</Label>
                <Input type="number" value={form.conversionRate || ''} onChange={e => update('conversionRate', Number(e.target.value))} step={0.01} />
              </div>
              <div>
                <Label className="text-sm">Devise</Label>
                <Select value={form.currency} onValueChange={v => update('currency', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DZD">DZD</SelectItem>
                    <SelectItem value="MAD">MAD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Min pts conversion</Label>
                <Input type="number" value={form.minPointsForConversion || ''} onChange={e => update('minPointsForConversion', Number(e.target.value))} />
              </div>
            </div>
          )}

          {/* Validity Period (both types) */}
          <div>
            <Label className="text-sm">Période à appliquer</Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !form.validFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.validFrom ? format(new Date(form.validFrom), 'dd/MM/yyyy') : 'Date début'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.validFrom ? new Date(form.validFrom) : undefined}
                    onSelect={d => update('validFrom', d ? d.toISOString().split('T')[0] : undefined)}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !form.validTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.validTo ? format(new Date(form.validTo), 'dd/MM/yyyy') : 'Date fin'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.validTo ? new Date(form.validTo) : undefined}
                    onSelect={d => update('validTo', d ? d.toISOString().split('T')[0] : undefined)}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Laisser vide pour aucune restriction de temps</p>
          </div>

          {/* Simulation */}
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Simulation</p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={simAmount}
                  onChange={e => setSimAmount(Number(e.target.value) || 1)}
                  min={1}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">{isEarning ? 'action(s)' : '× 100 pts'}</span>
                {simulation && (
                  <Badge variant="secondary" className="ml-auto text-sm">{simulation.result}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <Label className="text-sm">Description</Label>
            <Textarea value={form.description || ''} onChange={e => update('description', e.target.value)} rows={2} />
          </div>

          {/* Switches */}
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

PointsRuleFormDialog.displayName = 'PointsRuleFormDialog';
