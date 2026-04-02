import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Plus, Edit, Trash2, CalendarIcon, Shield, Percent, Eye } from 'lucide-react';
import { hostFeeAbsorptionApi, type HostFeeAbsorption } from '../host-fee-absorption.api';
import { useAuth } from '@/contexts/AuthContext';
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

export const HostFeeAbsorptionPage: React.FC = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<HostFeeAbsorption[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<HostFeeAbsorption>>(emptyForm());

  const isHyper = useMemo(() =>
    user?.roles?.some(r => ['hyper_admin', 'hyper_manager'].includes(r)) ?? false,
    [user]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try { setRules(await hostFeeAbsorptionApi.getMine()); } catch { toast.error('Erreur'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditingId(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (r: HostFeeAbsorption) => { setEditingId(r.id); setForm({ ...r }); setModalOpen(true); };
  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Prise en charge des frais</h2>
          <p className="text-muted-foreground">
            {isHyper
              ? 'Consultez les règles de prise en charge des frais des hôtes. Vous pouvez supprimer une règle si nécessaire.'
              : 'Définissez quels frais de service vous prenez en charge pour vos propriétés et services.'}
          </p>
        </div>
        {!isHyper && (
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
                {isHyper ? (
                  /* Hyper admin: only view + delete */
                  <DynamicButton variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </DynamicButton>
                ) : (
                  /* Admin/Manager: full CRUD */
                  <>
                    <DynamicButton variant="outline" size="sm" onClick={() => openEdit(r)}><Edit className="h-4 w-4" /></DynamicButton>
                    <DynamicButton variant="destructive" size="sm" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></DynamicButton>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {rules.length === 0 && !loading && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Aucune prise en charge configurée</CardContent></Card>
        )}
      </div>

      {/* Only show modal for non-hyper users */}
      {!isHyper && (
        <DynamicModal open={modalOpen} onOpenChange={open => { if (!open) setModalOpen(false); }}
          title={editingId ? 'Modifier la prise en charge' : 'Nouvelle prise en charge de frais'}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Portée</Label>
              <Select value={form.scope || 'all'} onValueChange={v => updateForm('scope', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SCOPE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.scope === 'property_group' && (
              <div className="space-y-2">
                <Label>ID du groupe de propriétés</Label>
                <Input value={form.targetPropertyGroupId || ''} onChange={e => updateForm('targetPropertyGroupId', e.target.value)} />
              </div>
            )}
            {form.scope === 'service_group' && (
              <div className="space-y-2">
                <Label>ID du groupe de services</Label>
                <Input value={form.targetServiceGroupId || ''} onChange={e => updateForm('targetServiceGroupId', e.target.value)} />
              </div>
            )}
            {form.scope === 'property' && (
              <div className="space-y-2">
                <Label>ID de la propriété</Label>
                <Input value={form.targetPropertyId || ''} onChange={e => updateForm('targetPropertyId', e.target.value)} />
              </div>
            )}
            {form.scope === 'service' && (
              <div className="space-y-2">
                <Label>ID du service</Label>
                <Input value={form.targetServiceId || ''} onChange={e => updateForm('targetServiceId', e.target.value)} />
              </div>
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
                Le guest verra « Frais pris en charge par l'hôte ».
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