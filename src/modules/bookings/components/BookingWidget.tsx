import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays, addDays, addMonths, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useQuery } from '@tanstack/react-query';
import { 
  Star, 
  Loader2, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Shield, 
  HandCoins,
  AlertTriangle,
  Sparkles,
  Bell,
  BellOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DynamicDatePicker } from '@/modules/shared/components/DynamicDatePicker';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { GuestSelector, type GuestBreakdown } from './GuestSelector';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsApi, type CreateBookingDto } from '@/modules/bookings/bookings.api';
import { propertiesApi } from '@/modules/properties/properties.api';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
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
  allowPets?: boolean;
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
  baridi_mob: {
    label: 'Baridi Mob',
    icon: Smartphone,
    apiValue: 'ccp',
    description: 'Mobile payment via Algérie Poste app'
  },
  ccp: {
    label: 'CCP',
    icon: Banknote,
    apiValue: 'ccp',
    description: 'Compte CCP (Algérie Poste)'
  },
  cib: {
    label: 'CIB',
    icon: CreditCard,
    apiValue: 'cib',
    description: 'Carte Interbancaire (Algérie)'
  },
  bank_transfer: {
    label: 'Bank Transfer',
    icon: Banknote,
    apiValue: 'ccp',
    description: 'Domestic or international bank transfer'
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
  acceptedPaymentMethods = ['dahabia', 'algiers_bank', 'postal_bank_transfer'],
  allowPets = false,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guestBreakdown, setGuestBreakdown] = useState<GuestBreakdown>({
    adults: 2, children: 0, babies: 0, pets: 0,
  });
  const guests = guestBreakdown.adults + guestBreakdown.children;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(() => {
    return (acceptedPaymentMethods.length > 0 ? acceptedPaymentMethods[0] : 'dahabia') as PaymentMethodType;
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [promoNotifOpen, setPromoNotifOpen] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPhone, setNotifPhone] = useState(false);

  // Windowed availability fetching — 3-month chunks
  const [availWindow, setAvailWindow] = useState(() => {
    const now = new Date();
    return {
      from: format(now, 'yyyy-MM-dd'),
      to: format(addMonths(now, 3), 'yyyy-MM-dd'),
    };
  });

  const { data: availabilityData = [] } = useQuery({
    queryKey: ['property-availability', propertyId, availWindow.from, availWindow.to],
    queryFn: () => propertiesApi.getAvailability(propertyId, availWindow.from, availWindow.to),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
  });

  // Track all loaded availability across windows
  const [allAvailability, setAllAvailability] = useState<typeof availabilityData>([]);

  useEffect(() => {
    if (availabilityData.length > 0) {
      setAllAvailability(prev => {
        const existingDates = new Set(prev.map(a => a.date));
        const newEntries = availabilityData.filter(a => !existingDates.has(a.date));
        return [...prev, ...newEntries];
      });
    }
  }, [availabilityData]);

  /** Called when user scrolls calendar past current window */
  const handleCalendarMonthChange = useCallback((month: Date) => {
    const windowEnd = parseISO(availWindow.to);
    if (month > windowEnd || differenceInDays(month, windowEnd) > -30) {
      // Load next 3-month chunk
      const newFrom = format(addMonths(windowEnd, 0), 'yyyy-MM-dd');
      const newTo = format(addMonths(windowEnd, 3), 'yyyy-MM-dd');
      setAvailWindow({ from: newFrom, to: newTo });
    }
  }, [availWindow.to]);

  // Blocked/booked dates
  const disabledDates = useMemo(() => {
    return allAvailability
      .filter(a => a.isBlocked)
      .map(a => parseISO(a.date));
  }, [allAvailability]);

  // Promo dates (dates with custom lower price)
  const promoDates = useMemo(() => {
    return allAvailability
      .filter(a => a.customPrice !== null && a.customPrice < pricePerNight && !a.isBlocked)
      .map(a => ({ date: parseISO(a.date), price: a.customPrice! }));
  }, [allAvailability, pricePerNight]);

  const hasPromos = promoDates.length > 0;

  const handleGoToPromo = useCallback(() => {
    if (promoDates.length === 0) return;
    // Set date range to first promo date
    const firstPromo = promoDates[0].date;
    setDateRange({ from: firstPromo, to: addDays(firstPromo, 1) });
  }, [promoDates]);

  const handleSubscribePromo = useCallback(async () => {
    try {
      await propertiesApi.subscribePromoAlert(propertyId, {
        notifyEmail: notifEmail,
        notifyPhone: notifPhone,
      });
      toast.success(t('propertyDetail.promoSubscribed', 'Vous serez notifié des promotions!'));
    } catch {
      toast.error(t('propertyDetail.promoSubscribeError', 'Erreur lors de l\'inscription'));
    }
    setPromoNotifOpen(false);
  }, [t, propertyId, notifEmail, notifPhone]);

  const nights = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from);
  }, [dateRange]);

  // Calculate effective rate and discounts
  const pricing = useMemo(() => {
    const ppn = Number(pricePerNight) || 0;
    const ppw = Number(pricePerWeek) || 0;
    const ppm = Number(pricePerMonth) || 0;
    const wd = Number(weeklyDiscount) || 0;
    const md = Number(monthlyDiscount) || 0;
    const cd = Number(customDiscount) || 0;
    const cdMin = Number(customDiscountMinNights) || 0;

    if (nights === 0) return { effectiveRate: ppn, discount: 0, discountType: '' };

    // Monthly rate (28+ nights)
    if (nights >= 28) {
      if (ppm > 0) {
        const monthlyRate = ppm / 30;
        return {
          effectiveRate: monthlyRate,
          discount: ((ppn - monthlyRate) / ppn) * 100,
          discountType: 'Monthly rate'
        };
      }
      if (md > 0) {
        const discountedRate = ppn * (1 - md / 100);
        return {
          effectiveRate: discountedRate,
          discount: md,
          discountType: 'Monthly discount'
        };
      }
    }

    // Weekly rate (7+ nights)
    if (nights >= 7) {
      if (ppw > 0) {
        const weeklyRate = ppw / 7;
        return {
          effectiveRate: weeklyRate,
          discount: ((ppn - weeklyRate) / ppn) * 100,
          discountType: 'Weekly rate'
        };
      }
      if (wd > 0) {
        const discountedRate = ppn * (1 - wd / 100);
        return {
          effectiveRate: discountedRate,
          discount: wd,
          discountType: 'Weekly discount'
        };
      }
    }

    // Custom discount
    if (cd > 0 && cdMin > 0 && nights >= cdMin) {
      const discountedRate = ppn * (1 - cd / 100);
      return {
        effectiveRate: discountedRate,
        discount: cd,
        discountType: `${cdMin}+ nights discount`
      };
    }

    return { effectiveRate: ppn, discount: 0, discountType: '' };
  }, [nights, pricePerNight, pricePerWeek, pricePerMonth, weeklyDiscount, monthlyDiscount, customDiscount, customDiscountMinNights]);

  const subtotal = Math.round(nights * pricing.effectiveRate);
  const cleaningFee = 0; // Could be set per property

  // Use backend fee calculation if available, fallback to local calculation
  const { data: feeCalcData } = useQuery({
    queryKey: ['service-fee-calc', propertyId, subtotal],
    queryFn: () => import('@/modules/admin/service-fees.api').then(m => 
      m.serviceFeesApi.calculate({ hostId: 0, propertyId, amount: subtotal })
    ),
    enabled: subtotal > 0,
    staleTime: 30_000,
    retry: false,
  });

  const serviceFeeRate = paymentMethod === 'hand_to_hand' ? 2.5 : 5;
  const serviceFee = feeCalcData?.fee ?? Math.round(subtotal * (serviceFeeRate / 100));
  const total = subtotal + serviceFee + cleaningFee;

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
              disabledDates={disabledDates}
            />
            {/* Promo & Notification Buttons */}
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-xs"
                disabled={!hasPromos}
                onClick={handleGoToPromo}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {hasPromos
                  ? t('propertyDetail.viewPromos', 'Voir les promos')
                  : t('propertyDetail.noPromos', 'Pas de promos')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-xs"
                onClick={() => setPromoNotifOpen(true)}
              >
                <Bell className="h-3.5 w-3.5" />
                {t('propertyDetail.promoAlert', 'Alerte promo')}
              </Button>
            </div>
          </div>

          {/* Guest Selection */}
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {t('propertyDetail.guests', 'Voyageurs')}
            </Label>
            <GuestSelector
              value={guestBreakdown}
              onChange={setGuestBreakdown}
              maxGuests={maxGuests}
              allowPets={allowPets}
            />
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

      {/* Promo Notification Modal */}
      <DynamicModal
        open={promoNotifOpen}
        onOpenChange={setPromoNotifOpen}
        title={t('propertyDetail.promoNotifTitle', 'Alertes promotions')}
        size="sm"
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            {t('propertyDetail.promoNotifDesc', 'Recevez une notification dès qu\'une promotion est disponible sur cette propriété.')}
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={notifEmail}
                onCheckedChange={(c) => setNotifEmail(!!c)}
              />
              <span className="text-sm">{t('propertyDetail.notifByEmail', 'Par email')}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={notifPhone}
                onCheckedChange={(c) => setNotifPhone(!!c)}
              />
              <span className="text-sm">{t('propertyDetail.notifByPhone', 'Par téléphone (SMS)')}</span>
            </label>
          </div>
          <Button
            className="w-full gap-2"
            onClick={handleSubscribePromo}
            disabled={!notifEmail && !notifPhone}
          >
            <Bell className="h-4 w-4" />
            {t('propertyDetail.subscribePromo', 'Activer les alertes')}
          </Button>
        </div>
      </DynamicModal>
    </>
  );
});

BookingWidget.displayName = 'BookingWidget';
