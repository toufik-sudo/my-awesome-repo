import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Plus, Edit, Trash2, Star, Coins, ArrowRightLeft, Users, CalendarIcon, Globe, Building, Layers } from 'lucide-react';
import { pointsRulesApi, type PointsRule, POINTS_ACTIONS } from '../points-rules.api';
import { ACTION_LABELS } from '@/modules/points/points.api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ROLE_LABELS: Record<string, string> = { guest: 'Voyageur (Guest)', manager: 'Manager' };
const PERIOD_LABELS: Record<string, string> = { daily: 'Quotidien', weekly: 'Hebdomadaire', monthly: 'Mensuel' };
const SCOPE_LABELS: Record<string, string> = {
  global: 'Global (tous)',
  host: 'Par hôte (admin)',
  property_group: 'Groupe de propriétés',
  service_group: 'Groupe de services',
  property: 'Propriété spécifique',
  service: 'Service spécifique',
};

const SCOPE_ICONS: Record<string, React.ReactNode> = {
  global: <Globe className="h-3 w-3" />,
  host: <Users className="h-3 w-3" />,
  property_group: <Layers className="h-3 w-3" />,
  service_group: <Layers className="h-3 w-3" />,
  property: <Building className="h-3 w-3" />,
  service: <Building className="h-3 w-3" />,
};

const actionOptions = Object.keys(ACTION_LABELS).map(k => ({
  value: k,
  label: ACTION_LABELS[k]?.fr || k,
}));

const emptyForm = (): Partial<PointsRule> => ({
  ruleType: 'earning',
  targetRole: 'guest',
  scope: 'global',
  action: 'booking_completed',
  pointsAmount: 100,
  multiplier: 1,
  maxPointsPerPeriod: 0,
  period: '',
  minNights: undefined,
  conversionRate: 0.10,
  currency: 'MAD',
  minPointsForConversion: 500,
  validFrom: undefined,
  validTo: undefined,
  isDefault: false,
  isActive: true,
  description: '',
  targetHostId: undefined,
  targetPropertyGroupId: undefined,
  targetServiceGroupId: undefined,
  targetPropertyId: undefined,
  targetServiceId: undefined,
});

