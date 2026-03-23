import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays, addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { 
  Star, 
  Minus, 
  Plus, 
  Loader2, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Shield, 
  HandCoins,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { DynamicDatePicker } from '@/modules/shared/components/DynamicDatePicker';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsApi, type CreateBookingDto } from '@/modules/bookings/bookings.api';
import { toast } from 'sonner';
import { type PaymentMethodType } from '@/modules/shared/components/PricingBreakdownSection';

interface BookingWidgetProps {
  propertyId: string;
  pricePerNight: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  customDiscount?: number;
  customDiscountMinNights?: number;
  maxGuests: number;
  rating: number;
  reviewCount: number;
  acceptedPaymentMethods?: PaymentMethodType[];
}

// Payment method configuration with mapping to API values
const PAYMENT_METHOD_CONFIG: Record<PaymentMethodType, {
  label: string;
  icon: React.ComponentType<any>;
  apiValue: CreateBookingDto['paymentMethod'];
  description: string;
}> = {
  visa_master: { 
    label: 'VISA / MasterCard', 
    icon: CreditCard, 
    apiValue: 'cib',
    description: 'International credit/debit cards'
  },
  dahabia: { 
    label: 'Edahabia', 
    icon: Smartphone, 
    apiValue: 'edahabia',
    description: 'Algérie Poste electronic card'
  },
  algiers_bank: { 
    label: 'CIB (Algiers Bank)', 
    icon: Banknote, 
    apiValue: 'cib',
    description: 'Inter-bank card payment'
  },
  postal_bank_transfer: { 
    label: 'Postal / Bank Transfer', 
    icon: Banknote, 
    apiValue: 'ccp',
    description: 'CCP, Baridi Mob, bank wire'
  },
  hand_to_hand: { 
    label: 'Hand to Hand (Cash)', 
    icon: HandCoins, 
    apiValue: 'cash',
    description: 'Cash payment on arrival'
  },
};

