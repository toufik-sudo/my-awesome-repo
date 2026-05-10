import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { GlassStat } from '@/modules/admin/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { referralsApi, type Referral } from './referrals.api';
import {
  Gift, Copy, Trophy, Users, Clock, CheckCircle2, XCircle, Calendar, Search, Download,
} from 'lucide-react';
import type { GridColumn } from '@/types/component.types';

interface Props {
  /** When true, fetches scoped referrals (admin/manager/hyper see invitees' referrals). */
  scoped?: boolean;
}

const STATUS_VARIANTS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  pending:       { label: 'En attente',     variant: 'outline',     icon: <Clock className="h-3 w-3" /> },
  signed_up:     { label: 'Inscrit',        variant: 'secondary',   icon: <Users className="h-3 w-3" /> },
  first_booking: { label: '1ère résa',      variant: 'secondary',   icon: <Calendar className="h-3 w-3" /> },
  completed:     { label: 'Complété',       variant: 'default',     icon: <CheckCircle2 className="h-3 w-3" /> },
  expired:       { label: 'Expiré',         variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
};

// Reconstruct an inferred status timeline from a referral row.
const buildStatusHistory = (r: Referral): Array<{ status: string; at?: string; note?: string }> => {
  const history: Array<{ status: string; at?: string; note?: string }> = [];
  history.push({ status: 'pending', at: r.createdAt, note: 'Code généré / invitation envoyée' });
  if (['signed_up', 'first_booking', 'completed'].includes(r.status)) {
    history.push({ status: 'signed_up', note: 'Filleul inscrit via le code' });
  }
  if (['first_booking', 'completed'].includes(r.status)) {
    history.push({ status: 'first_booking', note: 'Première réservation effectuée' });
  }
  if (r.status === 'completed') {
    history.push({ status: 'completed', note: 'Parrainage finalisé, points crédités' });
  }
  if (r.status === 'expired') {
    history.push({ status: 'expired', at: r.expiresAt, note: 'Code expiré' });
  }
  return history;
};

const fullName = (u?: { firstName?: string; lastName?: string; email?: string } | null): string => {
  if (!u) return '';
  const n = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
  return n || u.email || '';
};

