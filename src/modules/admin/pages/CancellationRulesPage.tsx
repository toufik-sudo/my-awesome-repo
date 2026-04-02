import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Plus, Edit, Trash2, ShieldX, Clock, AlertTriangle, Info } from 'lucide-react';
import { cancellationRulesApi, CANCELLATION_PRESETS, type CancellationRule, type CancellationPolicyType } from '../cancellation-rules.api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const SCOPE_LABELS: Record<string, string> = {
  all: 'Toutes les propriétés/services',
  property_group: 'Groupe de propriétés',
  service_group: 'Groupe de services',
  property: 'Propriété spécifique',
  service: 'Service spécifique',
};

const POLICY_LABELS: Record<string, string> = {
  flexible: 'Flexible',
  moderate: 'Modérée',
  strict: 'Stricte',
  custom: 'Personnalisée',
};

const POLICY_COLORS: Record<string, string> = {
  flexible: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  moderate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  strict: 'bg-destructive/10 text-destructive',
  custom: 'bg-primary/10 text-primary',
};

const emptyForm = (): Partial<CancellationRule> => ({
  policyType: 'flexible',
  scope: 'all',
  fullRefundHours: 24,
  partialRefundHours: 12,
  partialRefundPercent: 50,
  lateCancelPenalty: 0,
  noShowPenalty: false,
  noShowPenaltyPercent: 0,
  isActive: true,
  description: '',
});

