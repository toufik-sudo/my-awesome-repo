import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DynamicEventCalendar } from '@/modules/shared/components/calendar/DynamicEventCalendar';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { bookingsApi, type BookingResponse } from '@/modules/bookings/bookings.api';
import { serviceBookingsApi, type ServiceBookingResponse } from '@/modules/services/service-bookings.api';
import {
  useAcceptBooking, useDeclineBooking, useCancelBooking,
} from '@/modules/bookings/bookings.hooks';
import {
  CalendarDays, CheckCircle2, XCircle, X, CreditCard, Archive, Clock, AlertCircle, Timer,
} from 'lucide-react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { RefreshControl } from '@/components/shared/RefreshControl';
import type { CalendarEvent } from '@/modules/shared/components/calendar/types/calendar.types';
import { format, parseISO } from 'date-fns';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  accepted: '#3b82f6',
  confirmed: '#10b981',
  completed: '#6366f1',
  cancelled: '#ef4444',
  rejected: '#dc2626',
  refunded: '#8b5cf6',
  counter_offer: '#f97316',
  archived: '#6b7280',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  accepted: 'En attente de paiement',
  confirmed: 'Confirmée',
  completed: 'Terminée',
  cancelled: 'Annulée',
  rejected: 'Rejetée',
  refunded: 'Remboursée',
  counter_offer: 'Contre-offre',
  archived: 'Archivée',
};

