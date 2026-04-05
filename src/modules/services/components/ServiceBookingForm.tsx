import React, { useState, useMemo, useCallback } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useTranslation } from 'react-i18next';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Users, Clock, CreditCard, Minus, Plus, AlertCircle, CheckCircle2, Shield, Coins } from 'lucide-react';
import type { TourismService } from '@/types/tourism-service.types';
import type { ServiceAvailabilitySlot } from '../service-bookings.api';

interface ServiceBookingFormProps {
  service: TourismService;
  availability?: ServiceAvailabilitySlot[];
  onSubmit: (data: {
    bookingDate: string;
    startTime?: string;
    participants: number;
    childParticipants: number;
    paymentMethod: string;
    message?: string;
    usePoints?: boolean;
    pointsToUse?: number;
  }) => void;
  loading?: boolean;
  /** Calculated service fee from backend */
  serviceFee?: number;
  /** Host absorption amount (fee covered by host) */
  hostAbsorption?: number;
  /** Available points for the guest */
  availablePoints?: number;
  /** Points value in DA */
  pointsValueDA?: number;
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces' },
  { value: 'ccp', label: 'CCP' },
  { value: 'baridi_mob', label: 'BaridiMob' },
  { value: 'edahabia', label: 'Edahabia' },
  { value: 'cib', label: 'CIB' },
  { value: 'bank_transfer', label: 'Virement bancaire' },
];

