import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Receipt, CheckCircle2, XCircle, Clock, Upload, ChevronDown, ChevronUp,
  FileText, AlertTriangle,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { paymentsApi, type PaymentReceipt } from '@/modules/payments/payments.api';
import { TransferPaymentFlow } from '@/modules/payments/components/TransferPaymentFlow';

interface BookingPaymentStatusProps {
  bookingId: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
}

const RECEIPT_STATUS_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  pending: { icon: Clock, label: 'Under Review', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  approved: { icon: CheckCircle2, label: 'Approved', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  rejected: { icon: XCircle, label: 'Rejected', color: 'text-destructive', bg: 'bg-destructive/10' },
};

const TRANSFER_METHODS = ['ccp', 'bank_transfer', 'bna', 'badr'];

export const BookingPaymentStatus: React.FC<BookingPaymentStatusProps> = ({
  bookingId,
  totalPrice,
  paymentMethod,
  paymentStatus,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const isTransferMethod = TRANSFER_METHODS.includes(paymentMethod);

  const { data: receipts = [], refetch } = useQuery({
    queryKey: ['booking-receipts', bookingId],
    queryFn: () => paymentsApi.getReceiptsByBooking(bookingId),
    enabled: isTransferMethod,
  });

  const latestReceipt = receipts[0];
  const hasApproved = receipts.some(r => r.status === 'approved');
  const hasPending = receipts.some(r => r.status === 'pending');
  const allRejected = receipts.length > 0 && receipts.every(r => r.status === 'rejected');
  const canUploadNew = !hasApproved && !hasPending;

  if (!isTransferMethod) {
    // Non-transfer: show simple payment status
    return (
      <div className="flex items-center gap-2 text-sm">
        <Receipt className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Payment:</span>
        <Badge variant="outline" className="text-xs capitalize">{paymentMethod.replace('_', ' ')}</Badge>
        <Badge
          variant={paymentStatus === 'paid' ? 'default' : 'secondary'}
          className="text-xs capitalize"
        >
          {paymentStatus}
        </Badge>
      </div>
    );
  }

  // Transfer payment: show receipt tracking
  return (
    <div className="mt-3 rounded-lg border border-border/60 overflow-hidden">
      {/* Summary bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Payment Receipt</span>
          {latestReceipt ? (
            (() => {
              const cfg = RECEIPT_STATUS_CONFIG[latestReceipt.status];
              const StatusIcon = cfg.icon;
              return (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {cfg.label}
                </span>
              );
            })()
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
              <AlertTriangle className="h-3 w-3" />
              No receipt uploaded
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="p-4 space-y-3">
          {/* Receipt history */}
          {receipts.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Receipt History</p>
              {receipts.map((receipt) => {
                const cfg = RECEIPT_STATUS_CONFIG[receipt.status];
                const StatusIcon = cfg.icon;
                return (
                  <div key={receipt.id} className="flex items-center justify-between p-2.5 rounded-md bg-background border border-border/40">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{receipt.originalFileName}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {format(parseISO(receipt.createdAt), 'dd MMM yyyy, HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Show rejection note */}
              {latestReceipt?.status === 'rejected' && latestReceipt.reviewNote && (
                <div className="p-3 rounded-md bg-destructive/5 border border-destructive/20">
                  <p className="text-xs font-medium text-destructive mb-1">Rejection Reason:</p>
                  <p className="text-sm text-foreground">{latestReceipt.reviewNote}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No receipt has been uploaded yet. Please transfer the amount and upload your receipt.
            </p>
          )}

          <Separator />

          {/* Upload action */}
          {canUploadNew && !showUpload && (
            <Button
              variant={allRejected ? 'default' : 'outline'}
              size="sm"
              className="w-full"
              onClick={() => setShowUpload(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              {allRejected ? 'Upload New Receipt' : 'Upload Receipt'}
            </Button>
          )}

          {showUpload && (
            <TransferPaymentFlow
              bookingId={bookingId}
              totalAmount={totalPrice}
              onReceiptUploaded={() => {
                setShowUpload(false);
                refetch();
              }}
            />
          )}

          {hasApproved && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Payment verified successfully
              </p>
            </div>
          )}

          {hasPending && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <Clock className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Your receipt is being reviewed. You'll be notified once it's validated.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
