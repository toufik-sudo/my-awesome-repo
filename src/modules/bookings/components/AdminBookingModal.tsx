import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, addDays, differenceInDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DynamicDatePicker } from '@/modules/shared/components/DynamicDatePicker';
import { UserGuestPicker, type GuestPickerValue } from './UserGuestPicker';
import { bookingsApi, type CreateBookingDto } from '../bookings.api';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';

interface AdminBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyTitle?: string;
  pricePerNight?: number;
  maxGuests?: number;
  onCreated?: (bookingId: string) => void;
}

const PAYMENT_METHODS: { value: CreateBookingDto['paymentMethod']; label: string }[] = [
  { value: 'cib', label: 'CIB / Carte bancaire' },
  { value: 'edahabia', label: 'Edahabia' },
  { value: 'baridi_mob', label: 'Baridi Mob' },
  { value: 'ccp', label: 'CCP' },
  { value: 'bank_transfer', label: 'Virement bancaire' },
  { value: 'cash', label: 'Espèces' },
];

export const AdminBookingModal: React.FC<AdminBookingModalProps> = ({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
  pricePerNight,
  maxGuests = 10,
  onCreated,
}) => {
  const { t } = useTranslation();
  const [guest, setGuest] = useState<GuestPickerValue | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => ({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 3),
  }));
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<CreateBookingDto['paymentMethod']>('cib');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const isManager = (user as any)?.role === 'manager';
  const [bookForSelf, setBookForSelf] = useState(false);

  const nights = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return Math.max(0, differenceInDays(dateRange.to, dateRange.from));
  }, [dateRange]);
  const estimatedTotal = useMemo(() => nights * (pricePerNight ?? 0), [nights, pricePerNight]);

  const reset = () => {
    setGuest(null);
    setMessage('');
    setBookForSelf(false);
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!bookForSelf && !guest) {
      toast.error(t('bookings.adminCreate.errorPickGuest', 'Please pick a guest user.'));
      return;
    }
    if (!dateRange?.from || !dateRange?.to || nights < 1) {
      toast.error(t('bookings.adminCreate.errorDates', 'Pick valid check-in and check-out dates.'));
      return;
    }
    setSubmitting(true);
    try {
      const created = await bookingsApi.create({
        propertyId,
        checkIn: format(dateRange.from, 'yyyy-MM-dd'),
        checkOut: format(dateRange.to, 'yyyy-MM-dd'),
        guests,
        paymentMethod,
        message: message || undefined,
        ...(bookForSelf ? {} : { onBehalfOfGuestId: guest!.id }),
      });
      toast.success(
        bookForSelf
          ? t('bookings.adminCreate.successSelf', 'Booking created. Awaiting host acceptance and payment.')
          : t('bookings.adminCreate.success', 'Booking created. The guest will be notified to validate it before payment.'),
      );
      onCreated?.(created.id);
      reset();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('bookings.adminCreate.errorGeneric', 'Failed to create booking.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            {t('bookings.adminCreate.title', 'Book on behalf of a guest')}
          </DialogTitle>
          <DialogDescription>
            {propertyTitle
              ? t('bookings.adminCreate.descWith', '{{title}} — auto-validated booking; the guest only needs to pay.', { title: propertyTitle })
              : t('bookings.adminCreate.desc', 'The booking is auto-validated. The guest will be notified to complete payment.')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('bookings.adminCreate.guest', 'Guest')}</Label>
            <UserGuestPicker value={guest} onChange={setGuest} disabled={submitting} />
          </div>

          <div className="space-y-2">
            <Label>{t('bookings.adminCreate.dates', 'Dates')}</Label>
            <DynamicDatePicker
              mode="range"
              value={dateRange}
              onDateChange={(v) => setDateRange(v as DateRange)}
              disabled={submitting}
              minDate={new Date()}
            />
            {nights > 0 && (
              <p className="text-xs text-muted-foreground">
                {nights} {t('bookings.nights', 'night(s)')}
                {pricePerNight ? ` · ≈ ${estimatedTotal.toLocaleString()} DA` : ''}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t('bookings.adminCreate.guestsCount', 'Guests')}</Label>
              <Input
                type="number"
                min={1}
                max={maxGuests}
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Math.min(maxGuests, Number(e.target.value) || 1)))}
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('bookings.adminCreate.payment', 'Payment method')}</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} disabled={submitting}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('bookings.adminCreate.message', 'Message (optional)')}</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('bookings.adminCreate.messagePh', 'Internal note shared with the guest…')}
              rows={3}
              disabled={submitting}
            />
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="min-w-[110px]"
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="min-w-[110px]">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('bookings.adminCreate.submit', 'Create & validate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