function formatCountdown(target: string | null | undefined): string | null {
  if (!target) return null;
  const ms = new Date(target).getTime() - Date.now();
  if (ms <= 0) return 'expiré';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const BookingCalendarPage: React.FC = () => {
  const { t } = useTranslation();
  const { can } = useRoleAccess('BookingCalendarPage');
  const canAccept = can('Actions', 'Button', 'Accept');
  const canReject = can('Actions', 'Button', 'Reject');
  const canCancel = can('Actions', 'Button', 'Cancel');

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BookingResponse | null>(null);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);

  const acceptMutation = useAcceptBooking();
  const declineMutation = useDeclineBooking();
  const cancelMutation = useCancelBooking();

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const [props, svcs] = await Promise.all([
        bookingsApi.getHostBookings(),
        serviceBookingsApi.getProviderBookings().catch(() => []),
      ]);
      setBookings(props);
      setServiceBookings(svcs);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const events: CalendarEvent[] = useMemo(() => {
    const propEvents: CalendarEvent[] = bookings.map(b => ({
      id: b.id,
      title: b.property?.title || `Réservation #${b.id.slice(0, 8)}`,
      description: [
        `${t('bookingCalendar.guest', 'Guest')}: ${b.guest?.firstName || ''} ${b.guest?.lastName || b.guest?.email || ''}`,
        `${t('bookingCalendar.guests', 'Guests')}: ${b.numberOfGuests}`,
        `${t('bookingCalendar.nights', 'Nights')}: ${b.numberOfNights}`,
        `${t('bookingCalendar.total', 'Total')}: ${b.totalPrice?.toLocaleString()} ${b.currency || 'DA'}`,
        `${t('bookingCalendar.payment', 'Payment')}: ${b.paymentMethod} (${b.paymentStatus})`,
        `${t('bookingCalendar.status', 'Status')}: ${STATUS_LABELS[b.status] || b.status}`,
      ].join('\n'),
      startDate: new Date(b.checkInDate),
      endDate: new Date(b.checkOutDate),
      color: STATUS_COLORS[b.status] || '#6b7280',
      category: b.status,
      location: b.property?.city || '',
      metadata: {
        type: 'property',
        status: b.status,
        totalPrice: b.totalPrice,
        currency: b.currency,
        guests: b.numberOfGuests,
        guestName: `${b.guest?.firstName || ''} ${b.guest?.lastName || ''}`.trim(),
        propertyTitle: b.property?.title,
      },
    }));
    const svcEvents: CalendarEvent[] = serviceBookings.map(b => {
      const title = typeof b.service?.title === 'string'
        ? b.service.title
        : (b.service?.title?.fr || b.service?.title?.en || `Service #${b.id.slice(0, 8)}`);
      const day = new Date(b.bookingDate);
      return {
        id: b.id,
        title: `🎯 ${title}`,
        description: [
          `${t('bookingCalendar.customer', 'Customer')}: ${b.customer?.firstName || ''} ${b.customer?.lastName || b.customer?.email || ''}`,
          `${t('bookingCalendar.participants', 'Participants')}: ${b.participants}`,
          `${t('bookingCalendar.total', 'Total')}: ${Number(b.totalPrice).toLocaleString()} ${b.currency || 'DA'}`,
          `${t('bookingCalendar.payment', 'Payment')}: ${b.paymentMethod} (${b.paymentStatus})`,
          `${t('bookingCalendar.status', 'Status')}: ${STATUS_LABELS[b.status] || b.status}`,
        ].join('\n'),
        startDate: day,
        endDate: day,
        color: '#0ea5e9', // distinct service color
        category: `service:${b.status}`,
        location: b.service?.city || '',
        metadata: {
          type: 'service',
          status: b.status,
          totalPrice: b.totalPrice,
          currency: b.currency,
          participants: b.participants,
          serviceTitle: title,
        },
      };
    });
    return [...propEvents, ...svcEvents];
  }, [bookings, serviceBookings, t]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    const b = bookings.find(x => x.id === event.id);
    if (b) setSelected(b);
    // Service bookings open detail in another flow — keep silent for now
  }, [bookings]);

  const closeAll = () => {
    setSelected(null);
    setDeclineOpen(false);
    setDeclineReason('');
    setCancelOpen(false);
  };

  const onAccept = async () => {
    if (!selected) return;
    await acceptMutation.mutateAsync({ id: selected.id, propertyId: selected.propertyId });
    closeAll();
    loadBookings();
  };

  const onDecline = async () => {
    if (!selected) return;
    await declineMutation.mutateAsync({ id: selected.id, propertyId: selected.propertyId, reason: declineReason });
    closeAll();
    loadBookings();
  };

  const onCancel = async () => {
    if (!selected) return;
    await cancelMutation.mutateAsync(selected.id);
    closeAll();
    loadBookings();
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  const isPending = selected?.status === 'pending';
  const isAccepted = selected?.status === 'accepted';
  const canHostCancel = selected?.status === 'confirmed' && new Date(selected.checkInDate).getTime() > Date.now();
  const acceptDeadlinePassed = isPending && selected?.acceptDeadlineAt
    && new Date(selected.acceptDeadlineAt).getTime() < Date.now();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            {t('bookingCalendar.title', 'Calendrier des réservations')}
          </h2>
          <p className="text-muted-foreground">{t('bookingCalendar.subtitle', 'Vue d\'ensemble de toutes les réservations')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['pending', 'accepted', 'confirmed', 'archived'] as const).map((key) => (
            <Badge key={key} variant="outline" className="text-xs gap-1">
              <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: STATUS_COLORS[key] }} />
              {STATUS_LABELS[key]}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs gap-1">
            <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: '#0ea5e9' }} />
            {t('bookingCalendar.service', 'Service')}
          </Badge>
          <RefreshControl onRefresh={loadBookings} storageKey="booking-calendar" compact />
        </div>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-2">
          <div className="border border-border rounded-lg overflow-hidden">
            <DynamicEventCalendar
              events={events}
              initialView="month"
              showFilters={false}
              onEventClick={handleEventClick}
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking detail / actions modal */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) closeAll(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              {selected?.property?.title || 'Réservation'}
            </DialogTitle>
            <DialogDescription>
              {selected && (
                <>
                  {format(parseISO(selected.checkInDate), 'dd MMM yyyy')} → {format(parseISO(selected.checkOutDate), 'dd MMM yyyy')}
                  {' · '}{selected.numberOfGuests} guests
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge
                  variant="outline"
                  className="gap-1"
                  style={{ borderColor: STATUS_COLORS[selected.status], color: STATUS_COLORS[selected.status] }}
                >
                  {STATUS_LABELS[selected.status] || selected.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-bold text-foreground">
                  {Number(selected.totalPrice).toLocaleString()} {selected.currency || 'DA'}
                </span>
              </div>

              {selected.guest && (
                <div className="text-sm text-muted-foreground">
                  Guest: <span className="text-foreground font-medium">
                    {selected.guest.firstName} {selected.guest.lastName}
                  </span> ({selected.guest.email})
                </div>
              )}

              {/* Lifecycle banners */}
              {isPending && !acceptDeadlinePassed && selected.acceptDeadlineAt && (
                <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                  <Timer className="h-3.5 w-3.5" />
                  Reste {formatCountdown(selected.acceptDeadlineAt)} pour répondre
                </div>
              )}
              {acceptDeadlinePassed && (
                <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Délai d'acceptation dépassé (48h).
                </div>
              )}
              {isAccepted && (
                <div className="flex items-center gap-2 rounded-md border border-blue-500/30 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
                  <CreditCard className="h-3.5 w-3.5" />
                  En attente du paiement du voyageur
                  {selected.paymentDeadlineAt && <span className="font-semibold ml-1">· {formatCountdown(selected.paymentDeadlineAt)}</span>}
                </div>
              )}
              {selected.status === 'archived' && (
                <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
                  <Archive className="h-3.5 w-3.5" />
                  Archivée — paiement non reçu dans les 24h.
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2 flex-wrap">
            {isPending && canAccept && (
              <Button onClick={onAccept} disabled={acceptMutation.isPending} className="gap-1">
                <CheckCircle2 className="h-4 w-4" /> Accepter
              </Button>
            )}
            {isPending && canReject && (
              <Button variant="destructive" onClick={() => setDeclineOpen(true)} className="gap-1">
                <XCircle className="h-4 w-4" /> Refuser
              </Button>
            )}
            {canHostCancel && canCancel && (
              <Button variant="destructive" onClick={() => setCancelOpen(true)} className="gap-1">
                <X className="h-4 w-4" /> Annuler
              </Button>
            )}
            <Button variant="outline" onClick={closeAll}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline */}
      <AlertDialog open={declineOpen} onOpenChange={setDeclineOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refuser cette réservation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le voyageur sera notifié. Vous pouvez fournir une raison.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Raison (facultatif)"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDecline}
              disabled={declineMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Refuser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel confirmed */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler cette réservation confirmée ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le voyageur sera notifié et remboursé selon la politique d'annulation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Garder</AlertDialogCancel>
            <AlertDialogAction
              onClick={onCancel}
              disabled={cancelMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
