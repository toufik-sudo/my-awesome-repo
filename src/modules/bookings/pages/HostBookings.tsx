import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Clock, CheckCircle2, XCircle, AlertCircle,
  Loader2, ArrowLeft, Eye, DollarSign, MessageSquare, Send,
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

import { useHostBookings, useAcceptBooking, useDeclineBooking, useCounterOfferBooking } from '../bookings.hooks';
import type { BookingResponse } from '../bookings.api';

type BookingStatus = BookingResponse['status'];

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  confirmed: { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  completed: { icon: CheckCircle2, color: 'text-primary', bgColor: 'bg-primary/10' },
  cancelled: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  rejected: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  counter_offer: { icon: DollarSign, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
};

export const HostBookings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [declineDialog, setDeclineDialog] = useState<BookingResponse | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [counterDialog, setCounterDialog] = useState<BookingResponse | null>(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterMessage, setCounterMessage] = useState('');

  const { data: bookings = [], isLoading } = useHostBookings(
    activeTab !== 'all' ? { status: activeTab } : {}
  );
  const acceptMutation = useAcceptBooking();
  const declineMutation = useDeclineBooking();
  const counterMutation = useCounterOfferBooking();

  const handleAccept = useCallback((booking: BookingResponse) => {
    acceptMutation.mutate({ id: booking.id, propertyId: booking.propertyId });
  }, [acceptMutation]);

  const handleDecline = useCallback(() => {
    if (!declineDialog) return;
    declineMutation.mutate({
      id: declineDialog.id,
      propertyId: declineDialog.propertyId,
      reason: declineReason,
    });
    setDeclineDialog(null);
    setDeclineReason('');
  }, [declineDialog, declineReason, declineMutation]);

  const handleCounterOffer = useCallback(() => {
    if (!counterDialog || !counterPrice) return;
    counterMutation.mutate({
      id: counterDialog.id,
      propertyId: counterDialog.propertyId,
      newPrice: Number(counterPrice),
      message: counterMessage,
    });
    setCounterDialog(null);
    setCounterPrice('');
    setCounterMessage('');
  }, [counterDialog, counterPrice, counterMessage, counterMutation]);

  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (isLoading) {
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
              const nights = booking.numberOfNights || differenceInDays(parseISO(booking.checkOutDate), parseISO(booking.checkInDate));
              const isPending = booking.status === 'pending';

              return (
                <Card key={booking.id} className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      {booking.property?.images?.[0] && (
                        <div className="sm:w-48 h-40 sm:h-auto relative flex-shrink-0">
                          <img
                            src={booking.property.images[0]}
                            alt={booking.property.title}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bgColor} ${cfg.color}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {booking.status}
                          </div>
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-foreground text-base">
                              {booking.property?.title || 'Property'}
                            </h3>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {booking.property?.city || 'Unknown'}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-bold text-foreground">
                              {Number(booking.totalPrice).toLocaleString()} DA
                            </p>
                            <p className="text-xs text-muted-foreground">{nights} nights</p>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="text-[11px] uppercase tracking-wider font-medium">Check-in</p>
                              <p className="text-foreground font-medium text-xs">
                                {format(parseISO(booking.checkInDate), 'dd MMM yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="text-[11px] uppercase tracking-wider font-medium">Check-out</p>
                              <p className="text-foreground font-medium text-xs">
                                {format(parseISO(booking.checkOutDate), 'dd MMM yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="text-[11px] uppercase tracking-wider font-medium">Guests</p>
                              <p className="text-foreground font-medium text-xs">{booking.numberOfGuests}</p>
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

                        {booking.guestMessage && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                              <MessageSquare className="h-3 w-3" />
                              Guest message
                            </div>
                            <p className="text-sm text-foreground">{booking.guestMessage}</p>
                          </div>
                        )}

                        {/* Guest info */}
                        {booking.guest && (
                          <p className="text-xs text-muted-foreground mt-3">
                            Guest: <span className="font-medium text-foreground">
                              {booking.guest.firstName} {booking.guest.lastName}
                            </span> ({booking.guest.email})
                          </p>
                        )}

                        {/* Actions for pending bookings */}
                        {isPending && (
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                            <Button
                              size="sm"
                              onClick={() => handleAccept(booking)}
                              disabled={acceptMutation.isPending}
                              className="gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCounterDialog(booking)}
                              className="gap-1"
                            >
                              <DollarSign className="h-3.5 w-3.5" />
                              Counter-Offer
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeclineDialog(booking)}
                              className="gap-1"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Decline
                            </Button>
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
    </>
  );
};

export default HostBookings;
