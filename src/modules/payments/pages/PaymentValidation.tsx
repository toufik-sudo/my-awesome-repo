import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Eye, Check, X, Loader2, Clock, CheckCircle2, XCircle, FileText, Upload, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { MainLayout } from '@/modules/shared/layout/MainLayout';
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
      toast.success('Receipt approved — booking confirmed');
      queryClient.invalidateQueries({ queryKey: ['pending-receipts'] });
    },
    onError: () => toast.error('Failed to approve receipt'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => paymentsApi.rejectReceipt(id, note),
    onSuccess: () => {
      toast.success('Receipt rejected');
      queryClient.invalidateQueries({ queryKey: ['pending-receipts'] });
      setRejectDialog(null);
      setRejectNote('');
    },
    onError: () => toast.error('Failed to reject receipt'),
  });

  const upsertAccountMutation = useMutation({
    mutationFn: (data: any) => paymentsApi.upsertTransferAccount(data),
    onSuccess: () => {
      toast.success('Account saved');
      queryClient.invalidateQueries({ queryKey: ['transfer-accounts'] });
      setAccountDialog(false);
      setEditAccount({});
    },
    onError: () => toast.error('Failed to save account'),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.deleteTransferAccount(id),
    onSuccess: () => {
      toast.success('Account deleted');
      queryClient.invalidateQueries({ queryKey: ['transfer-accounts'] });
    },
  });

  const handleReject = useCallback(() => {
    if (!rejectDialog) return;
    rejectMutation.mutate({ id: rejectDialog.id, note: rejectNote });
  }, [rejectDialog, rejectNote, rejectMutation]);

  if (receiptsLoading || accountsLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment Validation</h1>
            <p className="text-sm text-muted-foreground">
              Validate transfer receipts and manage bank accounts
            </p>
          </div>
        </div>

        {/* Transfer Accounts Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Transfer Accounts</CardTitle>
              <Button size="sm" onClick={() => { setEditAccount({}); setAccountDialog(true); }}>
                Add Account
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No transfer accounts configured. Add one to display to users.
              </p>
            ) : (
              <div className="space-y-3">
                {accounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                     <div>
                      <p className="font-medium text-sm">{account.bankName}</p>
                      <p className="text-xs text-muted-foreground">
                        {account.accountType.toUpperCase()} — {account.accountNumber} — {account.holderName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={account.isActive ? 'secondary' : 'outline'}>
                        {account.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditAccount(account); setAccountDialog(true); }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => deleteAccountMutation.mutate(account.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Receipts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pending Receipts
                {receipts.length > 0 && (
                  <Badge variant="secondary">{receipts.length}</Badge>
                )}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['pending-receipts'] })}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {receipts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No pending receipts to validate</p>
              </div>
            ) : (
              <div className="space-y-4">
                {receipts.map(receipt => (
                  <div key={receipt.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm">
                            {receipt.booking?.property?.title || 'Property'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Booking: {receipt.bookingId.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                          {Number(receipt.booking?.totalPrice || 0).toLocaleString()} DA
                        </p>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {receipt.booking?.guest && (
                          <span>
                            Guest: {receipt.booking.guest.firstName} {receipt.booking.guest.lastName}
                          </span>
                        )}
                        <span>File: {receipt.originalFileName}</span>
                        <span>{new Date(receipt.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(receipt.id)}
                          disabled={approveMutation.isPending}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setRejectDialog(receipt)}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewUrl(receipt.receiptUrl)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
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
            <DialogTitle>Receipt Preview</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <div className="flex items-center justify-center">
              <img src={previewUrl} alt="Payment receipt" className="max-w-full max-h-[60vh] object-contain rounded" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <AlertDialog open={!!rejectDialog} onOpenChange={(o) => { if (!o) setRejectDialog(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this receipt?</AlertDialogTitle>
            <AlertDialogDescription>
              The guest will be notified and asked to re-submit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional)"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Account Edit Dialog */}
      <Dialog open={accountDialog} onOpenChange={(o) => { if (!o) { setAccountDialog(false); setEditAccount({}); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editAccount.id ? 'Edit' : 'Add'} Transfer Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Bank Name</Label>
              <Input
                value={editAccount.bankName || ''}
                onChange={(e) => setEditAccount(p => ({ ...p, bankName: e.target.value }))}
                placeholder="e.g. CCP Postal Account"
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
                value={editAccount.accountType || 'ccp'}
                onChange={(e) => setEditAccount(p => ({ ...p, accountType: e.target.value as any }))}
              >
                <option value="ccp">CCP (Postal)</option>
                <option value="bna">BNA (Banque Nationale d'Algérie)</option>
                <option value="badr">BADR (Banque de l'Agriculture)</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label>Account Number</Label>
              <Input
                value={editAccount.accountNumber || ''}
                onChange={(e) => setEditAccount(p => ({ ...p, accountNumber: e.target.value }))}
                placeholder="e.g. 0012345678 clé 90"
              />
            </div>
            <div>
              <Label>Account Holder Name</Label>
              <Input
                value={editAccount.holderName || ''}
                onChange={(e) => setEditAccount(p => ({ ...p, holderName: e.target.value }))}
                placeholder="Full name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAccountDialog(false); setEditAccount({}); }}>
              Cancel
            </Button>
            <Button
              onClick={() => upsertAccountMutation.mutate({
                ...editAccount,
                isActive: editAccount.isActive ?? true,
                accountType: editAccount.accountType || 'ccp',
              })}
              disabled={!editAccount.bankName || !editAccount.accountNumber || !editAccount.holderName}
            >
              Save Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PaymentValidation;
