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
import { serviceBookingsApi } from '@/modules/services/service-bookings.api';
import { TransferPaymentFlow } from '@/modules/payments/components/TransferPaymentFlow';

type LoadedBooking =
  | { kind: 'property'; data: Awaited<ReturnType<typeof bookingsApi.getOne>> }
  | { kind: 'service'; data: Awaited<ReturnType<typeof serviceBookingsApi.getOne>> };

const BookingPayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery<LoadedBooking | null>({
    queryKey: ['booking-or-service', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const property = await bookingsApi.getOne(id);
        return { kind: 'property', data: property };
      } catch {
        try {
          const service = await serviceBookingsApi.getOne(id);
          return { kind: 'service', data: service };
        } catch {
          return null;
        }
      }
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Booking not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/bookings')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to bookings
        </Button>
      </div>
    );
  }

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
              Upload your payment receipt to confirm booking #{data.data.id.slice(0, 8).toUpperCase()}.
            </p>
          </div>

          <TransferPaymentFlow
            bookingId={data.data.id}
            totalAmount={Number(data.data.totalPrice)}
            onReceiptUploaded={() => refetch()}
          />
        </div>

        <Card className="h-fit sticky top-4">
          <CardHeader>
            <CardTitle className="text-base">Booking summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.kind === 'property' ? (
              <PropertySummary booking={data.data} />
            ) : (
              <ServiceSummary booking={data.data} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PropertySummary: React.FC<{ booking: Awaited<ReturnType<typeof bookingsApi.getOne>> }> = ({ booking }) => {
  const nights = booking.numberOfNights;
  return (
    <>
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
      <FeesBreakdown
        subtotal={Number(booking.subtotal)}
        cleaningFee={Number(booking.cleaningFee || 0)}
        serviceFee={Number(booking.serviceFee || 0)}
        total={Number(booking.totalPrice)}
        currency={booking.currency || 'DZD'}
        rateLabel={`${Number(booking.effectiveRate).toLocaleString()} ${booking.currency} × ${nights}`}
      />
    </>
  );
};

const ServiceSummary: React.FC<{ booking: Awaited<ReturnType<typeof serviceBookingsApi.getOne>> }> = ({ booking }) => {
  const title = typeof booking.service?.title === 'string'
    ? booking.service.title
    : (booking.service?.title?.fr || booking.service?.title?.en || 'Service');
  return (
    <>
      <div>
        <p className="font-semibold">{title}</p>
        {booking.service?.city && (
          <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3" /> {booking.service.city}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        <span>{format(parseISO(booking.bookingDate), 'dd MMM yyyy')}{booking.startTime ? ` · ${booking.startTime}` : ''}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="h-3.5 w-3.5" />
        <span>{booking.participants + (booking.childParticipants || 0)} participant(s)</span>
      </div>
      <Separator />
      <FeesBreakdown
        subtotal={Number((booking as any).subtotalAmount ?? booking.totalPrice)}
        serviceFee={Number((booking as any).serviceFeeAmount || 0)}
        hostAbsorption={Number((booking as any).hostAbsorptionAmount || 0)}
        pointsDiscount={Number((booking as any).pointsDiscount || 0)}
        referralDiscount={Number((booking as any).referralDiscount || 0)}
        total={Number(booking.totalPrice)}
        currency={booking.currency || 'DZD'}
      />
    </>
  );
};

const FeesBreakdown: React.FC<{
  subtotal: number;
  cleaningFee?: number;
  serviceFee?: number;
  hostAbsorption?: number;
  pointsDiscount?: number;
  referralDiscount?: number;
  total: number;
  currency: string;
  rateLabel?: string;
}> = ({ subtotal, cleaningFee, serviceFee, hostAbsorption, pointsDiscount, referralDiscount, total, currency, rateLabel }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between">
      <span className="text-muted-foreground">{rateLabel || 'Subtotal'}</span>
      <span>{subtotal.toLocaleString()} {currency}</span>
    </div>
    {!!cleaningFee && (
      <div className="flex justify-between">
        <span className="text-muted-foreground">Cleaning fee</span>
        <span>{cleaningFee.toLocaleString()} {currency}</span>
      </div>
    )}
    {!!serviceFee && (
      <div className="flex justify-between">
        <span className="text-muted-foreground">Service fee</span>
        <span>{serviceFee.toLocaleString()} {currency}</span>
      </div>
    )}
    {!!hostAbsorption && (
      <div className="flex justify-between text-emerald-600">
        <span>Host absorption</span>
        <span>−{hostAbsorption.toLocaleString()} {currency}</span>
      </div>
    )}
    {!!pointsDiscount && (
      <div className="flex justify-between text-emerald-600">
        <span>Points discount</span>
        <span>−{pointsDiscount.toLocaleString()} {currency}</span>
      </div>
    )}
    {!!referralDiscount && (
      <div className="flex justify-between text-emerald-600">
        <span>Referral discount</span>
        <span>−{referralDiscount.toLocaleString()} {currency}</span>
      </div>
    )}
    <Separator />
    <div className="flex justify-between font-semibold text-base pt-1">
      <span>Total</span>
      <span>{total.toLocaleString()} {currency}</span>
    </div>
  </div>
);

export default BookingPayment;