export const ServiceBookingForm: React.FC<ServiceBookingFormProps> = ({
  service,
  availability = [],
  onSubmit,
  loading,
  serviceFee = 0,
  hostAbsorption = 0,
  availablePoints = 0,
  pointsValueDA = 0,
}) => {
  const { t, i18n } = useTranslation();
  const { canMakeBooking } = usePermissions();
  const lang = i18n.language || 'fr';

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>('');
  const [participants, setParticipants] = useState(service.minParticipants);
  const [childParticipants, setChildParticipants] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [message, setMessage] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  const blockedDates = useMemo(() => 
    availability.filter(a => a.isBlocked).map(a => new Date(a.date)),
    [availability]
  );

  const selectedAvail = useMemo(() => {
    if (!selectedDate) return null;
    return availability.find(a => isSameDay(new Date(a.date), selectedDate));
  }, [selectedDate, availability]);

  const timeSlots = useMemo(() => {
    if (selectedAvail?.timeSlots?.length) return selectedAvail.timeSlots;
    return service.schedule?.timeSlots || [];
  }, [selectedAvail, service]);

  const effectivePrice = selectedAvail?.customPrice || service.price;
  const childPrice = service.priceChild || effectivePrice;
  const totalParticipants = participants + childParticipants;

  const subtotal = effectivePrice * participants + childPrice * childParticipants;
  const discount = service.groupDiscount && totalParticipants >= 5 ? service.groupDiscount : 0;
  const discountedSubtotal = subtotal * (1 - discount / 100);
  
  // Fee breakdown
  const effectiveFee = Math.max(0, serviceFee - hostAbsorption);
  const pointsDiscount = usePoints ? Math.min(pointsToUse * (pointsValueDA || 1), discountedSubtotal) : 0;
  const total = discountedSubtotal + effectiveFee - pointsDiscount;

  const canBook = selectedDate && participants >= service.minParticipants && totalParticipants <= service.maxParticipants;

  const slotsAvailable = selectedAvail?.maxSlots 
    ? selectedAvail.maxSlots - selectedAvail.bookedSlots 
    : null;

  const handleSubmit = useCallback(() => {
    if (!selectedDate) return;
    onSubmit({
      bookingDate: format(selectedDate, 'yyyy-MM-dd'),
      startTime: startTime || undefined,
      participants,
      childParticipants,
      paymentMethod,
      message: message || undefined,
      usePoints: usePoints || undefined,
      pointsToUse: usePoints ? pointsToUse : undefined,
    });
  }, [selectedDate, startTime, participants, childParticipants, paymentMethod, message, onSubmit, usePoints, pointsToUse]);

  const isDateDisabled = useCallback((date: Date) => {
    if (isBefore(date, new Date())) return true;
    return blockedDates.some(bd => isSameDay(bd, date));
  }, [blockedDates]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Réserver ce service
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Date de réservation</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={isDateDisabled}
            locale={fr}
            className={cn("p-3 pointer-events-auto rounded-md border")}
          />
          {selectedDate && slotsAvailable !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant={slotsAvailable > 0 ? 'secondary' : 'destructive'}>
                {slotsAvailable > 0 ? `${slotsAvailable} places restantes` : 'Complet'}
              </Badge>
            </div>
          )}
        </div>

        {/* Time Slots */}
        {timeSlots.length > 0 && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Horaire
            </Label>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot: string) => (
                <Button
                  key={slot}
                  variant={startTime === slot ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStartTime(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Participants */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Participants
          </Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Adultes</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setParticipants(Math.max(service.minParticipants, participants - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{participants}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setParticipants(Math.min(service.maxParticipants - childParticipants, participants + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {service.priceChild !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Enfants</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setChildParticipants(Math.max(0, childParticipants - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{childParticipants}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setChildParticipants(Math.min(service.maxParticipants - participants, childParticipants + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Min: {service.minParticipants} — Max: {service.maxParticipants}
          </p>
        </div>

        {/* Detailed Price Breakdown */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground mb-2">{t('serviceBooking.priceBreakdown', 'Récapitulatif du prix')}</p>
          
          <div className="flex justify-between text-sm">
            <span>{effectivePrice.toLocaleString()} DA × {participants} {t('serviceBooking.adults', 'adulte(s)')}</span>
            <span>{(effectivePrice * participants).toLocaleString()} DA</span>
          </div>
          {childParticipants > 0 && (
            <div className="flex justify-between text-sm">
              <span>{childPrice.toLocaleString()} DA × {childParticipants} {t('serviceBooking.children', 'enfant(s)')}</span>
              <span>{(childPrice * childParticipants).toLocaleString()} DA</span>
            </div>
          )}
          
          <div className="border-t border-border pt-2 flex justify-between text-sm">
            <span className="font-medium">{t('serviceBooking.subtotal', 'Sous-total')}</span>
            <span>{Math.round(subtotal).toLocaleString()} DA</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>{t('serviceBooking.groupDiscount', 'Réduction groupe')} (-{discount}%)</span>
              <span>-{(subtotal * discount / 100).toLocaleString()} DA</span>
            </div>
          )}

          {serviceFee > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('serviceBooking.serviceFee', 'Frais de service')}</span>
              <span>+{serviceFee.toLocaleString()} DA</span>
            </div>
          )}

          {hostAbsorption > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {t('serviceBooking.hostAbsorption', 'Frais pris en charge par l\'hôte')}
              </span>
              <span>-{hostAbsorption.toLocaleString()} DA</span>
            </div>
          )}

          {usePoints && pointsDiscount > 0 && (
            <div className="flex justify-between text-sm text-primary">
              <span className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                {t('serviceBooking.pointsDiscount', 'Réduction points')} ({pointsToUse} pts)
              </span>
              <span>-{Math.round(pointsDiscount).toLocaleString()} DA</span>
            </div>
          )}

          <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
            <span>{t('serviceBooking.total', 'Total')}</span>
            <span className="text-primary">{Math.round(total).toLocaleString()} DA</span>
          </div>
        </div>

        {/* Points usage */}
        {availablePoints > 0 && (
          <div className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4 text-primary" />
                {t('serviceBooking.usePoints', 'Utiliser mes points')} ({availablePoints} {t('serviceBooking.available', 'disponibles')})
              </Label>
              <input type="checkbox" checked={usePoints} onChange={e => { setUsePoints(e.target.checked); if (!e.target.checked) setPointsToUse(0); }} className="rounded" />
            </div>
            {usePoints && (
              <Input
                type="number"
                min={0}
                max={availablePoints}
                value={pointsToUse}
                onChange={e => setPointsToUse(Math.min(availablePoints, parseInt(e.target.value) || 0))}
                placeholder={t('serviceBooking.pointsAmount', 'Nombre de points')}
              />
            )}
          </div>
        )}

        {/* Payment */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Mode de paiement
          </Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map(pm => (
                <SelectItem key={pm.value} value={pm.value}>{pm.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label>Message (optionnel)</Label>
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Un message pour le prestataire..."
            rows={3}
          />
        </div>

        {/* Submit */}
        <Button
          className="w-full"
          size="lg"
          disabled={!canBook || loading || (slotsAvailable !== null && slotsAvailable <= 0)}
          onClick={handleSubmit}
        >
          {loading ? 'Réservation en cours...' : `Réserver — ${Math.round(total).toLocaleString()} DA`}
        </Button>

        {totalParticipants > service.maxParticipants && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Maximum {service.maxParticipants} participants</span>
          </div>
        )}

        {service.cancellationPolicy && (
          <p className="text-xs text-muted-foreground text-center">
            Politique d'annulation : {service.cancellationPolicy}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
