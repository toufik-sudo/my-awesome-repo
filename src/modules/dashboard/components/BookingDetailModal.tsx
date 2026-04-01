import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, parseISO, differenceInDays } from 'date-fns';
import {
  Calendar, MapPin, Users, Clock, CheckCircle2, XCircle, DollarSign,
  MessageSquare, Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { RecentBooking, HostRequest } from '../dashboard.types';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  pending: { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', label: 'En attente' },
  confirmed: { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Confirmée' },
  completed: { icon: CheckCircle2, color: 'text-primary', bgColor: 'bg-primary/10', label: 'Terminée' },
  cancelled: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10', label: 'Annulée' },
  rejected: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10', label: 'Rejetée' },
};

interface BookingDetailModalProps {
  booking: RecentBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  canManage?: boolean;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  open,
  onOpenChange,
  onApprove,
  onReject,
  canManage = false,
}) => {
  const { t } = useTranslation();
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!booking) return null;

  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;
  const nights = differenceInDays(parseISO(booking.checkOut), parseISO(booking.checkIn));
  const isPending = booking.status === 'pending';

  const handleReject = () => {
    onReject?.(booking.id, rejectReason);
    setRejectReason('');
    setRejectDialog(false);
    onOpenChange(false);
  };

  const handleApprove = () => {
    onApprove?.(booking.id);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Détails de la réservation
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Property Info */}
            <div className="flex gap-3">
              {booking.propertyImage && (
                <img
                  src={booking.propertyImage}
                  alt={booking.propertyTitle}
                  className="w-24 h-20 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{booking.propertyTitle}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {booking.location}
                </p>
                <div className={`flex items-center gap-1 text-sm mt-1 ${cfg.color}`}>
                  <StatusIcon className="h-4 w-4" />
                  <span className="font-medium">{cfg.label}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Dates & Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Check-in</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {format(parseISO(booking.checkIn), 'dd MMM yyyy')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Check-out</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {format(parseISO(booking.checkOut), 'dd MMM yyyy')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Nuits</p>
                <p className="text-sm font-medium">{nights} nuit{nights > 1 ? 's' : ''}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Voyageurs</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {booking.guests}
                </p>
              </div>
            </div>

            <Separator />

            {/* Price */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Prix total</span>
              <span className="text-lg font-bold text-primary">
                {Number(booking.totalPrice).toLocaleString()} DA
              </span>
            </div>
          </div>

          {/* Actions */}
          {canManage && isPending && (
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                variant="destructive"
                onClick={() => setRejectDialog(true)}
                className="gap-1.5"
              >
                <XCircle className="h-4 w-4" />
                Rejeter
              </Button>
              <Button onClick={handleApprove} className="gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Approuver
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation */}
      <AlertDialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeter cette réservation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le voyageur sera notifié.
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
            <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmer le rejet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
