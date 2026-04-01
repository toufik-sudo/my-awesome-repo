import React, { useState, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { serviceFeesApi, type ServiceFeeRule } from '@/modules/admin/service-fees.api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: ServiceFeeRule | null;
  onSuccess: () => void;
}

export const ServiceFeeFormDialog: React.FC<Props> = memo(({ open, onOpenChange, rule, onSuccess }) => {
  const isEdit = !!rule;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<ServiceFeeRule>>({
    scope: rule?.scope || 'global',
    calculationType: rule?.calculationType || 'percentage',
    percentageRate: rule?.percentageRate || 5,
    fixedAmount: rule?.fixedAmount || 0,
    minFee: rule?.minFee || undefined,
    maxFee: rule?.maxFee || undefined,
    isDefault: rule?.isDefault || false,
    isActive: rule?.isActive ?? true,
    description: rule?.description || '',
    priority: rule?.priority || 100,
    targetHostId: rule?.targetHostId || undefined,
    targetPropertyGroupId: rule?.targetPropertyGroupId || undefined,
    targetPropertyId: rule?.targetPropertyId || undefined,
  });

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la règle de frais' : 'Nouvelle règle de frais'}</DialogTitle>
          <DialogDescription>Configurez le type de calcul et les paramètres</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Portée</Label>
              <Select value={form.scope} onValueChange={v => update('scope', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="host">Par hôte</SelectItem>
                  <SelectItem value="property_group">Par groupe</SelectItem>
                  <SelectItem value="property">Par propriété</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Type de calcul</Label>
              <Select value={form.calculationType} onValueChange={v => update('calculationType', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Pourcentage</SelectItem>
                  <SelectItem value="fixed">Montant fixe</SelectItem>
                  <SelectItem value="percentage_plus_fixed">% + Fixe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.scope === 'host' && (
            <div>
              <Label className="text-sm">ID Hôte</Label>
              <Input type="number" value={form.targetHostId || ''} onChange={e => update('targetHostId', Number(e.target.value) || undefined)} placeholder="ID de l'hôte" />
            </div>
          )}

          {form.scope === 'property_group' && (
            <div>
              <Label className="text-sm">ID Groupe de propriétés</Label>
              <Input value={form.targetPropertyGroupId || ''} onChange={e => update('targetPropertyGroupId', e.target.value || undefined)} placeholder="UUID du groupe" />
            </div>
          )}

          {form.scope === 'property' && (
            <div>
              <Label className="text-sm">ID Propriété</Label>
              <Input value={form.targetPropertyId || ''} onChange={e => update('targetPropertyId', e.target.value || undefined)} placeholder="UUID de la propriété" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {(form.calculationType === 'percentage' || form.calculationType === 'percentage_plus_fixed') && (
              <div>
                <Label className="text-sm">Taux (%)</Label>
                <Input type="number" value={form.percentageRate} onChange={e => update('percentageRate', Number(e.target.value))} min={0} max={100} step={0.5} />
              </div>
            )}
            {(form.calculationType === 'fixed' || form.calculationType === 'percentage_plus_fixed') && (
              <div>
                <Label className="text-sm">Montant fixe (DA)</Label>
                <Input type="number" value={form.fixedAmount} onChange={e => update('fixedAmount', Number(e.target.value))} min={0} />
              </div>
            )}
          </div>

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
              <Input type="number" value={form.priority} onChange={e => update('priority', Number(e.target.value))} min={0} />
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

ServiceFeeFormDialog.displayName = 'ServiceFeeFormDialog';
