import React, { useState, useCallback } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Clock, CheckCircle2, XCircle, AlertCircle,
  Loader2, ArrowLeft, Eye, DollarSign, MessageSquare, Send, CreditCard, Archive, Timer, X,
} from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';

import { useHostBookingsPaginated, useAcceptBooking, useDeclineBooking, useCounterOfferBooking, useCancelBooking } from '../bookings.hooks';
import {
  useProviderServiceBookings,
  useAcceptServiceBooking,
  useDeclineServiceBooking,
  useCounterOfferServiceBooking,
  useCancelServiceBooking,
} from '@/modules/services/service-bookings.hooks';
import { mergeBookings, type UnifiedBooking } from '../utils/normalize-booking';
import { ServerPagination } from '@/modules/shared/components/ServerPagination';
import type { BookingResponse } from '../bookings.api';

type BookingStatus = BookingResponse['status'];

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  pending:       { icon: Clock,        color: 'text-amber-600',     bgColor: 'bg-amber-100 dark:bg-amber-900/30',     label: 'Pending' },
  accepted:      { icon: CreditCard,   color: 'text-blue-600',      bgColor: 'bg-blue-100 dark:bg-blue-900/30',       label: 'Awaiting Payment' },
  confirmed:     { icon: CheckCircle2, color: 'text-emerald-600',   bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Confirmed' },
  completed:     { icon: CheckCircle2, color: 'text-primary',       bgColor: 'bg-primary/10',                         label: 'Completed' },
  cancelled:     { icon: XCircle,      color: 'text-destructive',   bgColor: 'bg-destructive/10',                     label: 'Cancelled' },
  rejected:      { icon: XCircle,      color: 'text-destructive',   bgColor: 'bg-destructive/10',                     label: 'Rejected' },
  counter_offer: { icon: DollarSign,   color: 'text-blue-600',      bgColor: 'bg-blue-100 dark:bg-blue-900/30',       label: 'Counter Offer' },
  archived:      { icon: Archive,      color: 'text-muted-foreground', bgColor: 'bg-muted',                           label: 'Archived' },
};

