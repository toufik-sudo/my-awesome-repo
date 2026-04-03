import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicEventCalendar } from '@/modules/shared/components/calendar/DynamicEventCalendar';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { bookingsApi, type BookingResponse } from '@/modules/bookings/bookings.api';
import { CalendarDays } from 'lucide-react';
import type { CalendarEvent } from '@/modules/shared/components/calendar/types/calendar.types';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  completed: '#6366f1',
  cancelled: '#ef4444',
  rejected: '#dc2626',
  refunded: '#8b5cf6',
  counter_offer: '#f97316',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  completed: 'Terminée',
  cancelled: 'Annulée',
  rejected: 'Rejetée',
  refunded: 'Remboursée',
  counter_offer: 'Contre-offre',
};

export const BookingCalendarPage: React.FC = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingsApi.getHostBookings();
      setBookings(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const events: CalendarEvent[] = useMemo(() =>
    bookings.map(b => ({
      id: b.id,
      title: b.property?.title || `Réservation #${b.id.slice(0, 8)}`,
      description: [
        `${t('bookingCalendar.guest', 'Guest')}: ${b.guest?.firstName || ''} ${b.guest?.lastName || b.guest?.email || ''}`,
        `${t('bookingCalendar.guests', 'Guests')}: ${b.numberOfGuests}`,
        `${t('bookingCalendar.nights', 'Nights')}: ${b.numberOfNights}`,
        `${t('bookingCalendar.total', 'Total')}: ${b.totalPrice?.toLocaleString()} ${b.currency || 'DA'}`,
        `${t('bookingCalendar.payment', 'Payment')}: ${b.paymentMethod} (${b.paymentStatus})`,
        `${t('bookingCalendar.status', 'Status')}: ${STATUS_LABELS[b.status] || b.status}`,
      ].join('\n'),
      startDate: new Date(b.checkInDate),
      endDate: new Date(b.checkOutDate),
      color: STATUS_COLORS[b.status] || '#6b7280',
      category: b.status,
      location: b.property?.city || '',
      metadata: {
        status: b.status,
        totalPrice: b.totalPrice,
        currency: b.currency,
        guests: b.numberOfGuests,
        guestName: `${b.guest?.firstName || ''} ${b.guest?.lastName || ''}`.trim(),
        propertyTitle: b.property?.title,
      },
    })),
    [bookings, t]
  );

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            {t('bookingCalendar.title', 'Calendrier des réservations')}
          </h2>
          <p className="text-muted-foreground">{t('bookingCalendar.subtitle', 'Vue d\'ensemble de toutes les réservations')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(STATUS_LABELS).slice(0, 4).map(([key, label]) => (
            <Badge key={key} variant="outline" className="text-xs gap-1">
              <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: STATUS_COLORS[key] }} />
              {label}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-2">
          <div className="border border-border rounded-lg overflow-hidden">
            <DynamicEventCalendar
              events={events}
              initialView="month"
              showFilters={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
