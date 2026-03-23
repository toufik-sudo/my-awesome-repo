import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarEvent, CalendarBooking } from './types/calendar.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Minus,
  Plus,
  Loader2,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Banknote,
  Wallet,
} from 'lucide-react';
import { format } from 'date-fns';
import { TransferPaymentFlow } from '@/modules/payments/components/TransferPaymentFlow';

type PaymentMethod = 'ccp' | 'bank_transfer' | 'baridi_mob' | 'edahabia' | 'cib' | 'cash';
type Step = 'details' | 'payment' | 'transfer' | 'success';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode; isTransfer: boolean }[] = [
  { value: 'ccp', label: 'CCP Transfer', icon: <Banknote className="h-4 w-4" />, isTransfer: true },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: <Banknote className="h-4 w-4" />, isTransfer: true },
  { value: 'baridi_mob', label: 'BaridiMob', icon: <Wallet className="h-4 w-4" />, isTransfer: false },
  { value: 'edahabia', label: 'Edahabia', icon: <CreditCard className="h-4 w-4" />, isTransfer: false },
  { value: 'cib', label: 'CIB Card', icon: <CreditCard className="h-4 w-4" />, isTransfer: false },
  { value: 'cash', label: 'Cash (Hand to Hand)', icon: <Wallet className="h-4 w-4" />, isTransfer: false },
];

interface BookingModalProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (event: CalendarEvent, quantity: number, notes?: string) => Promise<CalendarBooking>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  event,
  open,
  onOpenChange,
  onBook,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('details');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ccp');
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<CalendarBooking | null>(null);

  const resetState = useCallback(() => {
    setStep('details');
    setQuantity(1);
    setNotes('');
    setPaymentMethod('ccp');
    setIsLoading(false);
    setBooking(null);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onOpenChange(false);
  }, [resetState, onOpenChange]);

  if (!event) return null;

  const availableSpots = event.capacity ? event.capacity - (event.bookedCount || 0) : Infinity;
  const totalPrice = (event.price || 0) * quantity;
  const selectedMethod = PAYMENT_METHODS.find(m => m.value === paymentMethod);

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= Math.min(availableSpots, 10)) {
      setQuantity(newQty);
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      const result = await onBook(event, quantity, notes);
      setBooking(result);
      if (selectedMethod?.isTransfer) {
        setStep('transfer');
      } else {
        setStep('success');
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceiptUploaded = () => {
    setStep('success');
  };

  // --- Step: Success ---
  if (step === 'success' && booking) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle>{t('booking.confirmed')}</DialogTitle>
              <DialogDescription>
                {t('booking.confirmDescription', { title: event.title })}
              </DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('booking.bookingId')}: <span className="font-mono text-foreground">{booking.id}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {t('booking.quantity')}: {booking.quantity} {t('booking.tickets')}
              </p>
              <p className="text-lg font-semibold text-primary">
                {t('booking.total')}: {event.currency || '$'}{booking.totalPrice.toFixed(2)}
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              {t('booking.done')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // --- Step: Transfer Receipt Upload ---
  if (step === 'transfer' && booking) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setStep('success')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle>Complete Your Payment</DialogTitle>
                <DialogDescription>
                  Transfer the amount and upload your receipt for verification.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <TransferPaymentFlow
            bookingId={booking.id}
            totalAmount={totalPrice}
            onReceiptUploaded={handleReceiptUploaded}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // --- Step: Payment Method Selection ---
  if (step === 'payment') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setStep('details')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle>Choose Payment Method</DialogTitle>
                <DialogDescription>Select how you'd like to pay for your booking.</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Order summary */}
            <div className="p-3 rounded-lg bg-muted/50 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">{quantity} {t('booking.tickets')}</p>
              </div>
              <p className="text-lg font-bold text-primary">
                {totalPrice === 0 ? t('booking.free') : `${event.currency || '$'}${totalPrice.toFixed(2)}`}
              </p>
            </div>

            <Separator />

            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} className="space-y-2">
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    paymentMethod === method.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <RadioGroupItem value={method.value} />
                  <span className="text-muted-foreground">{method.icon}</span>
                  <span className="text-sm font-medium text-foreground">{method.label}</span>
                  {method.isTransfer && (
                    <Badge variant="secondary" className="ml-auto text-xs">Receipt required</Badge>
                  )}
                </label>
              ))}
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStep('details')}>{t('common.cancel')}</Button>
            <Button onClick={handleConfirmBooking} disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
              ) : (
                <><DollarSign className="h-4 w-4 mr-1" />{t('booking.confirmBooking')}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // --- Step: Booking Details (default) ---
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('booking.title')}</DialogTitle>
          <DialogDescription>{t('booking.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-lg bg-muted/50">
            {event.imageUrl && (
              <img src={event.imageUrl} alt={event.title} className="w-20 h-20 object-cover rounded-md" />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{event.title}</h4>
              {event.category && (
                <Badge variant="secondary" className="mt-1" style={{ backgroundColor: event.color }}>
                  {event.category}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>{t('booking.numberOfTickets')}</Label>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= Math.min(availableSpots, 10)}>
                <Plus className="h-4 w-4" />
              </Button>
              {event.capacity && (
                <span className="text-sm text-muted-foreground">
                  <Users className="h-4 w-4 inline mr-1" />
                  {availableSpots} {t('booking.available')}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('booking.specialRequests')}</Label>
            <Textarea id="notes" placeholder={t('booking.specialRequestsPlaceholder')} value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('booking.pricePerTicket')}</span>
              <span>{event.price === 0 ? t('booking.free') : `${event.currency || '$'}${(event.price || 0).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('booking.quantity')}</span>
              <span>× {quantity}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>{t('booking.total')}</span>
              <span className="text-primary">{totalPrice === 0 ? t('booking.free') : `${event.currency || '$'}${totalPrice.toFixed(2)}`}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>{t('common.cancel')}</Button>
          <Button onClick={() => setStep('payment')}>
            Continue to Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
