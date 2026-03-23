import React, { useState, useCallback } from 'react';
import { Upload, Banknote, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi, type TransferAccount } from '../payments.api';
import { toast } from 'sonner';

interface TransferPaymentFlowProps {
  bookingId: string;
  totalAmount: number;
  onReceiptUploaded: () => void;
}

export const TransferPaymentFlow: React.FC<TransferPaymentFlowProps> = ({
  bookingId,
  totalAmount,
  onReceiptUploaded,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['transfer-accounts'],
    queryFn: paymentsApi.getTransferAccounts,
  });

  const activeAccounts = accounts.filter(a => a.isActive);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  }, []);

  const handleUploadReceipt = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5MB)');
      return;
    }

    setIsUploading(true);
    try {
      await paymentsApi.uploadReceipt(bookingId, file);
      setUploaded(true);
      toast.success('Receipt uploaded! Awaiting validation.');
      onReceiptUploaded();
    } catch {
      toast.error('Failed to upload receipt');
    } finally {
      setIsUploading(false);
    }
  }, [bookingId, onReceiptUploaded]);

  if (isLoading) return <LoadingSpinner size="sm" />;

  if (uploaded) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardContent className="p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Receipt Uploaded</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your payment receipt is being reviewed by our team. You'll be notified once it's validated.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Amount to pay */}
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Amount to transfer</p>
          <p className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()} DA</p>
        </CardContent>
      </Card>

      {/* Transfer accounts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Transfer to one of these accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transfer accounts available. Please contact support.</p>
          ) : (
            activeAccounts.map(account => (
              <div key={account.id} className="p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">{account.accountType.toUpperCase()}</Badge>
                    <p className="font-semibold text-sm">{account.bankName}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(account.accountNumber)}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </Button>
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Account Number</p>
                    <p className="font-mono font-medium">{account.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Holder</p>
                    <p className="font-medium">{account.holderName}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Upload receipt */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Payment Receipt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            After making the transfer, upload a photo or scan of your receipt for validation.
          </p>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload receipt</span>
                <span className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF (max 5MB)</span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleUploadReceipt}
              disabled={isUploading}
            />
          </label>
        </CardContent>
      </Card>
    </div>
  );
};
