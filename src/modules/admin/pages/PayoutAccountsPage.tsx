import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Plus, Edit, Trash2, CreditCard, Building2, Banknote } from 'lucide-react';
import { payoutAccountsApi, type PayoutAccount } from '../payout-accounts.api';
import { useAuth } from '@/contexts/AuthContext';

const ACCOUNT_TYPES = [
  { value: 'ccp', label: 'CCP' },
  { value: 'bna', label: 'BNA' },
  { value: 'badr', label: 'BADR' },
  { value: 'cib', label: 'CIB' },
  { value: 'baridi_mob', label: 'BaridiMob' },
  { value: 'bank_transfer', label: 'Virement bancaire' },
  { value: 'other', label: 'Autre' },
];

const emptyForm = (): Partial<PayoutAccount> => ({
  accountType: 'ccp',
  bankName: '',
  accountNumber: '',
  accountKey: '',
  holderName: '',
  agencyName: '',
  rib: '',
  isActive: true,
  sortOrder: 0,
});

export const PayoutAccountsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<PayoutAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PayoutAccount>>(emptyForm());

  const isHyper = useMemo(() =>
    ['hyper_admin', 'hyper_manager'].includes(user?.role || ''),
    [user]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAccounts(isHyper ? await payoutAccountsApi.getAll() : await payoutAccountsApi.getMine());
    } catch { toast.error(t('payoutAccounts.loadError', 'Erreur de chargement')); }
    finally { setLoading(false); }
  }, [isHyper, t]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditingId(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (a: PayoutAccount) => { setEditingId(a.id); setForm({ ...a }); setModalOpen(true); };
  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    try {
      if (editingId) { await payoutAccountsApi.update(editingId, form); toast.success(t('payoutAccounts.updated', 'Mis à jour')); }
      else { await payoutAccountsApi.create(form); toast.success(t('payoutAccounts.created', 'Compte ajouté')); }
      setModalOpen(false); load();
    } catch { toast.error(t('payoutAccounts.saveError', 'Erreur')); }
  };

  const handleDelete = async (id: string) => {
    try { await payoutAccountsApi.remove(id); toast.success(t('payoutAccounts.deleted', 'Supprimé')); load(); }
    catch { toast.error(t('payoutAccounts.deleteError', 'Erreur')); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('payoutAccounts.title', 'Comptes de versement')}</h2>
          <p className="text-muted-foreground">
            {isHyper
              ? t('payoutAccounts.hyperSubtitle', 'Consultez les comptes de versement des hôtes pour effectuer les paiements.')
              : t('payoutAccounts.subtitle', 'Ajoutez vos comptes bancaires pour recevoir les versements de la plateforme.')}
          </p>
        </div>
        {!isHyper && (
          <DynamicButton onClick={openCreate} icon={<Plus className="h-4 w-4" />}>
            {t('payoutAccounts.addAccount', 'Ajouter un compte')}
          </DynamicButton>
        )}
      </div>

      {/* Info card explaining payment flow */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Banknote className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">{t('payoutAccounts.flowTitle', 'Flux de paiement')}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('payoutAccounts.flow1', 'Les guests paient sur les comptes du hyper admin lors de la réservation')}</li>
                <li>{t('payoutAccounts.flow2', 'Le hyper admin reverse les montants sur vos comptes de versement ci-dessous')}</li>
                <li>{t('payoutAccounts.flow3', 'Les frais de service sont déduits automatiquement avant le versement')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map(a => (
          <Card key={a.id} className={!a.isActive ? 'opacity-50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">{a.bankName}</span>
                    <Badge variant="outline" className="text-[10px]">{a.accountType.toUpperCase()}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{a.accountNumber}{a.accountKey ? ` — Clé: ${a.accountKey}` : ''}</p>
                  <p className="text-xs text-muted-foreground">{a.holderName}</p>
                  {a.agencyName && <p className="text-xs text-muted-foreground">Agence: {a.agencyName}</p>}
                  {a.rib && <p className="text-xs text-muted-foreground">RIB: {a.rib}</p>}
                  {isHyper && a.host && (
                    <Badge variant="secondary" className="text-[10px] mt-1">
                      Hôte: {a.host.firstName || ''} {a.host.lastName || ''} ({a.host.email})
                    </Badge>
                  )}
                </div>
                {!isHyper && (
                  <div className="flex gap-1 shrink-0">
                    <DynamicButton variant="outline" size="sm" onClick={() => openEdit(a)}><Edit className="h-3.5 w-3.5" /></DynamicButton>
                    <DynamicButton variant="destructive" size="sm" onClick={() => handleDelete(a.id)}><Trash2 className="h-3.5 w-3.5" /></DynamicButton>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {accounts.length === 0 && !loading && (
          <Card className="col-span-full"><CardContent className="p-8 text-center text-muted-foreground">
            {t('payoutAccounts.empty', 'Aucun compte de versement configuré')}
          </CardContent></Card>
        )}
      </div>

      {!isHyper && (
        <DynamicModal open={modalOpen} onOpenChange={o => !o && setModalOpen(false)}
          title={editingId ? t('payoutAccounts.editTitle', 'Modifier le compte') : t('payoutAccounts.newTitle', 'Nouveau compte de versement')}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t('payoutAccounts.type', 'Type de compte')}</Label>
                <Select value={form.accountType || 'ccp'} onValueChange={v => updateForm('accountType', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('payoutAccounts.bankName', 'Nom de la banque')}</Label>
                <Input value={form.bankName || ''} onChange={e => updateForm('bankName', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t('payoutAccounts.accountNumber', 'Numéro de compte')}</Label>
                <Input value={form.accountNumber || ''} onChange={e => updateForm('accountNumber', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('payoutAccounts.accountKey', 'Clé de compte')}</Label>
                <Input value={form.accountKey || ''} onChange={e => updateForm('accountKey', e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('payoutAccounts.holderName', 'Titulaire')}</Label>
              <Input value={form.holderName || ''} onChange={e => updateForm('holderName', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t('payoutAccounts.agency', 'Agence')}</Label>
                <Input value={form.agencyName || ''} onChange={e => updateForm('agencyName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>RIB</Label>
                <Input value={form.rib || ''} onChange={e => updateForm('rib', e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={form.isActive !== false} onCheckedChange={v => updateForm('isActive', v)} />
              <Label>{t('common.active', 'Actif')}</Label>
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
