import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { escrowApi, BookingDispute } from '@/modules/payments/escrow.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshControl } from '@/components/shared/RefreshControl';
import { ADMIN_ROUTES, PROPERTY_ROUTES, SERVICE_ROUTES } from '@/routes/routes.constants';
import { usePersistedQueryState } from '@/hooks/usePersistedQueryState';

const STATUS_KEYS = ['all', 'open', 'under_review', 'resolved_guest', 'resolved_host', 'dismissed'] as const;
type DisputeStatusFilter = typeof STATUS_KEYS[number];

const TYPE_KEYS = ['all', 'property', 'service'] as const;
type DisputeTypeFilter = typeof TYPE_KEYS[number];

const STATUS_COLOR: Record<string, string> = {
  open: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
  under_review: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  resolved_guest: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
  resolved_host: 'bg-muted text-muted-foreground',
  dismissed: 'bg-destructive/10 text-destructive border-destructive/30',
};

function getServiceTitle(service?: { title?: any }): string {
  if (!service) return '';
  if (typeof service.title === 'string' && service.title.trim()) return service.title;
  if (service.title?.fr) return service.title.fr;
  if (service.title?.en) return service.title.en;
  return '';
}

function getPropertyTitle(property?: { title?: string }): string {
  return property?.title?.trim() || '';
}

export default function MyDisputesPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<BookingDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = usePersistedQueryState<DisputeStatusFilter>('status', 'all', 'my-disputes');
  const [typeFilter, setTypeFilter] = usePersistedQueryState<DisputeTypeFilter>('type', 'all', 'my-disputes');

  const reload = useCallback(async () => {
    try {
      setItems(await escrowApi.listDisputes());
    } catch (e: any) {
      toast.error(e?.message || t('disputes.loadError', 'Failed to load disputes'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { reload(); }, [reload]);

  const filtered = useMemo(() => {
    let result = statusFilter === 'all' ? items : items.filter((d) => d.status === statusFilter);
    if (typeFilter !== 'all') {
      result = result.filter((d) =>
        typeFilter === 'service' ? !!d.serviceBookingId : !!d.bookingId,
      );
    }
    return result;
  }, [items, statusFilter, typeFilter]);

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{t('disputes.myTitle', 'Mes réclamations')}</h1>
          <p className="text-muted-foreground text-sm">
            {t('disputes.mySubtitle', 'Suivez l\u2019état de vos réclamations et remboursements.')}
          </p>
        </div>
        <RefreshControl onRefresh={reload} storageKey="my-disputes" />
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2">
        {STATUS_KEYS.map((key) => {
          const active = statusFilter === key;
          const tone = key === 'all' ? 'bg-muted text-foreground' : STATUS_COLOR[key];
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                active ? 'bg-primary text-primary-foreground border-primary' : `${tone} hover:opacity-80`
              }`}
            >
              {t(`disputes.status.${key}`, key === 'all' ? 'Tous' : key)}
            </button>
          );
        })}
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2">
        {TYPE_KEYS.map((key) => {
          const active = typeFilter === key;
          const isService = key === 'service';
          const tone = key === 'all'
            ? 'bg-muted text-foreground'
            : isService
              ? 'bg-sky-500/10 text-sky-700 border-sky-500/30'
              : 'bg-violet-500/10 text-violet-700 border-violet-500/30';
          return (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                active ? 'bg-primary text-primary-foreground border-primary' : `${tone} hover:opacity-80`
              }`}
            >
              {key === 'all' ? (
                <span className="h-3.5 w-3.5 inline-block" />
              ) : isService ? (
                <span className="h-3.5 w-3.5 inline-block rounded-full bg-sky-500" />
              ) : (
                <span className="h-3.5 w-3.5 inline-block rounded-full bg-violet-500" />
              )}
              {t(`disputes.typeFilter.${key}`, key === 'all' ? 'Tous' : key === 'service' ? 'Service' : 'Propriété')}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-6 text-muted-foreground">
          {t('disputes.empty', 'Aucune réclamation pour le moment.')}
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => {
            const isService = !!d.serviceBookingId;
            const title = isService
              ? getServiceTitle(d.serviceBooking?.service)
              : getPropertyTitle(d.booking?.property);
            const serviceId = (d.serviceBooking?.service as any)?.id;
            const propertyId = (d.booking?.property as any)?.id;
            const detailPath = isService
              ? (serviceId ? SERVICE_ROUTES.DETAIL.replace(':id', serviceId) : undefined)
              : (propertyId ? PROPERTY_ROUTES.DETAIL.replace(':id', propertyId) : undefined);
            const disputeDetailPath = ADMIN_ROUTES.DISPUTE_DETAIL.replace(':id', d.id);
            return (
              <Link key={d.id} to={disputeDetailPath}>
                <Card className="hover:bg-muted/40 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base">{d.subject}</CardTitle>
                      <Badge variant="outline" className={STATUS_COLOR[d.status]}>
                        {t(`disputes.status.${d.status}`, d.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="line-clamp-2 text-muted-foreground">{d.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1 items-center">
                      {detailPath ? (
                        <Link
                          to={detailPath}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:opacity-80 transition-opacity"
                        >
                          <Badge
                            variant="outline"
                            className={isService
                              ? 'bg-sky-500/10 text-sky-700 border-sky-500/30 cursor-pointer'
                              : 'bg-violet-500/10 text-violet-700 border-violet-500/30 cursor-pointer'}
                          >
                            {isService
                              ? t('disputes.type.service', 'Service')
                              : t('disputes.type.property', 'Propriété')}
                          </Badge>
                        </Link>
                      ) : (
                        <Badge
                          variant="outline"
                          className={isService
                            ? 'bg-sky-500/10 text-sky-700 border-sky-500/30'
                            : 'bg-violet-500/10 text-violet-700 border-violet-500/30'}
                        >
                          {isService
                            ? t('disputes.type.service', 'Service')
                            : t('disputes.type.property', 'Propriété')}
                        </Badge>
                      )}
                      <span className="font-medium text-foreground">
                        {title || (isService
                          ? t('disputes.fallback.service', 'Service sans nom')
                          : t('disputes.fallback.property', 'Propriété sans nom'))}
                      </span>
                      <span className="font-mono">
                        #{(d.bookingId || d.serviceBookingId || '').slice(0, 8)}
                      </span>
                      <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                      <span>{t('disputes.severity', 'Gravité')}: {d.severity}</span>
                      {d.refundAmount > 0 && (
                        <span className="font-medium text-emerald-600">
                          {t('disputes.refund', 'Remboursement')}: {d.refundAmount}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
