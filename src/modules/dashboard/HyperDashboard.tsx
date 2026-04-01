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
import { TrustBadge } from '@/modules/shared/components/TrustBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { GlassCard, GlassStat } from '@/modules/admin/components/GlassCard';
import { InvitationForm } from '@/modules/admin/components/InvitationForm';
import { RolesManagement } from '@/modules/admin/pages/RolesManagement';
import { PropertyGroupsManagement } from '@/modules/admin/pages/PropertyGroupsManagement';
import { ServiceGroupsManagement } from '@/modules/admin/pages/ServiceGroupsManagement';
import { ManagerAssignments } from '@/modules/admin/pages/ManagerAssignments';
import { VerificationReview } from '@/modules/admin/pages/VerificationReview';
import { PointsDashboardWidget } from '@/modules/points/PointsDashboardWidget';
import { PointsRulesManager } from '@/modules/admin/components/PointsRulesManager';
import { ServiceFeesManager } from '@/modules/admin/components/ServiceFeesManager';
import { statsApi, invitationsApi, type AdminStats, type Invitation } from '@/modules/admin/admin.api';
import { useDashboard } from '@/modules/dashboard/useDashboard';
import type { GridColumn } from '@/types/component.types';
import {
  Crown, Users, Shield, ShieldCheck, ShieldAlert, UserPlus,
  FileCheck2, FolderKanban, BarChart3, Building2, Send,
  Clock, CheckCircle2, XCircle, TrendingUp, Zap,
  Home, Calendar, Star, Compass, MapPin, ArrowRight,
  DollarSign, Trophy,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { color: string }> = {
  pending: { color: 'text-amber-600' },
  confirmed: { color: 'text-emerald-600' },
  completed: { color: 'text-primary' },
  cancelled: { color: 'text-destructive' },
};

export const HyperDashboard: React.FC = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);

  const { data: dashboardData } = useDashboard();
  const isHyperAdmin = user?.roles?.includes('hyper_admin');

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

  const invitationColumns = useMemo<GridColumn[]>(() => [
    { key: 'contact', title: 'Contact', render: (_: any, row: Invitation) => row.email || row.phone || '—' },
    { key: 'role', title: 'Role', width: '120px', render: (v: string) => <Badge variant={v === 'admin' ? 'default' : 'secondary'}>{v?.replace('_', ' ')}</Badge> },
    { key: 'status', title: 'Status', width: '120px', render: (v: string) => {
      const cfg: Record<string, { variant: any; icon: React.ReactNode }> = {
        pending: { variant: 'outline', icon: <Clock className="h-3 w-3" /> },
        accepted: { variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
        expired: { variant: 'secondary', icon: <XCircle className="h-3 w-3" /> },
        cancelled: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
      };
      const c = cfg[v] || cfg.pending;
      return <Badge variant={c.variant} className="gap-1">{c.icon} {v}</Badge>;
    }},
    { key: 'createdAt', title: 'Envoyé', width: '140px', render: (v: string) => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'actions', title: '', width: '100px', render: (_: any, row: Invitation) => row.status === 'pending' ? (
      <DynamicButton variant="ghost" size="sm" icon={<Send className="h-3.5 w-3.5" />} onClick={() => handleResend(row.id)}>Renvoyer</DynamicButton>
    ) : null },
  ], []);

  const handleResend = useCallback(async (id: string) => {
    try { await invitationsApi.resend(id); toast.success('Invitation renvoyée'); } catch { toast.error('Échec du renvoi'); }
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  // Chart data from dashboard
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
            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassStat title="Utilisateurs" value={stats?.totalUsers ?? 0} icon={<Users className="h-5 w-5" />} color="primary" />
              <GlassStat title="Managers actifs" value={stats?.activeManagers ?? 0} icon={<Shield className="h-5 w-5" />} color="secondary" />
              <GlassStat title="Assignations" value={stats?.totalAssignments ?? 0} icon={<ShieldCheck className="h-5 w-5" />} color="accent" />
              <GlassStat title="Vérif. en attente" value={stats?.pendingVerifications ?? 0} icon={<FileCheck2 className="h-5 w-5" />} color="amber" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassStat title="Propriétés" value={stats?.totalProperties ?? 0} icon={<Home className="h-5 w-5" />} color="primary" />
              <GlassStat title="Publiées" value={stats?.publishedProperties ?? 0} icon={<Building2 className="h-5 w-5" />} color="secondary" />
              <GlassStat title="Réservations" value={stats?.totalBookings ?? 0} icon={<Calendar className="h-5 w-5" />} color="accent" />
              <GlassStat title="Revenu total" value={`${(stats?.totalRevenue ?? 0).toLocaleString()} DA`} icon={<TrendingUp className="h-5 w-5" />} color="amber" />
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

            {/* Property Types + Trust Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Star className="h-5 w-5 text-accent" /> Trust Score moyen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-bold">{dashboardData?.stats.avgTrustStars ?? 0}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i <= Math.round(dashboardData?.stats.avgTrustStars ?? 0) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Score de confiance moyen sur toutes les propriétés</p>
                </CardContent>
              </Card>
            </div>

            {/* Role Distribution + Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" /> Distribution des rôles
                </h3>
                <div className="space-y-3">
                  {isHyperAdmin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-destructive" /><span className="text-sm">Hyper Admins</span></div>
                      <Badge variant="destructive">—</Badge>
                    </div>
                  )}
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
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FileCheck2 className="h-5 w-5 text-primary" /> Vérifications
                </h3>
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
                </CardContent>
              </Card>
            )}

            {/* Recent Bookings + Incoming Requests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recent Bookings */}
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
                  )}
                </CardContent>
              </Card>

              {/* Incoming Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Demandes entrantes</CardTitle>
                </CardHeader>
                <CardContent>
                  {(!dashboardData?.recentHostRequests || dashboardData.recentHostRequests.length === 0) ? (
                    <p className="text-sm text-muted-foreground text-center py-6">Aucune demande</p>
                  ) : (
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
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <GlassCard variant="accent" className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Actions rapides</h3>
                  <p className="text-sm text-muted-foreground mt-1">Gérer la plateforme</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setInviteOpen(true)} className="gap-2"><UserPlus className="h-4 w-4" /> Inviter</Button>
                  <Button variant="outline" onClick={() => navigate('/admin/verification-review')} className="gap-2"><FileCheck2 className="h-4 w-4" /> Vérifications</Button>
                  <Button variant="outline" onClick={() => navigate('/properties/new')} className="gap-2"><Building2 className="h-4 w-4" /> Propriété</Button>
                  <Button variant="outline" onClick={() => navigate('/services/new')} className="gap-2"><Compass className="h-4 w-4" /> Service</Button>
                </div>
              </div>
            </GlassCard>

            {/* Recent Invitations */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> Invitations récentes</h3>
                <Button variant="ghost" size="sm" onClick={loadInvitations}>Rafraîchir</Button>
              </div>
              <DynamicGrid columns={invitationColumns} data={invitations.slice(0, 10)} loading={invitationsLoading} emptyMessage="Aucune invitation" hoverable pageSize={10} />
            </GlassCard>
          </div>
        </ErrorBoundary>
      ),
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
      value: 'fees',
      label: t('dashboard.tabs.fees', 'Frais de service'),
      icon: <DollarSign className="h-4 w-4" />,
      content: <ErrorBoundary><ServiceFeesManager /></ErrorBoundary>,
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
      content: <ErrorBoundary><RolesManagement /></ErrorBoundary>,
    },
    {
      value: 'property-groups',
      label: t('dashboard.tabs.propertyGroups', 'Groupes Propriétés'),
      icon: <FolderKanban className="h-4 w-4" />,
      badge: stats?.totalGroups,
      content: <ErrorBoundary><PropertyGroupsManagement /></ErrorBoundary>,
    },
    {
      value: 'service-groups',
      label: t('dashboard.tabs.serviceGroups', 'Groupes Services'),
      icon: <Compass className="h-4 w-4" />,
      content: <ErrorBoundary><ServiceGroupsManagement /></ErrorBoundary>,
    },
    {
      value: 'assignments',
      label: t('dashboard.tabs.assignments', 'Assignations'),
      icon: <ShieldCheck className="h-4 w-4" />,
      badge: stats?.totalAssignments,
      content: <ErrorBoundary><ManagerAssignments /></ErrorBoundary>,
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

      <DynamicTabs tabs={tabs} defaultValue="overview" variant="underline" fullWidth />

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