const csvEscape = (v: any): string => {
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/"/g, '""');
  return /[",\n;]/.test(s) ? `"${s}"` : s;
};

export const MyReferralsPage: React.FC<Props> = memo(({ scoped = false }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [code, setCode] = useState<string>('');

  // Search / filter / pagination state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail modal
  const [selected, setSelected] = useState<Referral | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (scoped) {
        const r = await referralsApi.getScoped();
        setReferrals(r.referrals);
        setStats(r.stats);
      } else {
        const [list, s, c] = await Promise.all([
          referralsApi.getMyReferrals(),
          referralsApi.getStats(),
          referralsApi.getMyCode().catch(() => ({ code: '' })),
        ]);
        setReferrals(list);
        setStats(s);
        setCode(c.code);
      }
    } catch (e: any) {
      toast.error(t('referrals.loadError', 'Erreur lors du chargement des parrainages'));
    } finally {
      setLoading(false);
    }
  }, [scoped, t]);

  useEffect(() => { load(); }, [load]);

  const copyCode = useCallback(() => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success(t('referrals.codeCopied', 'Code copié !'));
  }, [code, t]);

  const filteredReferrals = useMemo(() => {
    const q = search.trim().toLowerCase();
    return referrals.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (!q) return true;
      const refName = fullName((r as any).referrer);
      const refEmail = ((r as any).referrer?.email || '').toLowerCase();
      const fName = fullName(r.referredUser);
      const fEmail = (r.referredUser?.email || '').toLowerCase();
      const contact = (r.inviteeContact || '').toLowerCase();
      const code = (r.code || '').toLowerCase();
      const status = (STATUS_VARIANTS[r.status]?.label || r.status).toLowerCase();
      return [refName.toLowerCase(), refEmail, fName.toLowerCase(), fEmail, contact, code, status, r.status]
        .some(v => v.includes(q));
    });
  }, [referrals, search, statusFilter]);

  // Reset to first page whenever filters change.
  useEffect(() => { setPage(1); }, [search, statusFilter, pageSize]);

  const totalItems = filteredReferrals.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedData = useMemo(
    () => filteredReferrals.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredReferrals, safePage, pageSize],
  );

  const exportCsv = useCallback(() => {
    const headers = [
      'code', 'referrerName', 'referrerEmail', 'referredName', 'referredEmail',
      'inviteeContact', 'method', 'status', 'referrerPoints', 'referredPoints',
      'createdAt', 'expiresAt',
    ];
    const rows = filteredReferrals.map(r => [
      r.code,
      fullName((r as any).referrer),
      (r as any).referrer?.email ?? '',
      fullName(r.referredUser),
      r.referredUser?.email ?? '',
      r.inviteeContact ?? '',
      r.method,
      STATUS_VARIANTS[r.status]?.label ?? r.status,
      r.referrerPointsAwarded ?? 0,
      r.referredPointsAwarded ?? 0,
      r.createdAt,
      r.expiresAt ?? '',
    ]);
    const csv = [headers, ...rows].map(line => line.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referrals-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t('referrals.exported', 'Export CSV généré'));
  }, [filteredReferrals, t]);

  const columns: GridColumn[] = useMemo(() => [
    {
      key: 'code', title: t('referrals.code', 'Code'), sortable: true,
      render: (v: string) => <code className="text-xs bg-muted px-2 py-1 rounded">{v}</code>,
    },
    ...(scoped ? [{
      key: 'referrer', title: t('referrals.referrer', 'Parrain'),
      render: (_: any, r: Referral) => fullName((r as any).referrer) || '—',
    }] : []),
    {
      key: 'referredUser', title: t('referrals.referred', 'Filleul'),
      render: (_: any, r: Referral) => {
        const u = r.referredUser;
        if (!u) return r.inviteeContact || <span className="text-muted-foreground">—</span>;
        return fullName(u);
      },
    },
    { key: 'method', title: t('referrals.method', 'Méthode'), sortable: true },
    {
      key: 'status', title: t('referrals.status', 'Statut'), sortable: true,
      render: (v: string) => {
        const s = STATUS_VARIANTS[v] ?? { label: v, variant: 'outline' as const, icon: null };
        return <Badge variant={s.variant} className="gap-1">{s.icon}{s.label}</Badge>;
      },
    },
    {
      key: 'referrerPointsAwarded', title: t('referrals.pointsReferrer', 'Points parrain'), sortable: true,
      align: 'right',
      render: (v: number) => <span className="font-semibold text-primary">{v ?? 0}</span>,
    },
    {
      key: 'referredPointsAwarded', title: t('referrals.pointsReferred', 'Points filleul'), sortable: true,
      align: 'right',
      render: (v: number) => <span className="font-semibold">{v ?? 0}</span>,
    },
    {
      key: 'createdAt', title: t('referrals.createdAt', 'Créé le'), sortable: true,
      render: (v: string) => v ? new Date(v).toLocaleDateString() : '—',
    },
  ], [scoped, t]);

  if (loading) return <div className="flex items-center justify-center py-12"><LoadingSpinner /></div>;

  const statusOptions = [
    { value: 'all', label: t('referrals.filter.all', 'Tous les statuts') },
    ...Object.entries(STATUS_VARIANTS).map(([k, v]) => ({ value: k, label: v.label })),
  ];

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Gift className="h-6 w-6 text-primary" />
              {scoped
                ? t('referrals.scopedTitle', 'Parrainages — vue scoped')
                : t('referrals.title', 'Mes parrainages')}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {scoped
                ? t('referrals.scopedSubtitle', 'Parrainages effectués par vous et par les utilisateurs que vous avez invités')
                : t('referrals.subtitle', 'Suivi de vos parrainages, statuts et points gagnés')}
            </p>
          </div>
          {!scoped && code && (
            <div className="flex items-center gap-2">
              <Input value={code} readOnly className="w-48 font-mono" />
              <Button variant="outline" size="icon" onClick={copyCode}><Copy className="h-4 w-4" /></Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <GlassStat title={t('referrals.stats.total', 'Total')} value={stats?.total ?? 0} icon={<Users className="h-4 w-4" />} />
          <GlassStat title={t('referrals.stats.pending', 'En attente')} value={stats?.pending ?? 0} icon={<Clock className="h-4 w-4" />} />
          <GlassStat title={t('referrals.stats.signedUp', 'Inscrits')} value={stats?.signedUp ?? 0} icon={<Users className="h-4 w-4" />} />
          <GlassStat title={t('referrals.stats.completed', 'Complétés')} value={stats?.completed ?? 0} icon={<CheckCircle2 className="h-4 w-4" />} />
          <GlassStat
            title={scoped ? t('referrals.stats.referrerPoints', 'Pts parrains') : t('referrals.stats.myPoints', 'Mes points')}
            value={stats?.totalReferrerPoints ?? stats?.totalPointsEarned ?? 0}
            icon={<Trophy className="h-4 w-4" />}
          />
          <GlassStat
            title={t('referrals.stats.referredPoints', 'Pts filleuls')}
            value={stats?.totalReferredPoints ?? 0}
            icon={<Gift className="h-4 w-4" />}
          />
        </div>

        {/* Toolbar: search, status filter, export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('referrals.searchPlaceholder', 'Rechercher par nom, email, code, statut...')}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCsv} disabled={!filteredReferrals.length}>
            <Download className="h-4 w-4 mr-2" />
            {t('referrals.exportCsv', 'Exporter CSV')}
          </Button>
          <div className="ml-auto text-sm text-muted-foreground">
            {t('referrals.resultsCount', '{{count}} résultat(s)', { count: totalItems })}
          </div>
        </div>

        <DynamicGrid
          columns={columns}
          data={pagedData}
          emptyMessage={t('referrals.empty', 'Aucun parrainage pour le moment')}
          rowKey="id"
          showFilters={false}
          onRowClick={(row) => setSelected(row as Referral)}
          pagination={{
            enabled: true,
            currentPage: safePage,
            totalItems,
            pageSizeOptions: [10, 20, 50, 100],
            showPageInput: true,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
        />

        {/* Detail Modal */}
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-2xl">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    {t('referrals.detail.title', 'Détails du parrainage')}
                    <code className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">{selected.code}</code>
                  </DialogTitle>
                  <DialogDescription>
                    {t('referrals.detail.subtitle', 'Historique des statuts et calcul des points')}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs uppercase text-muted-foreground mb-1">{t('referrals.referrer', 'Parrain')}</div>
                    <div className="font-medium">{fullName((selected as any).referrer) || '—'}</div>
                    <div className="text-xs text-muted-foreground">{(selected as any).referrer?.email}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs uppercase text-muted-foreground mb-1">{t('referrals.referred', 'Filleul')}</div>
                    <div className="font-medium">
                      {fullName(selected.referredUser) || selected.inviteeContact || '—'}
                    </div>
                    <div className="text-xs text-muted-foreground">{selected.referredUser?.email}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">{t('referrals.detail.timeline', 'Historique des statuts')}</h3>
                  <ol className="relative border-l border-border ml-3 space-y-3">
                    {buildStatusHistory(selected).map((h, i) => {
                      const s = STATUS_VARIANTS[h.status] ?? { label: h.status, variant: 'outline' as const, icon: null };
                      return (
                        <li key={i} className="ml-4">
                          <span className="absolute -left-[7px] flex h-3 w-3 items-center justify-center rounded-full bg-primary" />
                          <div className="flex items-center gap-2">
                            <Badge variant={s.variant} className="gap-1">{s.icon}{s.label}</Badge>
                            {h.at && <span className="text-xs text-muted-foreground">{new Date(h.at).toLocaleString()}</span>}
                          </div>
                          {h.note && <p className="text-xs text-muted-foreground mt-1">{h.note}</p>}
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">{t('referrals.detail.points', 'Calcul des points')}</h3>
                  <div className="rounded-lg border divide-y">
                    <div className="flex items-center justify-between p-3">
                      <div>
                        <div className="text-sm font-medium">{t('referrals.detail.signupBonus', 'Bonus inscription parrain')}</div>
                        <div className="text-xs text-muted-foreground">
                          {['signed_up', 'first_booking', 'completed'].includes(selected.status)
                            ? t('referrals.detail.creditedSignup', 'Crédité à l\'inscription du filleul')
                            : t('referrals.detail.pendingSignup', 'En attente — filleul non inscrit')}
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        +{['signed_up', 'first_booking', 'completed'].includes(selected.status) ? 100 : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3">
                      <div>
                        <div className="text-sm font-medium">{t('referrals.detail.firstBooking', 'Bonus 1ère réservation')}</div>
                        <div className="text-xs text-muted-foreground">
                          {['first_booking', 'completed'].includes(selected.status)
                            ? t('referrals.detail.creditedBooking', 'Crédité après 1ère réservation')
                            : t('referrals.detail.pendingBooking', 'En attente — aucune réservation')}
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        +{['first_booking', 'completed'].includes(selected.status) ? 100 : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3">
                      <div>
                        <div className="text-sm font-medium">{t('referrals.detail.referredBonus', 'Bonus bienvenue filleul')}</div>
                        <div className="text-xs text-muted-foreground">
                          {selected.referredPointsAwarded > 0
                            ? t('referrals.detail.creditedReferred', 'Crédité au filleul')
                            : t('referrals.detail.pendingReferred', 'En attente')}
                        </div>
                      </div>
                      <span className="font-semibold">+{selected.referredPointsAwarded ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/40">
                      <div className="text-sm font-semibold">{t('referrals.detail.totalReferrer', 'Total parrain')}</div>
                      <span className="font-bold text-primary">{selected.referrerPointsAwarded ?? 0}</span>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    {t('common.close', 'Fermer')}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
});

MyReferralsPage.displayName = 'MyReferralsPage';

export default MyReferralsPage;
