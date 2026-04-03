import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, Check, X, RefreshCw, Plus, Pencil, Trash2,
  CheckCircle2, FileText, CreditCard, Building2, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, type PaymentReceipt, type TransferAccount } from '../payments.api';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';

export const PaymentValidation: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rejectDialog, setRejectDialog] = useState<PaymentReceipt | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [accountDialog, setAccountDialog] = useState(false);
  const [editAccount, setEditAccount] = useState<Partial<TransferAccount>>({});

  const { data: receipts = [], isLoading: receiptsLoading } = useQuery({
    queryKey: ['pending-receipts'],
    queryFn: paymentsApi.getPendingReceipts,
  });

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['transfer-accounts'],
    queryFn: paymentsApi.getTransferAccounts,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.approveReceipt(id),
    onSuccess: () => {
      toast.success('Reçu approuvé — réservation confirmée');
      queryClient.invalidateQueries({ queryKey: ['pending-receipts'] });
    },
    onError: () => toast.error('Échec de l\'approbation'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => paymentsApi.rejectReceipt(id, note),
    onSuccess: () => {
      toast.success('Reçu rejeté');
      queryClient.invalidateQueries({ queryKey: ['pending-receipts'] });
      setRejectDialog(null);
      setRejectNote('');
    },
    onError: () => toast.error('Échec du rejet'),
  });

  const upsertAccountMutation = useMutation({
    mutationFn: (data: any) => paymentsApi.upsertTransferAccount(data),
    onSuccess: () => {
      toast.success('Compte enregistré');
      queryClient.invalidateQueries({ queryKey: ['transfer-accounts'] });
      setAccountDialog(false);
      setEditAccount({});
    },
    onError: () => toast.error('Échec de l\'enregistrement'),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.deleteTransferAccount(id),
    onSuccess: () => {
      toast.success('Compte supprimé');
      queryClient.invalidateQueries({ queryKey: ['transfer-accounts'] });
    },
  });

  const handleReject = useCallback(() => {
    if (!rejectDialog) return;
    rejectMutation.mutate({ id: rejectDialog.id, note: rejectNote });
  }, [rejectDialog, rejectNote, rejectMutation]);

  if (receiptsLoading || accountsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border/40">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{receipts.length}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10">
                <CreditCard className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{accounts.length}</p>
                <p className="text-xs text-muted-foreground">Comptes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 col-span-2 sm:col-span-2">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-secondary/10">
                  <Building2 className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Comptes de virement</p>
                  <p className="text-xs text-muted-foreground">Gérer les comptes affichés aux utilisateurs</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => { setEditAccount({}); setAccountDialog(true); }} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Ajouter
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transfer Accounts — compact grid */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {accounts.map(account => (
              <Card key={account.id} className="border-border/40 group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-muted">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{account.bankName}</p>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{account.accountType}</p>
                      </div>
                    </div>
                    <Badge variant={account.isActive ? 'default' : 'outline'} className="text-[10px]">
                      {account.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">{account.accountNumber}</p>
                  <p className="text-xs text-foreground">{account.holderName}</p>
                  <div className="flex gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => { setEditAccount(account); setAccountDialog(true); }}>
                      <Pencil className="h-3 w-3" /> Modifier
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => deleteAccountMutation.mutate(account.id)}>
                      <Trash2 className="h-3 w-3" /> Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pending Receipts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Reçus en attente
              {receipts.length > 0 && (
                <Badge variant="secondary" className="text-xs">{receipts.length}</Badge>
              )}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['pending-receipts'] })} className="gap-1.5 text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Actualiser
            </Button>
          </div>

          {receipts.length === 0 ? (
            <Card className="border-dashed border-border/60">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground font-medium">Aucun reçu en attente</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Les nouveaux reçus apparaîtront ici</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {receipts.map(receipt => (
                <Card key={receipt.id} className="border-border/40 overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Receipt thumbnail */}
                      <button
                        onClick={() => setPreviewUrl(receipt.receiptUrl)}
                        className="w-24 sm:w-32 bg-muted flex-shrink-0 flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer relative group"
                      >
                        <img
                          src={receipt.receiptUrl}
                          alt="Reçu"
                          className="w-full h-full object-cover min-h-[120px]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="h-5 w-5 text-foreground" />
                        </div>
                      </button>

                      {/* Receipt details */}
                      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold truncate">
                              {receipt.booking?.property?.title || 'Propriété'}
                            </p>
                            <p className="text-base font-bold text-primary whitespace-nowrap">
                              {Number(receipt.booking?.totalPrice || 0).toLocaleString()} DA
                            </p>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                            #{receipt.bookingId.slice(0, 8).toUpperCase()}
                          </p>
                          {receipt.booking?.guest && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {receipt.booking.guest.firstName} {receipt.booking.guest.lastName}
                            </p>
                          )}
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {new Date(receipt.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="sm"
                            className="h-8 text-xs gap-1.5 flex-1"
                            onClick={() => approveMutation.mutate(receipt.id)}
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-3.5 w-3.5" /> Approuver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 text-xs gap-1.5 flex-1"
                            onClick={() => setRejectDialog(receipt)}
                          >
                            <X className="h-3.5 w-3.5" /> Rejeter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Receipt Preview */}
      <Dialog open={!!previewUrl} onOpenChange={(o) => { if (!o) setPreviewUrl(null); }}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Aperçu du reçu</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <div className="flex items-center justify-center bg-muted rounded-lg p-4">
              <img src={previewUrl} alt="Reçu de paiement" className="max-w-full max-h-[65vh] object-contain rounded" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <AlertDialog open={!!rejectDialog} onOpenChange={(o) => { if (!o) setRejectDialog(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeter ce reçu ?</AlertDialogTitle>
            <AlertDialogDescription>
              L'utilisateur sera notifié et invité à renvoyer un reçu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Raison du rejet (optionnel)"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground">
              Rejeter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Account Edit Dialog */}
      <Dialog open={accountDialog} onOpenChange={(o) => { if (!o) { setAccountDialog(false); setEditAccount({}); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editAccount.id ? 'Modifier' : 'Ajouter'} un compte de virement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom de la banque</Label>
              <Input
                value={editAccount.bankName || ''}
                onChange={(e) => setEditAccount(p => ({ ...p, bankName: e.target.value }))}
                placeholder="ex: CCP Compte Postal"
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background border-border"
                value={editAccount.accountType || 'ccp'}
                onChange={(e) => setEditAccount(p => ({ ...p, accountType: e.target.value as any }))}
              >
                <option value="ccp">CCP (Postal)</option>
                <option value="bna">BNA (Banque Nationale d'Algérie)</option>
                <option value="badr">BADR (Banque de l'Agriculture)</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <Label>Numéro de compte</Label>
              <Input
                value={editAccount.accountNumber || ''}
                onChange={(e) => setEditAccount(p => ({ ...p, accountNumber: e.target.value }))}
                placeholder="ex: 0012345678 clé 90"
              />
            </div>
            <div>
              <Label>Titulaire du compte</Label>
              <Input
                value={editAccount.holderName || ''}
                onChange={(e) => setEditAccount(p => ({ ...p, holderName: e.target.value }))}
                placeholder="Nom complet"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAccountDialog(false); setEditAccount({}); }}>
              Annuler
            </Button>
            <Button
              onClick={() => upsertAccountMutation.mutate({
                ...editAccount,
                isActive: editAccount.isActive ?? true,
                accountType: editAccount.accountType || 'ccp',
              })}
              disabled={!editAccount.bankName || !editAccount.accountNumber || !editAccount.holderName}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentValidation;