export const CancellationRulesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rules, setRules] = useState<CancellationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<CancellationRule>>(emptyForm());

  const isHyper = useMemo(() =>
    user?.roles?.some(r => ['hyper_admin', 'hyper_manager'].includes(r)) ?? false,
    [user]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try { setRules(await cancellationRulesApi.getMine()); } catch { toast.error(t('cancellation.loadError', 'Erreur de chargement')); }
    finally { setLoading(false); }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditingId(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (r: CancellationRule) => { setEditingId(r.id); setForm({ ...r }); setModalOpen(true); };
  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const applyPreset = (type: CancellationPolicyType) => {
    if (type === 'custom') {
      updateForm('policyType', 'custom');
      return;
    }
    const preset = CANCELLATION_PRESETS[type];
    if (preset) setForm(prev => ({ ...prev, ...preset }));
  };

  const handleSave = async () => {
    try {
      if (editingId) { await cancellationRulesApi.update(editingId, form); toast.success(t('cancellation.updated', 'Règle mise à jour')); }
      else { await cancellationRulesApi.create(form); toast.success(t('cancellation.created', 'Règle créée')); }
      setModalOpen(false); load();
    } catch { toast.error(t('cancellation.saveError', 'Erreur de sauvegarde')); }
  };

  const handleDelete = async (id: string) => {
    try { await cancellationRulesApi.remove(id); toast.success(t('cancellation.deleted', 'Supprimée')); load(); }
    catch { toast.error(t('cancellation.deleteError', 'Erreur')); }
  };

  const formatHours = (hours: number) => {
    if (hours >= 24) return `${Math.round(hours / 24)}j`;
    return `${hours}h`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('cancellation.title', "Règles d'annulation")}</h2>
          <p className="text-muted-foreground">
            {isHyper
              ? t('cancellation.hyperSubtitle', 'Consultez les règles d\'annulation des hôtes. Vous pouvez supprimer une règle si nécessaire.')
              : t('cancellation.subtitle', 'Définissez les politiques de remboursement pour vos réservations')}
          </p>
        </div>
        {!isHyper && (
          <DynamicButton onClick={openCreate} icon={<Plus className="h-4 w-4" />}>{t('cancellation.newRule', 'Nouvelle règle')}</DynamicButton>
        )}
      </div>

      {/* Info card */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">{t('cancellation.howItWorks', 'Comment ça marche ?')}</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Flexible :</strong> {t('cancellation.flexibleDesc', 'Annulation gratuite 24h avant, 50% ensuite')}</li>
                <li><strong>Modérée :</strong> {t('cancellation.moderateDesc', 'Annulation gratuite 72h avant, 50% après')}</li>
                <li><strong>Stricte :</strong> {t('cancellation.strictDesc', 'Annulation gratuite 7 jours avant, 25% ensuite')}</li>
                <li><strong>Custom :</strong> {t('cancellation.customDesc', 'Définissez vos propres délais et pourcentages')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {rules.map(r => (
          <Card key={r.id} className={cn(!r.isActive && 'opacity-50')}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShieldX className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={cn('text-xs', POLICY_COLORS[r.policyType])}>{POLICY_LABELS[r.policyType]}</Badge>
                    <Badge variant="secondary">{SCOPE_LABELS[r.scope]}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Remb. total: {formatHours(r.fullRefundHours)} avant</span>
                    <span>Remb. partiel: {r.partialRefundPercent}% ({formatHours(r.partialRefundHours)} avant)</span>
                    {r.noShowPenalty && <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> No-show: {r.noShowPenaltyPercent}%</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {isHyper ? (
                  <DynamicButton variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </DynamicButton>
                ) : (
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
          <Card><CardContent className="p-8 text-center text-muted-foreground">{t('cancellation.empty', "Aucune règle d'annulation configurée")}</CardContent></Card>
        )}
      </div>

      {/* Only show modal for non-hyper users */}
      {!isHyper && (
        <DynamicModal open={modalOpen} onOpenChange={open => { if (!open) setModalOpen(false); }}
          title={editingId ? t('cancellation.editTitle', "Modifier la règle d'annulation") : t('cancellation.newTitle', "Nouvelle règle d'annulation")}>
          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
            <div className="space-y-2">
              <Label>{t('cancellation.policyType', 'Type de politique')}</Label>
              <div className="grid grid-cols-4 gap-2">
                {(['flexible', 'moderate', 'strict', 'custom'] as CancellationPolicyType[]).map(type => (
                  <Button
                    key={type}
                    variant={form.policyType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applyPreset(type)}
                    className="text-xs"
                  >
                    {POLICY_LABELS[type]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('cancellation.scope', 'Portée')}</Label>
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
              <div className="space-y-2"><Label>ID Groupe propriétés</Label><Input value={form.targetPropertyGroupId || ''} onChange={e => updateForm('targetPropertyGroupId', e.target.value)} /></div>
            )}
            {form.scope === 'service_group' && (
              <div className="space-y-2"><Label>ID Groupe services</Label><Input value={form.targetServiceGroupId || ''} onChange={e => updateForm('targetServiceGroupId', e.target.value)} /></div>
            )}
            {form.scope === 'property' && (
              <div className="space-y-2"><Label>ID Propriété</Label><Input value={form.targetPropertyId || ''} onChange={e => updateForm('targetPropertyId', e.target.value)} /></div>
            )}
            {form.scope === 'service' && (
              <div className="space-y-2"><Label>ID Service</Label><Input value={form.targetServiceId || ''} onChange={e => updateForm('targetServiceId', e.target.value)} /></div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('cancellation.fullRefundHours', 'Remboursement total (heures avant)')}</Label>
                <Input type="number" min={0} value={form.fullRefundHours ?? 24} onChange={e => updateForm('fullRefundHours', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>{t('cancellation.partialRefundHours', 'Remboursement partiel (heures avant)')}</Label>
                <Input type="number" min={0} value={form.partialRefundHours ?? 12} onChange={e => updateForm('partialRefundHours', parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('cancellation.partialRefundPercent', 'Remboursement partiel (%)')}</Label>
                <Input type="number" min={0} max={100} value={form.partialRefundPercent ?? 50} onChange={e => updateForm('partialRefundPercent', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>{t('cancellation.latePenalty', 'Pénalité annulation tardive (%)')}</Label>
                <Input type="number" min={0} max={100} value={form.lateCancelPenalty ?? 0} onChange={e => updateForm('lateCancelPenalty', parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox checked={form.noShowPenalty || false} onCheckedChange={v => updateForm('noShowPenalty', v)} />
                <Label>{t('cancellation.noShowPenalty', 'Pénalité no-show')}</Label>
              </div>
              {form.noShowPenalty && (
                <div className="space-y-2 ml-6">
                  <Label>{t('cancellation.noShowPercent', 'Pénalité no-show (%)')}</Label>
                  <Input type="number" min={0} max={100} value={form.noShowPenaltyPercent ?? 100} onChange={e => updateForm('noShowPenaltyPercent', parseInt(e.target.value) || 0)} className="w-32" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('cancellation.description', 'Description')}</Label>
              <Textarea value={form.description || ''} onChange={e => updateForm('description', e.target.value)}
                placeholder="Ex: Politique flexible pour la basse saison" />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox checked={form.isActive !== false} onCheckedChange={v => updateForm('isActive', v)} />
              <Label>{t('common.active', 'Active')}</Label>
            </div>

            <div className="flex gap-2 mt-4">
              <DynamicButton variant="primary" onClick={handleSave}>{editingId ? t('common.update', 'Mettre à jour') : t('common.create', 'Créer')}</DynamicButton>
              <DynamicButton variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel', 'Annuler')}</DynamicButton>
            </div>
          </div>
        </DynamicModal>
      )}
    </div>
  );
};