export const PointsRulesPage: React.FC = () => {
  const [rules, setRules] = useState<PointsRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'earning' | 'conversion'>('earning');
  const [form, setForm] = useState<Partial<PointsRule>>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadRules = useCallback(async () => {
    setLoading(true);
    try { setRules(await pointsRulesApi.getAll()); } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadRules(); }, [loadRules]);

  const earningRules = rules.filter(r => r.ruleType === 'earning');
  const conversionRules = rules.filter(r => r.ruleType === 'conversion');

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm(), ruleType: activeTab });
    setModalOpen(true);
  };

  const openEdit = (rule: PointsRule) => {
    setEditingId(rule.id);
    setActiveTab(rule.ruleType as 'earning' | 'conversion');
    setForm({
      ...rule,
      validFrom: rule.validFrom || undefined,
      validTo: rule.validTo || undefined,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, ruleType: activeTab };
      if (activeTab === 'conversion') payload.action = 'redeem';
      if (editingId) {
        await pointsRulesApi.update(editingId, payload);
        toast.success('Règle mise à jour');
      } else {
        await pointsRulesApi.create(payload);
        toast.success('Règle créée');
      }
      setModalOpen(false);
      loadRules();
    } catch { toast.error('Erreur de sauvegarde'); }
  };

  const handleDelete = async (id: string) => {
    try { await pointsRulesApi.remove(id); toast.success('Supprimée'); loadRules(); }
    catch { toast.error('Erreur'); }
  };

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const renderScopeFields = () => (
    <>
      <div className="space-y-2">
        <Label>Portée d'application</Label>
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
          <Label>ID de l'hôte (admin)</Label>
          <Input type="number" value={form.targetHostId || ''} onChange={e => updateForm('targetHostId', parseInt(e.target.value) || undefined)} placeholder="User ID de l'hôte" />
        </div>
      )}
      {form.scope === 'property_group' && (
        <div className="space-y-2">
          <Label>ID du groupe de propriétés</Label>
          <Input value={form.targetPropertyGroupId || ''} onChange={e => updateForm('targetPropertyGroupId', e.target.value)} placeholder="UUID du groupe" />
        </div>
      )}
      {form.scope === 'service_group' && (
        <div className="space-y-2">
          <Label>ID du groupe de services</Label>
          <Input value={form.targetServiceGroupId || ''} onChange={e => updateForm('targetServiceGroupId', e.target.value)} placeholder="UUID du groupe" />
        </div>
      )}
      {form.scope === 'property' && (
        <div className="space-y-2">
          <Label>ID de la propriété</Label>
          <Input value={form.targetPropertyId || ''} onChange={e => updateForm('targetPropertyId', e.target.value)} placeholder="UUID de la propriété" />
        </div>
      )}
      {form.scope === 'service' && (
        <div className="space-y-2">
          <Label>ID du service</Label>
          <Input value={form.targetServiceId || ''} onChange={e => updateForm('targetServiceId', e.target.value)} placeholder="UUID du service" />
        </div>
      )}
    </>
  );

  const renderDateRange = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Valide à partir de</Label>
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
        <Label>Valide jusqu'au</Label>
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
  );

  const renderEarningForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Rôle cible <span className="text-destructive">*</span></Label>
          <Select value={form.targetRole || 'guest'} onValueChange={v => updateForm('targetRole', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="guest">Voyageur</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Action <span className="text-destructive">*</span></Label>
          <Select value={form.action || ''} onValueChange={v => updateForm('action', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {actionOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {renderScopeFields()}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Points gagnés <span className="text-destructive">*</span></Label>
          <Input type="number" value={form.pointsAmount ?? ''} onChange={e => updateForm('pointsAmount', parseInt(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label>Multiplicateur</Label>
          <Input type="number" step="0.1" value={form.multiplier ?? 1} onChange={e => updateForm('multiplier', parseFloat(e.target.value) || 1)} />
          <p className="text-xs text-muted-foreground">×1 = normal, ×2 = double points (événements spéciaux)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Max points par période (0=illimité)</Label>
          <Input type="number" value={form.maxPointsPerPeriod ?? 0} onChange={e => updateForm('maxPointsPerPeriod', parseInt(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label>Période</Label>
          <Select value={form.period || ''} onValueChange={v => updateForm('period', v)}>
            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {Object.entries(PERIOD_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Nuits minimum (optionnel, pour booking)</Label>
        <Input type="number" value={form.minNights ?? ''} onChange={e => updateForm('minNights', parseInt(e.target.value) || undefined)} placeholder="Ex: 3" />
      </div>

      {renderDateRange()}

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={form.description || ''} onChange={e => updateForm('description', e.target.value)} placeholder="Description de la règle..." />
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
    </div>
  );

  const renderConversionForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Rôle cible <span className="text-destructive">*</span></Label>
        <Select value={form.targetRole || 'guest'} onValueChange={v => updateForm('targetRole', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="guest">Voyageur</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderScopeFields()}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Taux de conversion <span className="text-destructive">*</span></Label>
          <Input type="number" step="0.01" value={form.conversionRate ?? ''} onChange={e => updateForm('conversionRate', parseFloat(e.target.value) || 0)} />
          <p className="text-xs text-muted-foreground">Valeur en devise par point (ex: 0.10 = 1pt → 0.10 MAD)</p>
        </div>
        <div className="space-y-2">
          <Label>Devise</Label>
          <Input value={form.currency || 'MAD'} onChange={e => updateForm('currency', e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Minimum de points pour convertir <span className="text-destructive">*</span></Label>
        <Input type="number" value={form.minPointsForConversion ?? 500} onChange={e => updateForm('minPointsForConversion', parseInt(e.target.value) || 0)} />
      </div>

      {/* Preview */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-foreground">Aperçu de conversion</p>
          <p className="text-muted-foreground text-sm mt-1">
            {form.minPointsForConversion || 500} points = {((form.minPointsForConversion || 500) * (form.conversionRate || 0.10)).toFixed(2)} {form.currency || 'MAD'}
          </p>
          <p className="text-muted-foreground text-sm">
            1000 points = {(1000 * (form.conversionRate || 0.10)).toFixed(2)} {form.currency || 'MAD'}
          </p>
        </CardContent>
      </Card>

      {renderDateRange()}

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
    </div>
  );

  const renderRuleCard = (rule: PointsRule) => (
    <Card key={rule.id} className={cn(!rule.isActive && 'opacity-50')}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-accent/20">
            {rule.ruleType === 'earning' ? <Coins className="h-5 w-5 text-accent-foreground" /> : <ArrowRightLeft className="h-5 w-5 text-accent-foreground" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">
                {rule.ruleType === 'earning'
                  ? `${rule.pointsAmount} pts × ${rule.multiplier || 1} — ${ACTION_LABELS[rule.action]?.fr || rule.action}`
                  : `${rule.conversionRate} ${rule.currency}/pt (min ${rule.minPointsForConversion || 0} pts)`}
              </span>
              <Badge variant="secondary"><Users className="h-3 w-3 mr-1" />{ROLE_LABELS[rule.targetRole]}</Badge>
              <Badge variant="outline">{SCOPE_ICONS[rule.scope || 'global']} <span className="ml-1">{SCOPE_LABELS[rule.scope || 'global']}</span></Badge>
              {rule.isDefault && <Badge variant="outline"><Star className="h-3 w-3 mr-1" />Défaut</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{rule.description}</p>
            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
              {rule.maxPointsPerPeriod > 0 && <span>Max: {rule.maxPointsPerPeriod} pts/{rule.period || 'période'}</span>}
              {rule.validFrom && <span>Du {rule.validFrom}</span>}
              {rule.validTo && <span>Au {rule.validTo}</span>}
              {rule.minNights && <span>Min {rule.minNights} nuits</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <DynamicButton variant="outline" size="sm" onClick={() => openEdit(rule)}><Edit className="h-4 w-4" /></DynamicButton>
          <DynamicButton variant="destructive" size="sm" onClick={() => handleDelete(rule.id)} disabled={rule.isDefault}><Trash2 className="h-4 w-4" /></DynamicButton>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Règles de points & récompenses</h2>
          <p className="text-muted-foreground">Configurez les gains de points et les règles de conversion avec portée d'application</p>
        </div>
        <DynamicButton onClick={openCreate} icon={<Plus className="h-4 w-4" />}>Nouvelle règle</DynamicButton>
      </div>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="earning"><Coins className="h-4 w-4 mr-2" />Gains ({earningRules.length})</TabsTrigger>
          <TabsTrigger value="conversion"><ArrowRightLeft className="h-4 w-4 mr-2" />Conversion ({conversionRules.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="earning" className="space-y-4 mt-4">
          {earningRules.map(renderRuleCard)}
          {earningRules.length === 0 && !loading && (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Aucune règle de gains configurée</CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="conversion" className="space-y-4 mt-4">
          {conversionRules.map(renderRuleCard)}
          {conversionRules.length === 0 && !loading && (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Aucune règle de conversion configurée</CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <DynamicModal open={modalOpen} onOpenChange={open => { if (!open) setModalOpen(false); }}
        title={editingId ? 'Modifier la règle' : `Nouvelle règle de ${activeTab === 'earning' ? 'gains' : 'conversion'}`}>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          {activeTab === 'earning' ? renderEarningForm() : renderConversionForm()}
          <div className="flex gap-2 mt-6 sticky bottom-0 bg-background pt-4">
            <DynamicButton variant="primary" onClick={handleSave}>{editingId ? 'Mettre à jour' : 'Créer'}</DynamicButton>
            <DynamicButton variant="outline" onClick={() => setModalOpen(false)}>Annuler</DynamicButton>
          </div>
        </div>
      </DynamicModal>
    </div>
  );
};
