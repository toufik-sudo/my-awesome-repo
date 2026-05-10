import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { escrowApi, HostPayout } from '@/modules/payments/escrow.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Wallet, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { RefreshControl } from '@/components/shared/RefreshControl';
import { usePersistedQueryState } from '@/hooks/usePersistedQueryState';

const STATUSES: Array<{ key: HostPayout['status'] | 'all'; label: string; icon: any; tone: string }> = [
  { key: 'all',        label: 'Tous',          icon: Wallet,        tone: 'bg-muted text-foreground' },
  { key: 'scheduled',  label: 'Planifié',      icon: Clock,         tone: 'bg-yellow-500/10 text-yellow-700' },
  { key: 'on_hold',    label: 'En attente',    icon: AlertCircle,   tone: 'bg-orange-500/10 text-orange-700' },
  { key: 'released',   label: 'Libéré',        icon: CheckCircle2,  tone: 'bg-emerald-500/10 text-emerald-700' },
  { key: 'partially_released', label: 'Partiel', icon: CheckCircle2, tone: 'bg-blue-500/10 text-blue-700' },
  { key: 'forfeited',  label: 'Annulé',        icon: XCircle,       tone: 'bg-destructive/10 text-destructive' },
];

const fmt = (n: number | string) =>
  Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function PayoutsDashboardPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = usePersistedQueryState<HostPayout['status'] | 'all'>('status', 'all', 'payouts-dashboard');
  const [items, setItems] = useState<HostPayout[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      setItems(await escrowApi.listPayouts(filter === 'all' ? undefined : filter));
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [filter]);

  const totals = useMemo(() => {
    return items.reduce((acc, p) => {
      acc.gross += Number(p.grossAmount || 0);
      acc.fee += Number(p.platformFee || 0);
      acc.net += Number(p.netAmount || 0);
      acc.released += Number(p.releasedAmount || 0);
      return acc;
    }, { gross: 0, fee: 0, net: 0, released: 0 });
  }, [items]);

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('payouts.title', 'Paiements aux hôtes')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('payouts.subtitle', 'Suivi des payouts planifiés et libérés (brut / frais / net).')}
          </p>
        </div>
        <RefreshControl onRefresh={reload} storageKey="payouts-dashboard" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: t('payouts.kpi.gross', 'Brut'), value: totals.gross },
          { label: t('payouts.kpi.fee', 'Frais'), value: totals.fee },
          { label: t('payouts.kpi.net', 'Net'), value: totals.net },
          { label: t('payouts.kpi.released', 'Libéré'), value: totals.released },
        ].map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground font-normal">{k.label}</CardTitle></CardHeader>
            <CardContent><div className="text-xl font-bold">{fmt(k.value)}</div></CardContent>
          </Card>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const Icon = s.icon;
          const active = filter === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t(`payouts.filter.${s.key}`, s.label)}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : items.length === 0 ? (
            <p className="p-6 text-muted-foreground text-sm">{t('payouts.empty', 'Aucun payout.')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('payouts.col.host', 'Hôte')}</TableHead>
                  <TableHead>{t('payouts.col.booking', 'Réservation')}</TableHead>
                  <TableHead className="text-right">{t('payouts.col.gross', 'Brut')}</TableHead>
                  <TableHead className="text-right">{t('payouts.col.fee', 'Frais')}</TableHead>
                  <TableHead className="text-right">{t('payouts.col.net', 'Net')}</TableHead>
                  <TableHead>{t('payouts.col.releaseAt', 'Libération')}</TableHead>
                  <TableHead>{t('payouts.col.releasedAt', 'Libéré le')}</TableHead>
                  <TableHead>{t('payouts.col.status', 'Statut')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p) => {
                  const tone = STATUSES.find((s) => s.key === p.status)?.tone || 'bg-muted';
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">
                        <div className="font-medium">
                          {p.host?.firstName || ''} {p.host?.lastName || ''}
                        </div>
                        <div className="text-xs text-muted-foreground">{p.host?.email}</div>
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {(p.bookingId || p.serviceBookingId || '').slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{fmt(p.grossAmount)} {p.currency}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{fmt(p.platformFee)}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">{fmt(p.netAmount)}</TableCell>
                      <TableCell className="text-xs">{new Date(p.releaseAt).toLocaleString()}</TableCell>
                      <TableCell className="text-xs">
                        {p.releasedAt ? new Date(p.releasedAt).toLocaleString() : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={tone}>
                          {t(`payouts.status.${p.status}`, p.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
