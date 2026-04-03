import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { MultiScopeSelector } from '@/modules/admin/components/MultiScopeSelector';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Plus, Edit, Trash2, CalendarIcon, Shield, Percent } from 'lucide-react';
import { hostFeeAbsorptionApi, type HostFeeAbsorption } from '../host-fee-absorption.api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const SCOPE_LABELS: Record<string, string> = {
  all: 'Toutes mes propriétés/services',
  property_group: 'Groupe de propriétés',
  service_group: 'Groupe de services',
  property: 'Propriété spécifique',
  service: 'Service spécifique',
};

const emptyForm = (): Partial<HostFeeAbsorption> => ({
  scope: 'all',
  absorptionPercent: 100,
  handToHandOnly: false,
  isActive: true,
  description: '',
  validFrom: undefined,
  validTo: undefined,
  targetPropertyGroupId: undefined,
  targetServiceGroupId: undefined,
  targetPropertyId: undefined,
  targetServiceId: undefined,
});

interface HostFeeAbsorptionPageProps {
  /** When true, only view and delete are allowed (no create/edit) — for hyper admin */
  viewOnly?: boolean;
}

export const HostFeeAbsorptionPage: React.FC<HostFeeAbsorptionPageProps> = ({ viewOnly = false }) => {
  const [rules, setRules] = useState<HostFeeAbsorption[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<HostFeeAbsorption>>(emptyForm());
  const [scopeTargetIds, setScopeTargetIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRules(await hostFeeAbsorptionApi.getMine()); } catch { toast.error('Erreur'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    if (viewOnly) return;
    setEditingId(null);
    setForm(emptyForm());
    setScopeTargetIds([]);
    setModalOpen(true);
  };

  const openEdit = (r: HostFeeAbsorption) => {
    if (viewOnly) return;
    setEditingId(r.id);
    setForm({ ...r });
    const targetId = r.targetPropertyGroupId || r.targetServiceGroupId || r.targetPropertyId || r.targetServiceId;
    setScopeTargetIds(targetId ? [targetId] : []);
    setModalOpen(true);
  };

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleScopeTargetChange = (ids: string[]) => {
    setScopeTargetIds(ids);
    const scope = form.scope || 'all';
    const firstId = ids[0] || undefined;
    if (scope === 'property_group') updateForm('targetPropertyGroupId', firstId);
    else if (scope === 'service_group') updateForm('targetServiceGroupId', firstId);
    else if (scope === 'property') updateForm('targetPropertyId', firstId);
    else if (scope === 'service') updateForm('targetServiceId', firstId);
  };

  const handleSave = async () => {
    try {
      if (editingId) { await hostFeeAbsorptionApi.update(editingId, form); toast.success('Mis à jour'); }
      else { await hostFeeAbsorptionApi.create(form); toast.success('Créé'); }
      setModalOpen(false); load();
    } catch { toast.error('Erreur'); }
  };

  const handleDelete = async (id: string) => {
    try { await hostFeeAbsorptionApi.remove(id); toast.success('Supprimé'); load(); }
    catch { toast.error('Erreur'); }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Prise en charge des frais</h2>
          <p className="text-muted-foreground">
            {viewOnly
              ? 'Consultez les règles d\'absorption de frais configurées par les hôtes.'
              : 'Définissez quels frais de service vous prenez en charge pour vos propriétés et services.'}
          </p>
        </div>
        {!viewOnly && (
          <DynamicButton onClick={openCreate} icon={<Plus className="h-4 w-4" />}>Nouvelle prise en charge</DynamicButton>
        )}
      </div>

      <div className="grid gap-4">
        {rules.map(r => (
          <Card key={r.id} className={cn(!r.isActive && 'opacity-50')}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{r.absorptionPercent}% des frais</span>
                    <Badge variant="secondary">{SCOPE_LABELS[r.scope]}</Badge>
                    {r.handToHandOnly && <Badge variant="outline" className="text-[10px]">Main à main</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    {r.validFrom && <span>Du {r.validFrom}</span>}
                    {r.validTo && <span>Au {r.validTo}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {!viewOnly && (
                  <DynamicButton variant="outline" size="sm" onClick={() => openEdit(r)}><Edit className="h-4 w-4" /></DynamicButton>
                )}
                <DynamicButton variant="destructive" size="sm" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></DynamicButton>
              </div>
            </CardContent>
          </Card>
        ))}
        {rules.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Aucune prise en charge configurée</CardContent></Card>
        )}
      </div>

      {!viewOnly && (
        <DynamicModal open={modalOpen} onOpenChange={open => { if (!open) setModalOpen(false); }}
          title={editingId ? 'Modifier la prise en charge' : 'Nouvelle prise en charge de frais'}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Portée</Label>
              <Select value={form.scope || 'all'} onValueChange={v => {
                updateForm('scope', v);
                setScopeTargetIds([]);
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SCOPE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.scope && form.scope !== 'all' && (
              <MultiScopeSelector
                scope={form.scope}
                selectedIds={scopeTargetIds}
                onSelectionChange={handleScopeTargetChange}
                label={`Sélectionner ${SCOPE_LABELS[form.scope]?.toLowerCase() || ''}`}
              />
            )}

            <div className="space-y-2">
              <Label>Pourcentage des frais pris en charge</Label>
              <div className="flex items-center gap-2">
                <Input type="number" min="0" max="100" step="1" value={form.absorptionPercent ?? 100}
                  onChange={e => updateForm('absorptionPercent', parseFloat(e.target.value) || 0)} className="w-32" />
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">100% = vous payez tous les frais. 50% = vous payez la moitié des frais.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valide à partir de (optionnel)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !form.validFrom && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.validFrom ? format(new Date(form.validFrom), 'PPP', { locale: fr }) : 'Sélectionner'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={form.validFrom ? new Date(form.validFrom) : undefined}
                      onSelect={d => updateForm('validFrom', d ? d.toISOString().split('T')[0] : undefined)}
                      className={cn('p-3 pointer-events-auto')} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Valide jusqu'au (optionnel)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !form.validTo && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.validTo ? format(new Date(form.validTo), 'PPP', { locale: fr }) : 'Sélectionner'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={form.validTo ? new Date(form.validTo) : undefined}
                      onSelect={d => updateForm('validTo', d ? d.toISOString().split('T')[0] : undefined)}
                      className={cn('p-3 pointer-events-auto')} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description || ''} onChange={e => updateForm('description', e.target.value)}
                placeholder="Ex: Prise en charge des frais pour la haute saison 2026" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox checked={form.isActive !== false} onCheckedChange={v => updateForm('isActive', v)} />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={form.handToHandOnly || false} onCheckedChange={v => updateForm('handToHandOnly', v)} />
                <Label>Main à main uniquement</Label>
              </div>
            </div>
            {form.handToHandOnly && (
              <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                Les frais seront pris en charge uniquement pour les réservations avec paiement en espèces (main à main).
              </p>
            )}

            <div className="flex gap-2 mt-4">
              <DynamicButton variant="primary" onClick={handleSave}>{editingId ? 'Mettre à jour' : 'Créer'}</DynamicButton>
              <DynamicButton variant="outline" onClick={() => setModalOpen(false)}>Annuler</DynamicButton>
            </div>
          </div>
        </DynamicModal>
      )}
    </div>
  );
};