export const BookingWidget: React.FC<BookingWidgetProps> = React.memo(({
  propertyId,
  pricePerNight,
  pricePerWeek,
  pricePerMonth,
  weeklyDiscount,
  monthlyDiscount,
  customDiscount,
  customDiscountMinNights,
  maxGuests,
  rating,
  reviewCount,
  acceptedPaymentMethods = ['dahabia', 'algiers_bank', 'postal_bank_transfer'], // Default methods
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(() => {
    // Use first accepted payment method as default
    return (acceptedPaymentMethods.length > 0 ? acceptedPaymentMethods[0] : 'dahabia') as PaymentMethodType;
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const nights = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from);
  }, [dateRange]);

  // Calculate effective rate and discounts
  const pricing = useMemo(() => {
    if (nights === 0) return { effectiveRate: pricePerNight, discount: 0, discountType: '' };

    // Monthly rate (28+ nights)
    if (nights >= 28) {
      if (pricePerMonth) {
        const monthlyRate = pricePerMonth / 30;
        return {
          effectiveRate: monthlyRate,
          discount: ((pricePerNight - monthlyRate) / pricePerNight) * 100,
          discountType: 'Monthly rate'
        };
      }
      if (monthlyDiscount) {
        const discountedRate = pricePerNight * (1 - monthlyDiscount / 100);
        return {
          effectiveRate: discountedRate,
          discount: monthlyDiscount,
          discountType: 'Monthly discount'
        };
      }
    }

    // Weekly rate (7+ nights)
    if (nights >= 7) {
      if (pricePerWeek) {
        const weeklyRate = pricePerWeek / 7;
        return {
          effectiveRate: weeklyRate,
          discount: ((pricePerNight - weeklyRate) / pricePerNight) * 100,
          discountType: 'Weekly rate'
        };
      }
      if (weeklyDiscount) {
        const discountedRate = pricePerNight * (1 - weeklyDiscount / 100);
        return {
          effectiveRate: discountedRate,
          discount: weeklyDiscount,
          discountType: 'Weekly discount'
        };
      }
    }

    // Custom discount
    if (customDiscount && customDiscountMinNights && nights >= customDiscountMinNights) {
      const discountedRate = pricePerNight * (1 - customDiscount / 100);
      return {
        effectiveRate: discountedRate,
        discount: customDiscount,
        discountType: `${customDiscountMinNights}+ nights discount`
      };
    }

    return { effectiveRate: pricePerNight, discount: 0, discountType: '' };
  }, [nights, pricePerNight, pricePerWeek, pricePerMonth, weeklyDiscount, monthlyDiscount, customDiscount, customDiscountMinNights]);

  const subtotal = Math.round(nights * pricing.effectiveRate);
  const serviceFeeRate = paymentMethod === 'hand_to_hand' ? 2.5 : 5; // Split fee for cash
  const serviceFee = Math.round(subtotal * (serviceFeeRate / 100));
  const total = subtotal + serviceFee;

  // Filter available payment methods
  const availablePaymentMethods = acceptedPaymentMethods
    .filter((method): method is PaymentMethodType => method in PAYMENT_METHOD_CONFIG)
    .map(method => ({
      ...PAYMENT_METHOD_CONFIG[method],
      value: method
    }));

  const handleBookClick = useCallback(() => {
    if (!isAuthenticated) {
      toast.error(t('propertyDetail.loginRequired', 'Connectez-vous pour réserver'));
      navigate('/login');
      return;
    }
    if (!dateRange?.from || !dateRange?.to) {
      toast.error(t('propertyDetail.selectDates', 'Veuillez sélectionner vos dates'));
      return;
    }
    setConfirmOpen(true);
  }, [isAuthenticated, dateRange, navigate, t]);

  const handleConfirmBooking = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    setIsSubmitting(true);
    try {
      const booking = await bookingsApi.create({
        propertyId,
        checkIn: format(dateRange.from, 'yyyy-MM-dd'),
        checkOut: format(dateRange.to, 'yyyy-MM-dd'),
        guests,
        paymentMethod: PAYMENT_METHOD_CONFIG[paymentMethod]?.apiValue || 'ccp',
        message: message.trim() || undefined,
      });
      setBookingId(booking.id);
      setBookingSuccess(true);
      toast.success(t('propertyDetail.bookingSuccess', 'Demande de réservation envoyée!'));
    } catch {
      toast.error(t('propertyDetail.bookingError', 'Erreur lors de la réservation'));
    } finally {
      setIsSubmitting(false);
    }
  }, [dateRange, guests, paymentMethod, message, propertyId, t]);

  const handleCloseSuccess = useCallback(() => {
    setConfirmOpen(false);
    setBookingSuccess(false);
    setBookingId(null);
    setMessage('');
  }, []);

  return (
    <>
      {/* Desktop Booking Card */}
      <Card className="sticky top-24 shadow-lg border-2">
        <CardHeader className="pb-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">
                {pricePerNight.toLocaleString()} DA
              </span>
              <span className="text-muted-foreground">/{t('byootdz.perNight')}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{rating}</span>
              <span className="text-muted-foreground">({reviewCount})</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range Picker */}
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {t('propertyDetail.dates', 'Dates de séjour')}
            </Label>
            <DynamicDatePicker
              mode="range"
              value={dateRange}
              onDateChange={(d) => setDateRange(d as DateRange | undefined)}
              placeholder={t('propertyDetail.selectDates', 'Sélectionner les dates')}
              minDate={new Date()}
            />
          </div>

          {/* Guest Selection */}
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {t('propertyDetail.guests')}
            </Label>
            <div className="flex items-center justify-between px-3 py-2 border rounded-lg bg-background">
              <span className="text-sm">
                {guests} {guests > 1 ? t('propertyDetail.guests') : t('propertyDetail.guest', 'voyageur')}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{guests}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                  disabled={guests >= maxGuests}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('propertyDetail.maxGuests', 'Maximum')} {maxGuests} {t('propertyDetail.guests')}
            </p>
          </div>

          {/* Book Button */}
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handleBookClick}
            disabled={!dateRange?.from || !dateRange?.to}
          >
            {nights > 0
              ? t('propertyDetail.bookNow')
              : t('propertyDetail.selectDates', 'Sélectionner les dates')}
          </Button>

          {/* Price Breakdown */}
          {nights > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="underline cursor-help">
                  {pricing.effectiveRate.toFixed(0).toLocaleString()} DA × {nights} {t('propertyDetail.nights')}
                </span>
                <span>{subtotal.toLocaleString()} DA</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{pricing.discountType}</span>
                  <span>-{pricing.discount.toFixed(0)}%</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="underline cursor-help">
                  {t('propertyDetail.serviceFee')} 
                  {paymentMethod === 'hand_to_hand' && ' (2.5% split)'}
                </span>
                <span>{serviceFee.toLocaleString()} DA</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>{t('propertyDetail.total')}</span>
                <span>{total.toLocaleString()} DA</span>
              </div>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground">
            {t('propertyDetail.noChargeYet')}
          </p>
        </CardContent>
      </Card>

      {/* Booking Confirmation Modal */}
      <DynamicModal
        open={confirmOpen}
        onOpenChange={(o) => { if (!o && !isSubmitting) handleCloseSuccess(); }}
        title={bookingSuccess
          ? t('propertyDetail.bookingConfirmed', 'Réservation envoyée!')
          : t('propertyDetail.confirmBooking', 'Confirmer la réservation')}
        size="md"
      >
        {bookingSuccess ? (
          /* ─── Success State ─────────────────────────────────────── */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {t('propertyDetail.requestSent', 'Demande envoyée avec succès!')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('propertyDetail.hostWillReply', "L'hôte reviendra vers vous sous 24h.")}
              </p>
            </div>
            {bookingId && (
              <Badge variant="outline" className="text-xs">
                Réf: {bookingId.slice(0, 8).toUpperCase()}
              </Badge>
            )}
            <div className="pt-2 space-y-2">
              <Button className="w-full" onClick={handleCloseSuccess}>
                {t('common.close', 'Fermer')}
              </Button>
            </div>
          </div>
        ) : (
          /* ─── Confirmation Form ─────────────────────────────────── */
          <div className="space-y-5">
            {/* Booking Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('propertyDetail.dates', 'Dates')}</span>
                  <span className="font-medium">
                    {dateRange?.from && format(dateRange.from, 'dd MMM')} → {dateRange?.to && format(dateRange.to, 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('propertyDetail.guests')}</span>
                  <span className="font-medium">{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('propertyDetail.nights')}</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>{t('propertyDetail.total')}</span>
                  <span className="text-primary">{total.toLocaleString()} DA</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                {t('propertyDetail.paymentMethod', 'Mode de paiement')}
              </Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethodType)}
                className="grid grid-cols-2 gap-2"
              >
                {availablePaymentMethods.map(({ value, label, icon: Icon }) => (
                  <Label
                    key={value}
                    htmlFor={value}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <RadioGroupItem value={value} id={value} className="sr-only" />
                    <Icon className={`h-4 w-4 ${paymentMethod === value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">{label}</span>
                  </Label>
                ))}
              </RadioGroup>
              {paymentMethod === 'hand_to_hand' && (
                <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-lg">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800 space-y-1">
                      <p className="font-medium">Hand-to-hand payment notice:</p>
                      <p>Service fee split 50/50 (you pay 2.5% online). You assume full responsibility for cash transactions.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message to Host */}
            <div>
              <Label className="text-sm font-semibold mb-1.5 block">
                {t('propertyDetail.messageToHost', "Message à l'hôte")}
                <span className="text-muted-foreground font-normal ml-1">({t('common.optional', 'optionnel')})</span>
              </Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder={t('propertyDetail.messagePlaceholder', 'Présentez-vous et indiquez le motif de votre séjour...')}
                className="resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{message.length}/500</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmOpen(false)}
                disabled={isSubmitting}
              >
                {t('common.cancel', 'Annuler')}
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('common.loading', 'Envoi...')}
                  </>
                ) : (
                  t('propertyDetail.confirmAndPay', 'Confirmer la réservation')
                )}
              </Button>
            </div>
          </div>
        )}
      </DynamicModal>
    </>
  );
});

BookingWidget.displayName = 'BookingWidget';
