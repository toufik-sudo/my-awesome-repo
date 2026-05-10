import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { escrowApi, BookingDispute } from '@/modules/payments/escrow.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshControl } from '@/components/shared/RefreshControl';
import { ADMIN_ROUTES } from '@/routes/routes.constants';
import { usePersistedQueryState } from '@/hooks/usePersistedQueryState';

const STATUS_KEYS = ['all', 'open', 'under_review', 'resolved_guest', 'resolved_host', 'dismissed'] as const;
type DisputeStatusFilter = typeof STATUS_KEYS[number];

const STATUS_COLOR: Record<string, string> = {
  open: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
  under_review: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  resolved_guest: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
  resolved_host: 'bg-muted text-muted-foreground',
  dismissed: 'bg-destructive/10 text-destructive border-destructive/30',
};

export default function MyDisputesPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<BookingDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = usePersistedQueryState<DisputeStatusFilter>('status', 'all', 'my-disputes');

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

  const filtered = useMemo(
    () => statusFilter === 'all' ? items : items.filter((d) => d.status === statusFilter),
    [items, statusFilter],
  );

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{t('disputes.myTitle', 'Mes réclamations')}</h1>
          <p className="text-muted-foreground text-sm">
            {t('disputes.mySubtitle', 'Suivez l’état de vos réclamations et remboursements.')}
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
          {filtered.map((d) => (
            <Link key={d.id} to={ADMIN_ROUTES.DISPUTE_DETAIL.replace(':id', d.id)}>
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
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
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
          ))}
        </div>
      )}
    </div>
  );
}
