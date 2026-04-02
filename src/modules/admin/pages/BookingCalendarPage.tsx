import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicEventCalendar } from '@/modules/shared/components/calendar/DynamicEventCalendar';
import { DynamicFilter, FilterConfig, ActiveFilter } from '@/modules/shared/components/DynamicFilter';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { bookingsApi, type BookingResponse } from '@/modules/bookings/bookings.api';
import { propertiesApi } from '@/modules/properties/properties.api';
import { tourismServicesApi } from '@/modules/services/services.api';
import { groupsApi } from '@/modules/admin/admin.api';
import { serviceGroupsApi } from '@/modules/services/service-bookings.api';
import { rolesApi } from '@/modules/admin/admin.api';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarDays, Filter, Users, Building2, Compass, FolderKanban } from 'lucide-react';
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
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPropertyIds, setFilterPropertyIds] = useState<string[]>([]);
  const [filterGroupIds, setFilterGroupIds] = useState<string[]>([]);
  const [filterHostIds, setFilterHostIds] = useState<string[]>([]);

  // Data for filter dropdowns
  const [properties, setProperties] = useState<Array<{ id: string; title: string }>>([]);
  const [services, setServices] = useState<Array<{ id: string; title: string }>>([]);
  const [propertyGroups, setPropertyGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [serviceGroups, setServiceGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [hosts, setHosts] = useState<Array<{ id: string; label: string }>>([]);

  const isHyper = useMemo(() =>
    user?.roles?.some(r => ['hyper_admin', 'hyper_manager'].includes(r)) ?? false,
    [user]
  );

  const loadFilterData = useCallback(async () => {
    try {
      const [propsRes, svcRes, pGroupsRes, sGroupsRes] = await Promise.all([
        propertiesApi.getAll({ limit: 200 }).catch(() => []),
        tourismServicesApi.getAll({ limit: 200 }).catch(() => ({ data: [] })),
        groupsApi.getAll().catch(() => []),
        serviceGroupsApi.getAll().catch(() => []),
      ]);
      const props = Array.isArray(propsRes) ? propsRes : (propsRes as any).data || [];
      setProperties(props.map((p: any) => ({ id: p.id, title: p.title })));
      const svcs = Array.isArray(svcRes) ? svcRes : (svcRes as any).data || [];
      setServices(svcs.map((s: any) => ({
        id: s.id,
        title: typeof s.title === 'string' ? s.title : Object.values(s.title || {})[0] || s.id
      })));
      setPropertyGroups(pGroupsRes.map((g: any) => ({ id: g.id, name: g.name })));
      setServiceGroups(sGroupsRes.map((g: any) => ({ id: g.id, name: g.name })));

      if (isHyper) {
        const users = await rolesApi.getAllUsers().catch(() => []);
        const hostUsers = users.filter((u: any) =>
          u.roles?.some((r: string) => ['admin', 'manager'].includes(r))
        );
        setHosts(hostUsers.map((u: any) => ({
          id: String(u.id),
          label: `${u.firstName || ''} ${u.lastName || ''} (${u.email})`.trim()
        })));
      }
    } catch { /* silent */ }
  }, [isHyper]);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingsApi.getHostBookings();
      setBookings(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadBookings(); loadFilterData(); }, [loadBookings, loadFilterData]);

  // Combine properties + services for the multiselect
  const propertyServiceOptions = useMemo(() => [
    ...properties.map(p => ({ label: `🏠 ${p.title}`, value: `prop_${p.id}` })),
    ...services.map(s => ({ label: `🧭 ${s.title}`, value: `svc_${s.id}` })),
  ], [properties, services]);

  const groupOptions = useMemo(() => [
    ...propertyGroups.map(g => ({ label: `🏠 ${g.name}`, value: `pg_${g.id}` })),
    ...serviceGroups.map(g => ({ label: `🧭 ${g.name}`, value: `sg_${g.id}` })),
  ], [propertyGroups, serviceGroups]);

  const filterConfigs: FilterConfig[] = useMemo(() => {
    const configs: FilterConfig[] = [
      {
        id: 'status',
        name: 'Statut',
        icon: Filter,
        type: 'multiselect',
        options: Object.entries(STATUS_LABELS).map(([value, label]) => ({ label, value })),
      },
      {
        id: 'groups',
        name: 'Groupes',
        icon: FolderKanban,
        type: 'multiselect',
        options: groupOptions,
      },
      {
        id: 'items',
        name: 'Propriétés / Services',
        icon: Building2,
        type: 'multiselect',
        options: propertyServiceOptions,
      },
    ];

    if (isHyper && hosts.length > 0) {
      configs.push({
        id: 'hosts',
        name: 'Hôtes (Admin)',
        icon: Users,
        type: 'multiselect',
        options: hosts.map(h => ({ label: h.label, value: h.id })),
      });
    }

    return configs;
  }, [groupOptions, propertyServiceOptions, isHyper, hosts]);

  const handleFilterApply = useCallback((filter: ActiveFilter) => {
    const vals = Array.isArray(filter.value) ? filter.value as string[] : [];
    switch (filter.id) {
      case 'status': setFilterStatus(vals); break;
      case 'items': setFilterPropertyIds(vals); break;
      case 'groups': setFilterGroupIds(vals); break;
      case 'hosts': setFilterHostIds(vals); break;
    }
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    switch (filterId) {
      case 'status': setFilterStatus([]); break;
      case 'items': setFilterPropertyIds([]); break;
      case 'groups': setFilterGroupIds([]); break;
      case 'hosts': setFilterHostIds([]); break;
    }
  }, []);

  // Apply filters to bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (filterStatus.length > 0) {
      result = result.filter(b => filterStatus.includes(b.status));
    }

    if (filterPropertyIds.length > 0) {
      const propIds = filterPropertyIds.filter(id => id.startsWith('prop_')).map(id => id.replace('prop_', ''));
      // Service booking filtering would need service bookings API
      if (propIds.length > 0) {
        result = result.filter(b => propIds.includes(b.propertyId));
      }
    }

    // Host filter: filter bookings whose property belongs to the host
    // This is a client-side approximation
    if (filterHostIds.length > 0) {
      // We need host info on bookings - filter by matching property host
      // For now filter by available property data
      const hostPropertyIds = properties
        .filter((p: any) => filterHostIds.includes(String(p.hostId || '')))
        .map(p => p.id);
      if (hostPropertyIds.length > 0) {
        result = result.filter(b => hostPropertyIds.includes(b.propertyId));
      }
    }

    return result;
  }, [bookings, filterStatus, filterPropertyIds, filterGroupIds, filterHostIds, properties]);

  const events: CalendarEvent[] = useMemo(() =>
    filteredBookings.map(b => ({
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
    [filteredBookings, t]
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

      {/* Dynamic Filters */}
      <DynamicFilter
        filters={filterConfigs}
        onFilterApply={handleFilterApply}
        onFilterRemove={handleFilterRemove}
      />

      {filteredBookings.length !== bookings.length && (
        <p className="text-sm text-muted-foreground">
          Affichage de {filteredBookings.length} / {bookings.length} réservations
        </p>
      )}

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