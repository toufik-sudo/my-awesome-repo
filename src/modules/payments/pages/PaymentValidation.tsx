import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Eye, Check, X, Loader2, Clock, CheckCircle2, XCircle, FileText, Upload, RefreshCw,
  CreditCard, DollarSign, Calendar, User, Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, type PaymentReceipt, type TransferAccount } from '../payments.api';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { cn } from '@/lib/utils';

const STATUS_BADGE: Record<string, { label: string; variant: string; icon: React.ReactNode }> = {
  pending: { label: 'En attente', variant: 'outline', icon: <Clock className="h-3 w-3" /> },
  approved: { label: 'Approuvé', variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
  rejected: { label: 'Rejeté', variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
};

export const PaymentValidation: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rejectDialog, setRejectDialog] = useState<PaymentReceipt | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [accountDialog, setAccountDialog] = useState(false);
  const [editAccount, setEditAccount] = useState<Partial<TransferAccount>>({});
  const [statusFilter, setStatusFilter] = useState<string>('pending');

  const { data: receipts = [], isLoading: receiptsLoading } = useQuery({
    queryKey: ['pending-receipts'],
    queryFn: paymentsApi.getPendingReceipts,
  });

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['transfer-accounts'],
    queryFn: paymentsApi.getTransferAccounts,
  });

  const filteredReceipts = useMemo(() => {
    if (!statusFilter || statusFilter === 'all') return receipts;
    return receipts.filter((r: any) => (r.status || 'pending') === statusFilter);
  }, [receipts, statusFilter]);

  const stats = useMemo(() => {
    const total = receipts.length;
    const pending = receipts.filter((r: any) => !r.status || r.status === 'pending').length;
    const approved = receipts.filter((r: any) => r.status === 'approved').length;
    const rejected = receipts.filter((r: any) => r.status === 'rejected').length;
    const totalAmount = receipts.reduce((acc: number, r: any) => acc + Number(r.booking?.totalPrice || 0), 0);
    return { total, pending, approved, rejected, totalAmount };
  }, [receipts]);

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total reçus</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approuvés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/10 border-border/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Montant DA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transfer Accounts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Comptes de virement
                </CardTitle>
                <CardDescription>Comptes affichés aux clients pour les virements</CardDescription>
              </div>
              <Button size="sm" onClick={() => { setEditAccount({}); setAccountDialog(true); }} className="gap-1.5">
                Ajouter un compte
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Aucun compte configuré</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {accounts.map(account => (
                  <Card key={account.id} className="border border-border/60">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm">{account.bankName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{account.accountNumber}</p>
                          <p className="text-xs text-muted-foreground">{account.holderName}</p>
                          <Badge variant={account.isActive ? 'secondary' : 'outline'} className="text-[10px] mt-1">
                            {account.accountType.toUpperCase()} · {account.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"
                            onClick={() => { setEditAccount(account); setAccountDialog(true); }}>
                            <FileText className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                            onClick={() => deleteAccountMutation.mutate(account.id)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receipts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Reçus de paiement
                  {stats.pending > 0 && (
                    <Badge variant="secondary" className="animate-pulse">{stats.pending}</Badge>
                  )}
                </CardTitle>
                <CardDescription>Validez les reçus de virement des clients</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvés</SelectItem>
                    <SelectItem value="rejected">Rejetés</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['pending-receipts'] })}
                  className="gap-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Actualiser
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredReceipts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-emerald-500/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Aucun reçu en attente</p>
                <p className="text-xs text-muted-foreground mt-1">Tous les paiements sont traités</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReceipts.map(receipt => (
                  <Card key={receipt.id} className="border border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Left: Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Building2 className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">
                                  {receipt.booking?.property?.title || 'Propriété'}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-mono">
                                  #{receipt.bookingId.slice(0, 8).toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                {Number(receipt.booking?.totalPrice || 0).toLocaleString()} DA
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            {receipt.booking?.guest && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {receipt.booking.guest.firstName} {receipt.booking.guest.lastName}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(receipt.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                            <span className="text-[11px] font-mono">{receipt.originalFileName}</span>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex sm:flex-col items-center gap-2 sm:justify-center">
                          <Button
                            size="sm"
                            className="gap-1 flex-1 sm:flex-initial sm:w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => approveMutation.mutate(receipt.id)}
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approuver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1 flex-1 sm:flex-initial sm:w-full"
                            onClick={() => setRejectDialog(receipt)}
                          >
                            <X className="h-3.5 w-3.5" />
                            Rejeter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 flex-1 sm:flex-initial sm:w-full"
                            onClick={() => setPreviewUrl(receipt.receiptUrl)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Receipt Preview */}
      <Dialog open={!!previewUrl} onOpenChange={(o) => { if (!o) setPreviewUrl(null); }}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Aperçu du reçu</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <div className="flex items-center justify-center">
              <img src={previewUrl} alt="Reçu de paiement" className="max-w-full max-h-[60vh] object-contain rounded-lg border border-border" />
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
              Le client sera notifié et invité à soumettre un nouveau reçu.
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
                placeholder="Ex: CCP Postal"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={editAccount.accountType || 'ccp'} onValueChange={v => setEditAccount(p => ({ ...p, accountType: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ccp">CCP (Postal)</SelectItem>
                  <SelectItem value="bna">BNA (Banque Nationale d'Algérie)</SelectItem>
                  <SelectItem value="badr">BADR (Banque de l'Agriculture)</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Numéro de compte</Label>
              <Input
                value={editAccount.accountNumber || ''}
                onChange={(e) => setEditAccount(p => ({ ...p, accountNumber: e.target.value }))}
                placeholder="Ex: 0012345678 clé 90"
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