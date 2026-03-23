import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar, MapPin, Users, Clock, CheckCircle2, XCircle, AlertCircle,
  Loader2, ArrowLeft, RotateCcw, Eye, X,
} from 'lucide-react';
import { format, differenceInDays, isPast, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { useMyBookings, useCancelBooking } from '@/modules/bookings/bookings.hooks';
import type { BookingResponse } from '@/modules/bookings/bookings.api';
import { BookingPaymentStatus } from '@/modules/bookings/components/BookingPaymentStatus';

type BookingStatus = BookingResponse['status'];

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  confirmed: { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  completed: { icon: CheckCircle2, color: 'text-primary', bgColor: 'bg-primary/10' },
  cancelled: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  rejected: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  refunded: { icon: RotateCcw, color: 'text-muted-foreground', bgColor: 'bg-muted' },
  counter_offer: { icon: AlertCircle, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
};

const MyBookings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data: bookings = [], isLoading } = useMyBookings();
  const cancelMutation = useCancelBooking();

  const tabs = useMemo(() => [
    { value: 'all', label: 'All', count: bookings.length },
    { value: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { value: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled' || b.status === 'refunded').length },
  ], [bookings]);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return bookings;
    if (activeTab === 'cancelled') return bookings.filter(b => b.status === 'cancelled' || b.status === 'refunded');
    return bookings.filter(b => b.status === activeTab);
  }, [bookings, activeTab]);

  const handleCancel = useCallback(() => {
    if (!cancellingId) return;
    cancelMutation.mutate(cancellingId);
    setCancellingId(null);
  }, [cancellingId, cancelMutation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {bookings.length} total reservations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl mb-6 flex-wrap h-auto gap-1">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2 text-sm"
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-[20px] text-[10px] px-1.5">
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You don't have any {activeTab !== 'all' ? activeTab : ''} bookings yet.
                </p>
                <Button onClick={() => navigate('/properties')}>Browse Properties</Button>
              </div>
            ) : (
              filteredBookings.map(booking => {
                const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                const StatusIcon = statusCfg.icon;
                const nights = booking.numberOfNights || differenceInDays(parseISO(booking.checkOutDate), parseISO(booking.checkInDate));
                const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
                const isUpcoming = !isPast(parseISO(booking.checkInDate));

                return (
                  <Card key={booking.id} className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div
                          className="sm:w-48 h-40 sm:h-auto relative cursor-pointer flex-shrink-0"
                          onClick={() => navigate(`/property/${booking.propertyId}`)}
                        >
                          {booking.property?.images?.[0] ? (
                            <img
                              src={booking.property.images[0]}
                              alt={booking.property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Calendar className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.bgColor} ${statusCfg.color}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3
                                  className="font-semibold text-foreground text-base hover:text-primary transition-colors cursor-pointer"
                                  onClick={() => navigate(`/property/${booking.propertyId}`)}
                                >
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
                                  <p className="text-[11px] uppercase tracking-wider font-medium">Ref</p>
                                  <p className="text-foreground font-medium text-xs">{booking.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Payment Status */}
                          <BookingPaymentStatus
                            bookingId={booking.id}
                            totalPrice={Number(booking.totalPrice)}
                            paymentMethod={booking.paymentMethod}
                            paymentStatus={booking.paymentStatus}
                          />

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground">
                              Booked {format(parseISO(booking.createdAt), 'dd MMM yyyy')}
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => navigate(`/property/${booking.propertyId}`)}>
                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                              </Button>
                              {canCancel && isUpcoming && (
                                <Button variant="destructive" size="sm" onClick={() => setCancellingId(booking.id)}>
                                  <X className="h-3.5 w-3.5 mr-1" /> Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </Tabs>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancellingId} onOpenChange={(o) => { if (!o) setCancellingId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The host will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelMutation.isPending}>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelMutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Cancelling...</>
              ) : (
                'Yes, Cancel Booking'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyBookings;
