import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicForm } from '@/modules/shared/components/DynamicForm';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Percent, DollarSign, Plus, Edit, Trash2, Star } from 'lucide-react';
import { serviceFeesApi, type ServiceFeeRule } from '../service-fees.api';
import type { DynamicFormField } from '@/types/component.types';

const SCOPE_LABELS: Record<string, string> = {
  global: 'Global (toutes propriétés)',
  host: 'Par hôte (admin)',
  property_group: 'Par groupe de propriétés',
  property: 'Par propriété',
};

const CALC_LABELS: Record<string, string> = {
  percentage: 'Pourcentage',
  fixed: 'Montant fixe',
  percentage_plus_fixed: 'Pourcentage + fixe',
};

export const ServiceFeeRulesPage: React.FC = () => {
  const { t } = useTranslation();
  const [rules, setRules] = useState<ServiceFeeRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ServiceFeeRule | null>(null);

  const loadRules = useCallback(async () => {
    setLoading(true);
    try {
      setRules(await serviceFeesApi.getAll());
    } catch {
      toast.error('Erreur de chargement des règles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRules(); }, [loadRules]);

  const formFields: DynamicFormField[] = [
    { name: 'scope', label: 'Portée', fieldType: 'select', options: Object.entries(SCOPE_LABELS).map(([value, label]) => ({ value, label })), required: true },
    { name: 'calculationType', label: 'Type de calcul', fieldType: 'select', options: Object.entries(CALC_LABELS).map(([value, label]) => ({ value, label })), required: true },
    { name: 'percentageRate', label: 'Taux (%)', fieldType: 'input', defaultValue: 15 },
    { name: 'fixedAmount', label: 'Montant fixe (MAD)', fieldType: 'input', defaultValue: 0 },
    { name: 'minFee', label: 'Frais minimum', fieldType: 'input' },
    { name: 'maxFee', label: 'Frais maximum', fieldType: 'input' },
    { name: 'priority', label: 'Priorité (plus bas = plus prioritaire)', fieldType: 'input', defaultValue: 100 },
    { name: 'description', label: 'Description', fieldType: 'textarea' },
    { name: 'isDefault', label: 'Règle par défaut', fieldType: 'checkbox' },
    { name: 'isActive', label: 'Active', fieldType: 'checkbox', defaultValue: true },
  ];

  const handleSave = async (data: any) => {
    try {
      if (editingRule) {
        await serviceFeesApi.update(editingRule.id, data);
        toast.success('Règle mise à jour');
      } else {
        await serviceFeesApi.create(data);
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
      await serviceFeesApi.remove(id);
      toast.success('Règle supprimée');
      loadRules();
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Règles de frais de service</h2>
          <p className="text-muted-foreground">Gérez les frais appliqués aux hôtes par propriété, groupe ou globalement</p>
        </div>
        <DynamicButton onClick={() => { setEditingRule(null); setModalOpen(true); }} icon={<Plus className="h-4 w-4" />}>
          Nouvelle règle
        </DynamicButton>
      </div>

      <div className="grid gap-4">
        {rules.map(rule => (
          <Card key={rule.id} className={`${!rule.isActive ? 'opacity-50' : ''}`}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  {rule.calculationType === 'percentage' ? <Percent className="h-5 w-5 text-primary" /> : <DollarSign className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {rule.calculationType === 'percentage' && `${rule.percentageRate}%`}
                      {rule.calculationType === 'fixed' && `${rule.fixedAmount} MAD`}
                      {rule.calculationType === 'percentage_plus_fixed' && `${rule.percentageRate}% + ${rule.fixedAmount} MAD`}
                    </span>
                    <Badge variant={rule.isDefault ? 'default' : 'secondary'}>
                      {SCOPE_LABELS[rule.scope]}
                    </Badge>
                    {rule.isDefault && <Badge variant="outline"><Star className="h-3 w-3 mr-1" />Défaut</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                  {(rule.minFee || rule.maxFee) && (
                    <p className="text-xs text-muted-foreground">
                      {rule.minFee && `Min: ${rule.minFee} MAD`} {rule.maxFee && `Max: ${rule.maxFee} MAD`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <DynamicButton variant="outline" size="sm" onClick={() => { setEditingRule(rule); setModalOpen(true); }}>
                  <Edit className="h-4 w-4" />
                </DynamicButton>
                <DynamicButton variant="destructive" size="sm" onClick={() => handleDelete(rule.id)} disabled={rule.isDefault}>
                  <Trash2 className="h-4 w-4" />
                </DynamicButton>
              </div>
            </CardContent>
          </Card>
        ))}
        {rules.length === 0 && !loading && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Aucune règle de frais configurée</CardContent></Card>
        )}
      </div>

      <DynamicModal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditingRule(null); } }}
        title={editingRule ? 'Modifier la règle' : 'Nouvelle règle de frais'}
      >
        <DynamicForm
          fields={formFields}
          onSubmit={handleSave}
          submitButtonText={editingRule ? 'Mettre à jour' : 'Créer'}
        />
      </DynamicModal>
    </div>
  );
};
