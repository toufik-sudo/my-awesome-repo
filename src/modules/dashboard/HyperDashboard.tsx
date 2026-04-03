import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { DynamicTabs } from '@/modules/shared/components/DynamicTabs';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { DynamicCharts } from '@/modules/shared/components/DynamicCharts';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { TrustBadge } from '@/modules/shared/components/TrustBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { GlassCard, GlassStat } from '@/modules/admin/components/GlassCard';
import { InvitationForm } from '@/modules/admin/components/InvitationForm';
import { RolesManagement } from '@/modules/admin/pages/RolesManagement';
import { GroupsManagement } from '@/modules/admin/pages/GroupsManagement';
import { ManagerAssignments } from '@/modules/admin/pages/ManagerAssignments';
import { VerificationReview } from '@/modules/admin/pages/VerificationReview';
import { PointsDashboardWidget } from '@/modules/points/PointsDashboardWidget';
import { PointsRulesManager } from '@/modules/admin/components/PointsRulesManager';
import { ServiceFeesManager } from '@/modules/admin/components/ServiceFeesManager';
import { RewardsManager } from '@/modules/admin/components/RewardsManager';
import { PaymentValidation } from '@/modules/payments/pages/PaymentValidation';
import { HyperEntityManager } from '@/modules/admin/components/HyperEntityManager';
import { EmailAnalyticsPage } from '@/modules/admin/pages/EmailAnalyticsPage';
import { HostFeeAbsorptionPage } from '@/modules/admin/pages/HostFeeAbsorptionPage';
import { CancellationRulesPage } from '@/modules/admin/pages/CancellationRulesPage';
import { statsApi, invitationsApi, rolesApi, type AdminStats } from '@/modules/admin/admin.api';
import type { Invitation } from '@/modules/admin/admin.types';
import { useDashboard } from '@/modules/dashboard/useDashboard';
import type { GridColumn } from '@/types/component.types';
import {
  Crown, Users, Shield, ShieldCheck, UserPlus,
  FileCheck2, FolderKanban, BarChart3, Building2, Send,
  Clock, CheckCircle2, XCircle, TrendingUp,
  Home, Calendar, Star, MapPin, ArrowRight,
  DollarSign, Trophy, CreditCard, Mail, ShieldX, Percent,
  Loader2, Layers, Gift,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { color: string }> = {
  pending: { color: 'text-amber-600' },
  confirmed: { color: 'text-emerald-600' },
  completed: { color: 'text-primary' },
  cancelled: { color: 'text-destructive' },
};

interface MetricDetail {
  title: string;
  loading: boolean;
  data: any[];
  columns: GridColumn[];
}

export const HyperDashboard: React.FC = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [metricModal, setMetricModal] = useState<MetricDetail | null>(null);

  const { data: dashboardData } = useDashboard();
  const isHyperAdmin = user?.role === 'hyper_admin';

  const loadData = useCallback(async () => {
    try {
      const data = await statsApi.getDashboardStats();
      setStats(data);
    } catch { /* non-critical */ } finally {
      setLoading(false);
    }
  }, []);

  const loadInvitations = useCallback(async () => {
    setInvitationsLoading(true);
    try {
      const data = await invitationsApi.getAll();
      setInvitations(data);
    } catch { /* silent */ } finally {
      setInvitationsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); loadInvitations(); }, [loadData, loadInvitations]);

  const handleMetricClick = useCallback(async (metricKey: string, title: string) => {
    setMetricModal({ title, loading: true, data: [], columns: [] });

    try {
      let data: any[] = [];
      let columns: GridColumn[] = [];

      switch (metricKey) {
        case 'users': {
          const users = await rolesApi.getAllUsers();
          // Exclude hyper_admin from users table
          data = users.filter(u => u.role !== 'hyper_admin');
          columns = [
            { key: 'email', title: 'Email' },
            { key: 'firstName', title: 'Prénom', render: (v: string) => v || '—' },
            { key: 'lastName', title: 'Nom', render: (v: string) => v || '—' },
            {
              key: 'role', title: 'Rôle', render: (v: string) => (
                <Badge variant="secondary" className="text-[10px]">{v?.replace('_', ' ')}</Badge>
              )
            },
          ];
          break;
        }
        case 'managers': {
          const users = await rolesApi.getAllUsers();
          data = users.filter(u => u.role === 'manager' || u.role === 'hyper_manager');
          columns = [
            { key: 'email', title: 'Email' },
            { key: 'firstName', title: 'Prénom', render: (v: string) => v || '—' },
            {
              key: 'role', title: 'Rôle', render: (v: string) => (
                <Badge variant="secondary" className="text-[10px]">{v?.replace('_', ' ')}</Badge>
              )
            },
          ];
          break;
        }
        case 'verifications': {
          data = [
            { label: 'En attente', count: stats?.pendingVerifications ?? 0, status: 'pending' },
            { label: 'Approuvées', count: stats?.approvedVerifications ?? 0, status: 'approved' },
            { label: 'Rejetées', count: stats?.rejectedVerifications ?? 0, status: 'rejected' },
          ];
          columns = [
            { key: 'label', title: 'Statut' },
            { key: 'count', title: 'Nombre' },
            {
              key: 'status', title: '', render: (v: string) => (
                <Badge variant={v === 'approved' ? 'default' : v === 'rejected' ? 'destructive' : 'outline'}>{v}</Badge>
              )
            },
          ];
          break;
        }
        case 'properties': {
          data = [
            { label: 'Total propriétés', count: stats?.totalProperties ?? 0 },
            { label: 'Publiées', count: stats?.publishedProperties ?? 0 },
            { label: 'Non publiées', count: (stats?.totalProperties ?? 0) - (stats?.publishedProperties ?? 0) },
          ];
          columns = [
            { key: 'label', title: 'Type' },
            { key: 'count', title: 'Nombre' },
          ];
          break;
        }
        case 'bookings': {
          data = [
            { label: 'Total réservations', count: stats?.totalBookings ?? 0 },
            { label: 'En attente', count: stats?.pendingBookings ?? 0 },
            { label: 'Confirmées', count: (stats?.totalBookings ?? 0) - (stats?.pendingBookings ?? 0) },
          ];
          columns = [
            { key: 'label', title: 'Statut' },
            { key: 'count', title: 'Nombre' },
          ];
          break;
        }
        case 'revenue': {
          data = dashboardData?.revenueByMonth?.map(m => ({
            month: m.month,
            revenue: `${m.revenue.toLocaleString()} DA`,
            bookings: m.bookings,
          })) || [];
          columns = [
            { key: 'month', title: 'Mois' },
            { key: 'revenue', title: 'Revenu' },
            { key: 'bookings', title: 'Réservations' },
          ];
          break;
        }
        default: {
          data = [];
          columns = [];
        }
      }

      setMetricModal({ title, loading: false, data, columns });
    } catch {
      setMetricModal(prev => prev ? { ...prev, loading: false } : null);
      toast.error('Erreur lors du chargement des détails');
    }
  }, [stats, dashboardData]);

  const invitationColumns = useMemo<GridColumn[]>(() => [
    { key: 'contact', title: 'Contact', render: (_: any, row: Invitation) => row.email || row.phone || '—' },
    { key: 'role', title: 'Role', width: '120px', render: (v: string) => <Badge variant={v === 'admin' ? 'default' : 'secondary'}>{v?.replace('_', ' ')}</Badge> },
    {
      key: 'status', title: 'Status', width: '120px', render: (v: string) => {
        const cfg: Record<string, { variant: any; icon: React.ReactNode }> = {
          pending: { variant: 'outline', icon: <Clock className="h-3 w-3" /> },
          accepted: { variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
          expired: { variant: 'secondary', icon: <XCircle className="h-3 w-3" /> },
          cancelled: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
        };
        const c = cfg[v] || cfg.pending;
        return <Badge variant={c.variant} className="gap-1">{c.icon} {v}</Badge>;
      }
    },
    { key: 'createdAt', title: 'Envoyé', width: '140px', render: (v: string) => v ? new Date(v).toLocaleDateString() : '—' },
    {
      key: 'actions', title: '', width: '100px', render: (_: any, row: Invitation) => row.status === 'pending' ? (
        <DynamicButton variant="ghost" size="sm" icon={<Send className="h-3.5 w-3.5" />} onClick={() => handleResend(row.id)}>Renvoyer</DynamicButton>
      ) : null
    },
  ], []);

  const handleResend = useCallback(async (id: string) => {
    try { await invitationsApi.resend(id); toast.success('Invitation renvoyée'); } catch { toast.error('Échec du renvoi'); }
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  const revenueChartData = dashboardData?.revenueByMonth?.map(m => ({
    name: m.month,
    revenue: m.revenue,
    bookings: m.bookings,
  })) || [];

  const propertyTypeData = dashboardData?.propertyTypeDistribution
    ? Object.entries(dashboardData.propertyTypeDistribution).map(([key, value]) => ({
      name: t(`byootdz.categories.${key}s`, key),
      value,
    }))
    : [];

  const tabs = [
    {
      value: 'overview',
      label: t('dashboard.tabs.overview', 'Vue d\'ensemble'),
      icon: <BarChart3 className="h-4 w-4" />,
      content: (
        <ErrorBoundary>
          <div className="space-y-6">
            {/* Main Stats Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassStat title="Utilisateurs" value={stats?.totalUsers ?? 0} icon={<Users className="h-5 w-5" />} color="primary" onClick={() => handleMetricClick('users', 'Détails utilisateurs')} />
              <GlassStat title="Managers actifs" value={stats?.activeManagers ?? 0} icon={<Shield className="h-5 w-5" />} color="secondary" onClick={() => handleMetricClick('managers', 'Détails managers')} />
              <GlassStat title="Assignations" value={stats?.totalAssignments ?? 0} icon={<ShieldCheck className="h-5 w-5" />} color="accent" onClick={() => navigate('/admin/assignments')} />
              <GlassStat title="Vérif. en attente" value={stats?.pendingVerifications ?? 0} icon={<FileCheck2 className="h-5 w-5" />} color="amber" onClick={() => handleMetricClick('verifications', 'Détails vérifications')} />
            </div>

            {/* Main Stats Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassStat title="Propriétés" value={stats?.totalProperties ?? 0} icon={<Home className="h-5 w-5" />} color="primary" onClick={() => handleMetricClick('properties', 'Détails propriétés')} />
              <GlassStat title="Publiées" value={stats?.publishedProperties ?? 0} icon={<Building2 className="h-5 w-5" />} color="secondary" onClick={() => navigate('/properties')} />
              <GlassStat title="Réservations" value={stats?.totalBookings ?? 0} icon={<Calendar className="h-5 w-5" />} color="accent" onClick={() => handleMetricClick('bookings', 'Détails réservations')} />
              <GlassStat title="Revenu total" value={`${(stats?.totalRevenue ?? 0).toLocaleString()} DA`} icon={<TrendingUp className="h-5 w-5" />} color="amber" onClick={() => handleMetricClick('revenue', 'Détails revenus')} />
            </div>

            {/* Revenue Overview Chart */}
            {revenueChartData.length > 0 && (
              <DynamicCharts
                data={revenueChartData}
                type="area"
                series={[
                  { dataKey: 'revenue', name: 'Revenu', color: 'hsl(var(--primary))' },
                  { dataKey: 'bookings', name: 'Réservations', color: 'hsl(var(--secondary))' },
                ]}
                title="Aperçu des revenus"
                description="Revenus et réservations des 6 derniers mois"
                withCard
                chartHeight={280}
              />
            )}

            {/* Property Types + Role Distribution + Verifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {propertyTypeData.length > 0 && (
                <DynamicCharts
                  data={propertyTypeData}
                  type="pie"
                  series={[{ dataKey: 'value' }]}
                  title="Types de propriétés"
                  description="Distribution par type"
                  withCard
                  chartHeight={250}
                  labelKey="name"
                  valueKey="value"
                />
              )}

              {/* Role Distribution */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" /> Distribution des rôles
                </h3>
                <ScrollArea className="max-h-[220px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><span className="text-sm">Admins</span></div>
                      <Badge>{stats?.totalAdmins ?? 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-secondary-foreground" /><span className="text-sm">Managers</span></div>
                      <Badge variant="secondary">{stats?.totalManagers ?? stats?.activeManagers ?? 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Utilisateurs</span></div>
                      <Badge variant="outline">{stats?.totalRegularUsers ?? 0}</Badge>
                    </div>
                  </div>
                </ScrollArea>
                <Separator className="my-4" />
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-accent shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Trust Score moyen</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{dashboardData?.stats.avgTrustStars ?? 0}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i <= Math.round(dashboardData?.stats.avgTrustStars ?? 0) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Verifications */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FileCheck2 className="h-5 w-5 text-primary" /> Vérifications
                </h3>
                <ScrollArea className="max-h-[220px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">En attente</span>
                      <Badge variant="outline" className="text-amber-600 border-amber-600">{stats?.pendingVerifications ?? 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Approuvées</span>
                      <Badge className="bg-emerald-600 hover:bg-emerald-700">{stats?.approvedVerifications ?? 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rejetées</span>
                      <Badge variant="destructive">{stats?.rejectedVerifications ?? 0}</Badge>
                    </div>
                    {(stats?.pendingVerifications ?? 0) + (stats?.approvedVerifications ?? 0) + (stats?.rejectedVerifications ?? 0) > 0 && (
                      <Progress
                        value={((stats?.approvedVerifications ?? 0) / Math.max((stats?.pendingVerifications ?? 0) + (stats?.approvedVerifications ?? 0) + (stats?.rejectedVerifications ?? 0), 1)) * 100}
                        className="h-2"
                      />
                    )}
                  </div>
                </ScrollArea>
              </GlassCard>
            </div>

            {/* Recent Properties */}
            {dashboardData?.properties && dashboardData.properties.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Propriétés récentes</CardTitle>
                      <CardDescription>{dashboardData.stats.totalProperties} au total</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/properties')} className="gap-1">
                      Voir tout <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[320px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dashboardData.properties.slice(0, 6).map(property => (
                        <div key={property.id} className="group flex gap-3 p-3 rounded-lg border border-border/60 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">{property.title}</h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{property.location}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <TrustBadge trustStars={property.trustStars} isVerified={property.isVerified} size="sm" showLabel={false} />
                              <span className="text-xs text-muted-foreground"><Star className="h-3 w-3 inline fill-accent text-accent" /> {property.rating}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-semibold text-primary">{property.price.toLocaleString()} DA</span>
                              <Badge variant={property.status === 'published' ? 'secondary' : 'outline'} className="text-[10px] px-1.5 py-0">{property.status}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Recent Bookings + Incoming Requests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Réservations récentes</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')} className="gap-1">
                      Voir tout <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {(!dashboardData?.recentBookings || dashboardData.recentBookings.length === 0) ? (
                    <p className="text-sm text-muted-foreground text-center py-6">Aucune réservation</p>
                  ) : (
                    <ScrollArea className="max-h-[280px]">
                      <div className="space-y-3">
                        {dashboardData.recentBookings.map(booking => (
                          <div key={booking.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={booking.propertyImage} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{booking.propertyTitle}</p>
                              <p className="text-xs text-muted-foreground">{booking.location}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <Badge variant="outline" className={`text-xs ${STATUS_CONFIG[booking.status]?.color || ''}`}>{booking.status}</Badge>
                              <p className="text-xs font-medium mt-1">{Number(booking.totalPrice).toLocaleString()} DA</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Demandes entrantes</CardTitle>
                </CardHeader>
                <CardContent>
                  {(!dashboardData?.recentHostRequests || dashboardData.recentHostRequests.length === 0) ? (
                    <p className="text-sm text-muted-foreground text-center py-6">Aucune demande</p>
                  ) : (
                    <ScrollArea className="max-h-[280px]">
                      <div className="space-y-3">
                        {dashboardData.recentHostRequests.map(req => (
                          <div key={req.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="p-2 rounded-full bg-muted"><Users className="h-4 w-4 text-muted-foreground" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{req.guestName}</p>
                              <p className="text-xs text-muted-foreground truncate">{req.propertyTitle}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <Badge variant="outline" className={`text-xs ${STATUS_CONFIG[req.status]?.color || ''}`}>{req.status}</Badge>
                              <p className="text-xs font-medium mt-1">{Number(req.totalPrice).toLocaleString()} DA</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Invitations */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> Invitations récentes</h3>
                <Button variant="ghost" size="sm" onClick={loadInvitations}>Rafraîchir</Button>
              </div>
              <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                <DynamicGrid
                  columns={invitationColumns}
                  data={invitations}
                  loading={invitationsLoading}
                  emptyMessage="Aucune invitation"
                  hoverable
                  pageSize={10}
                />
              </div>
            </GlassCard>
          </div>
        </ErrorBoundary>
      ),
    },
    {
      value: 'entities',
      label: t('dashboard.tabs.entities', 'Propriétés & Services'),
      icon: <Layers className="h-4 w-4" />,
      content: <ErrorBoundary><HyperEntityManager /></ErrorBoundary>,
    },
    {
      value: 'points',
      label: t('dashboard.tabs.points', 'Points & Récompenses'),
      icon: <Trophy className="h-4 w-4" />,
      content: (
        <ErrorBoundary>
          <div className="space-y-6">
            <PointsDashboardWidget />
            <PointsRulesManager />
          </div>
        </ErrorBoundary>
      ),
    },
    {
      value: 'rewards',
      label: t('dashboard.tabs.rewards', 'Récompenses'),
      icon: <Gift className="h-4 w-4" />,
      content: <ErrorBoundary><RewardsManager /></ErrorBoundary>,
    },
    {
      value: 'fees',
      label: t('dashboard.tabs.fees', 'Frais de service'),
      icon: <DollarSign className="h-4 w-4" />,
      content: <ErrorBoundary><ServiceFeesManager /></ErrorBoundary>,
    },
    {
      value: 'payment-validation',
      label: t('dashboard.tabs.paymentValidation', 'Validation paiements'),
      icon: <CreditCard className="h-4 w-4" />,
      content: <ErrorBoundary><PaymentValidation /></ErrorBoundary>,
    },
    {
      value: 'email-analytics',
      label: t('dashboard.tabs.emailAnalytics', 'Email Analytics'),
      icon: <Mail className="h-4 w-4" />,
      content: <ErrorBoundary><EmailAnalyticsPage /></ErrorBoundary>,
    },
    {
      value: 'fee-absorption',
      label: t('dashboard.tabs.feeAbsorption', 'Absorption frais'),
      icon: <Percent className="h-4 w-4" />,
      content: <ErrorBoundary><HostFeeAbsorptionPage viewOnly /></ErrorBoundary>,
    },
    {
      value: 'cancellation',
      label: t('dashboard.tabs.cancellation', "Règles d'annulation"),
      icon: <ShieldX className="h-4 w-4" />,
      content: <ErrorBoundary><CancellationRulesPage viewOnly /></ErrorBoundary>,
    },
    {
      value: 'verifications',
      label: t('dashboard.tabs.verifications', 'Vérifications'),
      icon: <FileCheck2 className="h-4 w-4" />,
      badge: stats?.pendingVerifications,
      content: <ErrorBoundary><VerificationReview /></ErrorBoundary>,
    },
    {
      value: 'users',
      label: t('dashboard.tabs.users', 'Utilisateurs'),
      icon: <Users className="h-4 w-4" />,
      badge: stats?.totalUsers,
      content: <ErrorBoundary><RolesManagement excludeHyperAdmin /></ErrorBoundary>,
    },
    {
      value: 'groups',
      label: t('dashboard.tabs.groups', 'Groupes'),
      icon: <FolderKanban className="h-4 w-4" />,
      badge: stats?.totalGroups,
      content: <ErrorBoundary><GroupsManagement /></ErrorBoundary>,
    },
    {
      value: 'assignments',
      label: t('dashboard.tabs.assignments', 'Assignations'),
      icon: <ShieldCheck className="h-4 w-4" />,
      badge: stats?.totalAssignments,
      content: <ErrorBoundary><ManagerAssignments isHyperContext /></ErrorBoundary>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 sm:p-8 border border-border/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t('dashboard.hyperTitle', 'Console Hyper Admin')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('dashboard.hyperSubtitle', 'Contrôle total de la plateforme — utilisateurs, rôles, vérifications et récompenses')}
              </p>
            </div>
          </div>
          <Button onClick={() => setInviteOpen(true)} size="lg" className="gap-2 shadow-lg shadow-primary/20">
            <UserPlus className="h-5 w-5" /> Inviter
          </Button>
        </div>
      </div>

      <DynamicTabs tabs={tabs} defaultValue="overview" variant="underline" />

      {/* Metric Detail Modal */}
      <DynamicModal
        open={!!metricModal}
        onOpenChange={(o) => !o && setMetricModal(null)}
        title={metricModal?.title || 'Détails'}
        size="lg"
      >
        {metricModal?.loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden">
            <DynamicGrid
              columns={metricModal?.columns || []}
              data={metricModal?.data || []}
              hoverable
              striped
              pageSize={10}
              emptyMessage="Aucune donnée"
            />
          </div>
        )}
      </DynamicModal>

      <InvitationForm
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        allowedRoles={isHyperAdmin ? ['hyper_manager', 'admin', 'manager'] : ['admin', 'manager']}
        onSuccess={loadInvitations}
      />
    </div>
  );
});

HyperDashboard.displayName = 'HyperDashboard';
