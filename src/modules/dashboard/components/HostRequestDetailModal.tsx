import React, { useState } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import {
  Calendar, Users, Clock, CheckCircle2, XCircle, DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { HostRequest } from '../dashboard.types';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-amber-600', label: 'En attente' },
  confirmed: { icon: CheckCircle2, color: 'text-emerald-600', label: 'Confirmée' },
  completed: { icon: CheckCircle2, color: 'text-primary', label: 'Terminée' },
  cancelled: { icon: XCircle, color: 'text-destructive', label: 'Annulée' },
  rejected: { icon: XCircle, color: 'text-destructive', label: 'Rejetée' },
};

interface HostRequestDetailModalProps {
  request: HostRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
}

export const HostRequestDetailModal: React.FC<HostRequestDetailModalProps> = ({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
}) => {
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!request) return null;

  const cfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;
  const nights = differenceInDays(parseISO(request.checkOut), parseISO(request.checkIn));
  const isPending = request.status === 'pending';

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Demande de réservation
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Guest Info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{request.guestName}</p>
                <p className="text-sm text-muted-foreground">{request.guests} voyageur{request.guests > 1 ? 's' : ''}</p>
              </div>
              <div className={`ml-auto flex items-center gap-1 text-sm ${cfg.color}`}>
                <StatusIcon className="h-4 w-4" />
                <span className="font-medium">{cfg.label}</span>
              </div>
            </div>

            {/* Property */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Propriété</p>
              <p className="text-sm font-medium">{request.propertyTitle}</p>
            </div>

            <Separator />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Check-in</p>
                <p className="text-sm font-medium">{format(parseISO(request.checkIn), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Check-out</p>
                <p className="text-sm font-medium">{format(parseISO(request.checkOut), 'dd MMM yyyy')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <span className="text-sm text-muted-foreground">{nights} nuit{nights > 1 ? 's' : ''}</span>
              </div>
              <span className="text-lg font-bold text-primary">
                {Number(request.totalPrice).toLocaleString()} DA
              </span>
            </div>
          </div>

          {isPending && (
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                variant="destructive"
                onClick={() => setRejectDialog(true)}
                className="gap-1.5"
              >
                <XCircle className="h-4 w-4" />
                Rejeter
              </Button>
              <Button
                onClick={() => { onApprove?.(request.id); onOpenChange(false); }}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approuver
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeter cette demande ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le voyageur sera notifié du rejet de sa demande.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Raison du rejet (optionnel)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="mt-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onReject?.(request.id, rejectReason);
                setRejectReason('');
                setRejectDialog(false);
                onOpenChange(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmer le rejet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