function formatCountdown(target: string | null | undefined): string | null {
  if (!target) return null;
  const ms = new Date(target).getTime() - Date.now();
  if (ms <= 0) return 'expired';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

export const HostBookings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = useRoleAccess('HostBookings');
  const canAcceptBookings = can('Actions', 'Button', 'Accept');
  const canRejectBookings = can('Actions', 'Button', 'Reject');
  const canCounterOffer = can('Actions', 'Button', 'CounterOffer');
  const [activeTab, setActiveTab] = useState('pending');
  const [typeFilter, setTypeFilter] = useState<'all' | 'property' | 'service'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [declineDialog, setDeclineDialog] = useState<UnifiedBooking | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [counterDialog, setCounterDialog] = useState<UnifiedBooking | null>(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterMessage, setCounterMessage] = useState('');

  const [cancelDialog, setCancelDialog] = useState<UnifiedBooking | null>(null);

  // Reset to page 1 when changing tab/page-size
  React.useEffect(() => { setPage(1); }, [activeTab, pageSize, typeFilter]);

  const { data: bookingsPage, isLoading, isFetching } = useHostBookingsPaginated({
    ...(activeTab !== 'all' ? { status: activeTab } : {}),
    page,
    limit: pageSize,
  });
  const propertyBookings: BookingResponse[] = bookingsPage?.data ?? [];
  const { data: serviceBookings = [], isLoading: loadingServices } = useProviderServiceBookings();

  const acceptMutation = useAcceptBooking();
  const declineMutation = useDeclineBooking();
  const counterMutation = useCounterOfferBooking();
  const cancelMutation = useCancelBooking();
  const acceptServiceMutation = useAcceptServiceBooking();
  const declineServiceMutation = useDeclineServiceBooking();
  const counterServiceMutation = useCounterOfferServiceBooking();
  const cancelServiceMutation = useCancelServiceBooking();

  const bookings: UnifiedBooking[] = React.useMemo(() => {
    const merged = mergeBookings(
      typeFilter === 'service' ? [] : propertyBookings,
      typeFilter === 'property' ? [] : serviceBookings,
    );
    return activeTab === 'all' ? merged : merged.filter(b => b.status === activeTab);
  }, [propertyBookings, serviceBookings, typeFilter, activeTab]);

  const handleAccept = useCallback((booking: UnifiedBooking) => {
    if (booking.type === 'service') {
      acceptServiceMutation.mutate(booking.id);
    } else {
      acceptMutation.mutate({ id: booking.id, propertyId: booking.refId });
    }
  }, [acceptMutation, acceptServiceMutation]);

  const handleDecline = useCallback(() => {
    if (!declineDialog) return;
    if (declineDialog.type === 'service') {
      declineServiceMutation.mutate({ id: declineDialog.id, reason: declineReason });
    } else {
      declineMutation.mutate({ id: declineDialog.id, propertyId: declineDialog.refId, reason: declineReason });
    }
    setDeclineDialog(null);
    setDeclineReason('');
  }, [declineDialog, declineReason, declineMutation, declineServiceMutation]);

  const handleCounterOffer = useCallback(() => {
    if (!counterDialog || !counterPrice) return;
    if (counterDialog.type === 'service') {
      counterServiceMutation.mutate({
        id: counterDialog.id,
        newPrice: Number(counterPrice),
        message: counterMessage,
      });
    } else {
      counterMutation.mutate({
        id: counterDialog.id,
        propertyId: counterDialog.refId,
        newPrice: Number(counterPrice),
        message: counterMessage,
      });
    }
    setCounterDialog(null);
    setCounterPrice('');
    setCounterMessage('');
  }, [counterDialog, counterPrice, counterMessage, counterMutation, counterServiceMutation]);

  const handleCancel = useCallback(() => {
    if (!cancelDialog) return;
    if (cancelDialog.type === 'service') {
      cancelServiceMutation.mutate({ id: cancelDialog.id });
    } else {
      cancelMutation.mutate(cancelDialog.id);
    }
    setCancelDialog(null);
  }, [cancelDialog, cancelMutation, cancelServiceMutation]);

  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Awaiting Payment' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (isLoading || loadingServices) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Booking Requests</h1>
            <p className="text-sm text-muted-foreground">
              Manage booking requests for your properties
            </p>
          </div>
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">Type:</span>
          {(['all', 'property', 'service'] as const).map(opt => (
            <Button
              key={opt}
              size="sm"
              variant={typeFilter === opt ? 'default' : 'outline'}
              onClick={() => setTypeFilter(opt)}
              className="capitalize"
            >
              {opt === 'all' ? 'All' : opt + 's'}
            </Button>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl mb-6 flex-wrap h-auto gap-1">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2 text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No booking requests</h3>
            <p className="text-sm text-muted-foreground">
              No {activeTab !== 'all' ? activeTab : ''} bookings to manage.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              const isService = booking.type === 'service';
              const isPending = booking.status === 'pending';
              const isAccepted = booking.status === 'accepted';
              const acceptCountdown = isPending ? formatCountdown(booking.acceptDeadlineAt) : null;
              const paymentCountdown = isAccepted ? formatCountdown(booking.paymentDeadlineAt) : null;
              const acceptDeadlinePassed = isPending && booking.acceptDeadlineAt && new Date(booking.acceptDeadlineAt).getTime() < Date.now();
              const canHostCancel = booking.status === 'confirmed' && new Date(booking.startDate).getTime() > Date.now();
              const guestMessage = isService
                ? (booking.raw as any).customerMessage
                : (booking.raw as BookingResponse).guestMessage;

              return (
                <Card key={booking.id} className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      {booking.image && (
                        <div className="sm:w-48 h-40 sm:h-auto relative flex-shrink-0">
                          <img
                            src={booking.image}
                            alt={booking.title}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bgColor} ${cfg.color}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {cfg.label}
                          </div>
                          <Badge variant="secondary" className="absolute top-3 right-3 text-[10px]">
                            {isService ? 'Service' : 'Property'}
                          </Badge>
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-foreground text-base">
                              {booking.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {booking.city || 'Unknown'}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-bold text-foreground">
                              {Number(booking.totalPrice).toLocaleString()} {booking.currency}
                            </p>
                            <p className="text-xs text-muted-foreground">{booking.durationLabel}</p>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="text-[11px] uppercase tracking-wider font-medium">{isService ? 'Date' : 'Check-in'}</p>
                              <p className="text-foreground font-medium text-xs">
                                {format(parseISO(booking.startDate), 'dd MMM yyyy')}
                              </p>
                            </div>
                          </div>
                          {!isService && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              <div>
                                <p className="text-[11px] uppercase tracking-wider font-medium">Check-out</p>
                                <p className="text-foreground font-medium text-xs">
                                  {format(parseISO(booking.endDate), 'dd MMM yyyy')}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="text-[11px] uppercase tracking-wider font-medium">{isService ? 'Participants' : 'Guests'}</p>
                              <p className="text-foreground font-medium text-xs">{booking.partySize}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="text-[11px] uppercase tracking-wider font-medium">Payment</p>
                              <p className="text-foreground font-medium text-xs">{booking.paymentMethod}</p>
                            </div>
                          </div>
                        </div>

                        {guestMessage && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                              <MessageSquare className="h-3 w-3" />
                              Guest message
                            </div>
                            <p className="text-sm text-foreground">{guestMessage}</p>
                          </div>
                        )}

                        {booking.guestName && (
                          <p className="text-xs text-muted-foreground mt-3">
                            Guest: <span className="font-medium text-foreground">
                              {booking.guestName}
                            </span>{booking.guestEmail ? ` (${booking.guestEmail})` : ''}
                          </p>
                        )}

                        {/* Lifecycle banners */}
                        {isPending && acceptCountdown && !acceptDeadlinePassed && (
                          <div className="mt-3 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                            <Timer className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>Respond to this request — <span className="font-semibold">{acceptCountdown}</span></span>
                          </div>
                        )}
                        {acceptDeadlinePassed && (
                          <div className="mt-3 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>Acceptance deadline expired (48h). Guest may cancel without penalty.</span>
                          </div>
                        )}
                        {isAccepted && (
                          <div className="mt-3 flex items-center gap-2 rounded-md border border-blue-500/30 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
                            <CreditCard className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>
                              Awaiting guest payment
                              {paymentCountdown && <span className="font-semibold"> · {paymentCountdown}</span>}
                            </span>
                          </div>
                        )}
                        {booking.status === 'archived' && (
                          <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
                            <Archive className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>Auto-archived — guest didn't pay within 24h of acceptance.</span>
                          </div>
                        )}

                        {/* Actions */}
                        {(isPending || canHostCancel) && (
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                            {isPending && canAcceptBookings && (
                              <Button
                                size="sm"
                                onClick={() => handleAccept(booking)}
                                disabled={acceptMutation.isPending}
                                className="gap-1"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Accept
                              </Button>
                            )}
                            {isPending && canCounterOffer && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCounterDialog(booking)}
                                className="gap-1"
                              >
                                <DollarSign className="h-3.5 w-3.5" />
                                Counter-Offer
                              </Button>
                            )}
                            {isPending && canRejectBookings && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeclineDialog(booking)}
                                className="gap-1"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Decline
                              </Button>
                            )}
                            {canHostCancel && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setCancelDialog(booking)}
                                className="gap-1"
                              >
                                <X className="h-3.5 w-3.5" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {typeFilter !== 'service' && bookingsPage && bookingsPage.total > 0 && (
          <ServerPagination
            page={bookingsPage.page}
            limit={bookingsPage.limit}
            total={bookingsPage.total}
            totalPages={bookingsPage.totalPages}
            onPageChange={setPage}
            onLimitChange={setPageSize}
            isLoading={isFetching}
          />
        )}
      </div>

      {/* Decline Dialog */}
      <AlertDialog open={!!declineDialog} onOpenChange={(o) => { if (!o) setDeclineDialog(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The guest will be notified. You can optionally provide a reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Reason for declining (optional)"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            className="mt-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDecline} className="bg-destructive text-destructive-foreground">
              Decline Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Counter-Offer Dialog */}
      <Dialog open={!!counterDialog} onOpenChange={(o) => { if (!o) setCounterDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Counter-Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {counterDialog && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <p className="text-muted-foreground">Original price:</p>
                <p className="font-bold text-lg">{Number(counterDialog.totalPrice).toLocaleString()} DA</p>
              </div>
            )}
            <div>
              <Label htmlFor="counterPrice">New Total Price (DA)</Label>
              <Input
                id="counterPrice"
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                placeholder="e.g. 80000"
              />
            </div>
            <div>
              <Label htmlFor="counterMessage">Message to guest</Label>
              <Textarea
                id="counterMessage"
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                placeholder="Explain your counter-offer..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCounterDialog(null)}>Cancel</Button>
            <Button onClick={handleCounterOffer} disabled={!counterPrice || counterMutation.isPending}>
              <Send className="h-4 w-4 mr-1" />
              Send Counter-Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel confirmed booking */}
      <AlertDialog open={!!cancelDialog} onOpenChange={(o) => { if (!o) setCancelDialog(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this confirmed booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The guest will be notified and refunded according to the cancellation policy. This may affect your reliability score.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelMutation.isPending}>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Cancelling...</> : 'Yes, Cancel'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HostBookings;
