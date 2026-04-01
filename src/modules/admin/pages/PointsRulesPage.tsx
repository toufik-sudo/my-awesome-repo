import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicForm } from '@/modules/shared/components/DynamicForm';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Plus, Edit, Trash2, Star, Coins, ArrowRightLeft, Users } from 'lucide-react';
import { pointsRulesApi, type PointsRule } from '../points-rules.api';
import { ACTION_LABELS } from '@/modules/points/points.api';
import type { DynamicFormField } from '@/types/component.types';

const ROLE_LABELS: Record<string, string> = { guest: 'Voyageur (Guest)', manager: 'Manager' };
const PERIOD_LABELS: Record<string, string> = { daily: 'Quotidien', weekly: 'Hebdomadaire', monthly: 'Mensuel' };

const actionOptions = Object.keys(ACTION_LABELS).map(k => ({
  value: k,
  label: ACTION_LABELS[k]?.fr || k,
}));

export const PointsRulesPage: React.FC = () => {
  const { t } = useTranslation();
  const [rules, setRules] = useState<PointsRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PointsRule | null>(null);
  const [activeTab, setActiveTab] = useState<'earning' | 'conversion'>('earning');

  const loadRules = useCallback(async () => {
    setLoading(true);
    try {
      setRules(await pointsRulesApi.getAll());
    } catch {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRules(); }, [loadRules]);

  const earningRules = rules.filter(r => r.ruleType === 'earning');
  const conversionRules = rules.filter(r => r.ruleType === 'conversion');

  const earningFields: DynamicFormField[] = [
    { name: 'targetRole', label: 'Rôle cible', fieldType: 'select', options: [{ value: 'guest', label: 'Voyageur' }, { value: 'manager', label: 'Manager' }], required: true },
    { name: 'action', label: 'Action', fieldType: 'select', options: actionOptions, required: true },
    { name: 'pointsAmount', label: 'Points gagnés', fieldType: 'input', required: true, defaultValue: 100 },
    { name: 'multiplier', label: 'Multiplicateur', fieldType: 'input', defaultValue: 1 },
    { name: 'maxPointsPerPeriod', label: 'Max points par période (0=illimité)', fieldType: 'input', defaultValue: 0 },
    { name: 'period', label: 'Période', fieldType: 'select', options: Object.entries(PERIOD_LABELS).map(([v, l]) => ({ value: v, label: l })) },
    { name: 'description', label: 'Description', fieldType: 'textarea' },
    { name: 'isDefault', label: 'Règle par défaut', fieldType: 'checkbox' },
    { name: 'isActive', label: 'Active', fieldType: 'checkbox', defaultValue: true },
  ];

  const conversionFields: DynamicFormField[] = [
    { name: 'targetRole', label: 'Rôle cible', fieldType: 'select', options: [{ value: 'guest', label: 'Voyageur' }, { value: 'manager', label: 'Manager' }], required: true },
    { name: 'conversionRate', label: 'Taux de conversion (MAD par point)', fieldType: 'input', required: true, defaultValue: 0.10 },
    { name: 'currency', label: 'Devise', fieldType: 'input', defaultValue: 'MAD' },
    { name: 'minPointsForConversion', label: 'Minimum de points pour convertir', fieldType: 'input', defaultValue: 500 },
    { name: 'description', label: 'Description', fieldType: 'textarea' },
    { name: 'isDefault', label: 'Règle par défaut', fieldType: 'checkbox' },
    { name: 'isActive', label: 'Active', fieldType: 'checkbox', defaultValue: true },
  ];

  const handleSave = async (data: any) => {
    try {
      const payload = { ...data, ruleType: activeTab, action: activeTab === 'conversion' ? 'redeem' : data.action };
      if (editingRule) {
        await pointsRulesApi.update(editingRule.id, payload);
        toast.success('Règle mise à jour');
      } else {
        await pointsRulesApi.create(payload);
        toast.success('Règle créée');
      }
      setModalOpen(false);
      setEditingRule(null);
      loadRules();
    } catch {
      toast.error('Erreur de sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await pointsRulesApi.remove(id);
      toast.success('Règle supprimée');
      loadRules();
    } catch {
      toast.error('Erreur');
    }
  };

  const renderRuleCard = (rule: PointsRule) => (
    <Card key={rule.id} className={`${!rule.isActive ? 'opacity-50' : ''}`}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-accent/20">
            {rule.ruleType === 'earning' ? <Coins className="h-5 w-5 text-accent-foreground" /> : <ArrowRightLeft className="h-5 w-5 text-accent-foreground" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {rule.ruleType === 'earning'
                  ? `${rule.pointsAmount} pts × ${rule.multiplier || 1} — ${ACTION_LABELS[rule.action]?.fr || rule.action}`
                  : `${rule.conversionRate} MAD/pt (min ${rule.minPointsForConversion || 0} pts)`}
              </span>
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                {ROLE_LABELS[rule.targetRole]}
              </Badge>
              {rule.isDefault && <Badge variant="outline"><Star className="h-3 w-3 mr-1" />Défaut</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{rule.description}</p>
            {rule.maxPointsPerPeriod > 0 && (
              <p className="text-xs text-muted-foreground">Max: {rule.maxPointsPerPeriod} pts/{rule.period || 'période'}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <DynamicButton variant="outline" size="sm" onClick={() => { setEditingRule(rule); setActiveTab(rule.ruleType as any); setModalOpen(true); }}>
            <Edit className="h-4 w-4" />
          </DynamicButton>
          <DynamicButton variant="destructive" size="sm" onClick={() => handleDelete(rule.id)} disabled={rule.isDefault}>
            <Trash2 className="h-4 w-4" />
          </DynamicButton>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Règles de points & récompenses</h2>
          <p className="text-muted-foreground">Configurez les gains de points et les règles de conversion pour voyageurs et managers</p>
        </div>
        <DynamicButton onClick={() => { setEditingRule(null); setModalOpen(true); }} icon={<Plus className="h-4 w-4" />}>
          Nouvelle règle
        </DynamicButton>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="earning"><Coins className="h-4 w-4 mr-2" />Gains de points</TabsTrigger>
          <TabsTrigger value="conversion"><ArrowRightLeft className="h-4 w-4 mr-2" />Conversion</TabsTrigger>
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

      <DynamicModal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditingRule(null); } }}
        title={editingRule ? 'Modifier la règle' : `Nouvelle règle de ${activeTab === 'earning' ? 'gains' : 'conversion'}`}
      >
        <DynamicForm
          fields={activeTab === 'earning' ? earningFields : conversionFields}
          onSubmit={handleSave}
          submitButtonText={editingRule ? 'Mettre à jour' : 'Créer'}
        />
      </DynamicModal>
    </div>
  );
};
