import React, { useState, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { pointsRulesApi, type PointsRule } from '@/modules/admin/points-rules.api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: PointsRule | null;
  onSuccess: () => void;
}

const ACTIONS = [
  'booking_completed', 'review_submitted', 'referral_signup', 'first_booking',
  'profile_completed', 'property_verified', 'service_created', 'five_star_review',
  'monthly_bonus', 'event_participation', 'photo_upload', 'social_share',
  'loyalty_milestone', 'points_conversion',
];

export const PointsRuleFormDialog: React.FC<Props> = memo(({ open, onOpenChange, rule, onSuccess }) => {
  const isEdit = !!rule;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<PointsRule>>({
    ruleType: rule?.ruleType || 'earning',
    targetRole: rule?.targetRole || 'guest',
    action: rule?.action || 'booking_completed',
    pointsAmount: rule?.pointsAmount || 50,
    conversionRate: rule?.conversionRate || undefined,
    currency: rule?.currency || 'DZD',
    minPointsForConversion: rule?.minPointsForConversion || undefined,
    maxPointsPerPeriod: rule?.maxPointsPerPeriod || 0,
    period: rule?.period || undefined,
    multiplier: rule?.multiplier || 1,
    isDefault: rule?.isDefault || false,
    isActive: rule?.isActive ?? true,
    description: rule?.description || '',
  });

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

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

          <div>
            <Label className="text-sm">Action</Label>
            <Select value={form.action} onValueChange={v => update('action', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACTIONS.map(a => <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

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

          {form.ruleType === 'conversion' && (
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

PointsRuleFormDialog.displayName = 'PointsRuleFormDialog';
