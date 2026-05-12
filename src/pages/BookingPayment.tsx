import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Calendar, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { bookingsApi } from '@/modules/bookings/bookings.api';
import { TransferPaymentFlow } from '@/modules/payments/components/TransferPaymentFlow';

const BookingPayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: booking, isLoading, refetch } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsApi.getOne(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Booking not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/bookings')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to bookings
        </Button>
      </div>
    );
  }

  const nights = booking.numberOfNights;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate('/bookings')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to bookings
      </Button>

      <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Complete your payment</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your payment receipt to confirm booking #{booking.id.slice(0, 8).toUpperCase()}.
            </p>
          </div>

          <TransferPaymentFlow
            bookingId={booking.id}
            totalAmount={Number(booking.totalPrice)}
            onReceiptUploaded={() => refetch()}
          />
        </div>

        <Card className="h-fit sticky top-4">
          <CardHeader>
            <CardTitle className="text-base">Booking summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {booking.property && (
              <div>
                <p className="font-semibold">{booking.property.title}</p>
                <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" /> {booking.property.city}
                </p>
              </div>
            )}
            <Separator />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(parseISO(booking.checkInDate), 'dd MMM yyyy')} →{' '}
                {format(parseISO(booking.checkOutDate), 'dd MMM yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{booking.numberOfGuests} guest(s) · {nights} night(s)</span>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {Number(booking.effectiveRate).toLocaleString()} {booking.currency} × {nights}
                </span>
                <span>{Number(booking.subtotal).toLocaleString()} {booking.currency}</span>
              </div>
              {Number(booking.cleaningFee) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cleaning fee</span>
                  <span>{Number(booking.cleaningFee).toLocaleString()} {booking.currency}</span>
                </div>
              )}
              {Number(booking.serviceFee) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>{Number(booking.serviceFee).toLocaleString()} {booking.currency}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-base pt-1">
                <span>Total</span>
                <span>{Number(booking.totalPrice).toLocaleString()} {booking.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPayment;