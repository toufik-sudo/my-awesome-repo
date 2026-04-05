import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { DynamicTabs } from '@/modules/shared/components/DynamicTabs';
import { DynamicCharts } from '@/modules/shared/components/DynamicCharts';
import { TrustBadge } from '@/modules/shared/components/TrustBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { GlassCard, GlassStat } from '@/modules/admin/components/GlassCard';
import { InvitationForm } from '@/modules/admin/components/InvitationForm';
import { RolesManagement } from '@/modules/admin/pages/RolesManagement';
import { GroupsManagement } from '@/modules/admin/pages/GroupsManagement';
import { ManagerAssignments } from '@/modules/admin/pages/ManagerAssignments';
import { VerificationReview } from '@/modules/admin/pages/VerificationReview';
import { AdminUsersManagement } from '@/modules/admin/pages/AdminUsersManagement';
import { PointsDashboardWidget } from '@/modules/points/PointsDashboardWidget';
import { PointsRulesManager } from '@/modules/admin/components/PointsRulesManager';
import { ServiceFeesManager } from '@/modules/admin/components/ServiceFeesManager';
import { FeeSimulator } from '@/modules/admin/components/FeeSimulator';
import { CancellationRulesPage } from '@/modules/admin/pages/CancellationRulesPage';
import { PaymentValidation } from '@/modules/payments/pages/PaymentValidation';
import { EmailAnalyticsPage } from '@/modules/admin/pages/EmailAnalyticsPage';
import { HostFeeAbsorptionPage } from '@/modules/admin/pages/HostFeeAbsorptionPage';
import { PayoutAccountsPage } from '@/modules/admin/pages/PayoutAccountsPage';
import { statsApi, assignmentsApi, type AdminStats } from '@/modules/admin/admin.api';
import { useDashboard } from '@/modules/dashboard/useDashboard';
import type { AppRole, ManagerAssignment, ManagerPermission, PermissionType } from '@/modules/admin/admin.types';
import { PERMISSION_LABELS, PERMISSION_CATEGORIES } from '@/modules/admin/admin.types';
import {
  Building2, Shield, ShieldCheck, ShieldX, Users, UserPlus, FileCheck2,
  FolderKanban, BarChart3, Zap, Home, Calendar, TrendingUp,
  CheckCircle2, Clock, XCircle, CalendarCheck, MessageSquare,
  DollarSign, Lock, Unlock, Star, PlusCircle, Compass,
  MapPin, ArrowRight, Trophy, CreditCard, Mail, Percent, Wallet,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { color: string }> = {
  pending: { color: 'text-amber-600' },
  confirmed: { color: 'text-emerald-600' },
  completed: { color: 'text-primary' },
  cancelled: { color: 'text-destructive' },
};

export const AdminManagerDashboard: React.FC = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const access = usePermissions();
  const { isAdmin, isManager, isHost, canInviteManager, canInviteGuest } = access;

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [assignments, setAssignments] = useState<ManagerAssignment[]>([]);
  const [permissionsMap, setPermissionsMap] = useState<Record<string, ManagerPermission[]>>({});

  const { data: dashboardData } = useDashboard();

  const loadData = useCallback(async () => {
    try {
      const [statsResult, assignResult] = await Promise.allSettled([
        statsApi.getDashboardStats(),
        assignmentsApi.getAll(),
      ]);
      if (statsResult.status === 'fulfilled') setStats(statsResult.value);
      if (assignResult.status === 'fulfilled') {
        const myAssignments = isManager
          ? assignResult.value.filter(a => a.managerId === Number(user?.id))
          : assignResult.value;
        setAssignments(myAssignments);

        const permMap: Record<string, ManagerPermission[]> = {};
        await Promise.all(
          myAssignments.map(async (a) => {
            try {
              const perms = await assignmentsApi.getPermissions(a.id);
              permMap[a.id] = perms;
            } catch { permMap[a.id] = []; }
          })
        );
        setPermissionsMap(permMap);
      }
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [user?.id, isManager]);

  useEffect(() => { loadData(); }, [loadData]);

  const hasPermission = useCallback((assignmentId: string, perm: PermissionType): boolean => {
    return (permissionsMap[assignmentId] || []).some(p => p.permission === perm && p.isGranted);
  }, [permissionsMap]);

  // Check if manager has a specific permission on ANY assignment
  const hasAnyPermission = useCallback((perm: PermissionType): boolean => {
    if (isAdmin) return true;
    return assignments.some(a => hasPermission(a.id, perm));
  }, [isAdmin, assignments, hasPermission]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  // Chart data
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

  // Determine allowed invitation roles for the modal
  const invitationRoles: AppRole[] = isAdmin ? ['manager', 'guest'] : isManager ? ['guest'] : [];

  const overviewContent = (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassStat title={t('dashboard.stats.properties', 'Propriétés')} value={stats?.totalProperties ?? 0} icon={<Home className="h-5 w-5" />} color="primary" />
        <GlassStat title={t('dashboard.stats.published', 'Publiées')} value={stats?.publishedProperties ?? 0} icon={<Building2 className="h-5 w-5" />} color="secondary" />
        <GlassStat title={t('dashboard.stats.bookings', 'Réservations')} value={stats?.totalBookings ?? 0} icon={<Calendar className="h-5 w-5" />} color="accent" />
        <GlassStat title={t('dashboard.stats.revenue', 'Revenu')} value={`${(stats?.totalRevenue ?? 0).toLocaleString()} DA`} icon={<TrendingUp className="h-5 w-5" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassStat title={t('dashboard.stats.users', 'Utilisateurs')} value={stats?.totalUsers ?? 0} icon={<Users className="h-5 w-5" />} color="primary" />
        <GlassStat title={t('dashboard.stats.managers', 'Managers')} value={stats?.activeManagers ?? 0} icon={<Shield className="h-5 w-5" />} color="secondary" />
        <GlassStat title={t('dashboard.stats.groups', 'Groupes')} value={stats?.totalGroups ?? 0} icon={<FolderKanban className="h-5 w-5" />} color="accent" />
        <GlassStat title={t('dashboard.stats.pendingVerif', 'Vérif. en attente')} value={stats?.pendingVerifications ?? 0} icon={<FileCheck2 className="h-5 w-5" />} color="amber" />
      </div>

      {/* Revenue Overview + Property Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revenueChartData.length > 0 && (
          <DynamicCharts
            data={revenueChartData}
            type="area"
            series={[
              { dataKey: 'revenue', name: t('dashboard.charts.revenue', 'Revenu'), color: 'hsl(var(--primary))' },
              { dataKey: 'bookings', name: t('dashboard.charts.bookings', 'Réservations'), color: 'hsl(var(--secondary))' },
            ]}
            title={t('dashboard.charts.revenueOverview', 'Aperçu des revenus')}
            description={t('dashboard.charts.last6months', '6 derniers mois')}
            withCard
            chartHeight={250}
          />
        )}

        {propertyTypeData.length > 0 && (
          <DynamicCharts
            data={propertyTypeData}
            type="pie"
            series={[{ dataKey: 'value' }]}
            title={t('dashboard.charts.propertyTypes', 'Types de propriétés')}
            description={t('dashboard.charts.distribution', 'Distribution par type')}
            withCard
            chartHeight={250}
            labelKey="name"
            valueKey="value"
          />
        )}
      </div>

      {/* Trust Score + Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" /> Trust Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl font-bold">{dashboardData?.stats.avgTrustStars ?? 0}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`h-5 w-5 ${i <= Math.round(dashboardData?.stats.avgTrustStars ?? 0) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{t('dashboard.trustScoreAvg', 'Score moyen de confiance')}</p>
          </CardContent>
        </Card>

        {isAdmin && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FileCheck2 className="h-5 w-5 text-primary" /> {t('dashboard.verifications', 'Vérifications')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm">{t('common.pending', 'En attente')}</span><Badge variant="outline" className="text-amber-600 border-amber-600">{stats?.pendingVerifications ?? 0}</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm">{t('common.approved', 'Approuvées')}</span><Badge className="bg-emerald-600 hover:bg-emerald-700">{stats?.approvedVerifications ?? 0}</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm">{t('common.rejected', 'Rejetées')}</span><Badge variant="destructive">{stats?.rejectedVerifications ?? 0}</Badge></div>
              {(stats?.pendingVerifications ?? 0) + (stats?.approvedVerifications ?? 0) > 0 && (
                <Progress value={((stats?.approvedVerifications ?? 0) / Math.max((stats?.pendingVerifications ?? 0) + (stats?.approvedVerifications ?? 0) + (stats?.rejectedVerifications ?? 0), 1)) * 100} className="h-2 mt-2" />
              )}
            </div>
          </GlassCard>
        )}
      </div>

      {/* Recent Properties */}
      {dashboardData?.properties && dashboardData.properties.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t('dashboard.recentProperties', 'Mes propriétés récentes')}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/properties')} className="gap-1">{t('common.viewAll', 'Voir tout')} <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dashboardData.properties.slice(0, 6).map(property => (
                <div key={property.id} className="group flex gap-3 p-3 rounded-lg border border-border/60 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{property.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{property.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <TrustBadge trustStars={property.trustStars} isVerified={property.isVerified} size="sm" showLabel={false} />
                      <span className="text-xs font-semibold text-primary">{property.price.toLocaleString()} DA</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Bookings + Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-lg">{t('dashboard.recentBookings', 'Réservations récentes')}</CardTitle></CardHeader>
          <CardContent>
            {(!dashboardData?.recentBookings || dashboardData.recentBookings.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-6">{t('dashboard.noBookings', 'Aucune réservation')}</p>
            ) : (
              <div className="space-y-2">
                {dashboardData.recentBookings.slice(0, 5).map(b => (
                  <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={b.propertyImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{b.propertyTitle}</p>
                      <p className="text-xs text-muted-foreground">{b.location}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`text-xs ${STATUS_CONFIG[b.status]?.color || ''}`}>{b.status}</Badge>
                      <p className="text-xs font-medium">{Number(b.totalPrice).toLocaleString()} DA</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">{t('dashboard.incomingRequests', 'Demandes entrantes')}</CardTitle></CardHeader>
          <CardContent>
            {(!dashboardData?.recentHostRequests || dashboardData.recentHostRequests.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-6">{t('dashboard.noRequests', 'Aucune demande')}</p>
            ) : (
              <div className="space-y-2">
                {dashboardData.recentHostRequests.slice(0, 5).map(req => (
                  <div key={req.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="p-2 rounded-full bg-muted"><Users className="h-4 w-4 text-muted-foreground" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{req.guestName}</p>
                      <p className="text-xs text-muted-foreground truncate">{req.propertyTitle}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`text-xs ${STATUS_CONFIG[req.status]?.color || ''}`}>{req.status}</Badge>
                      <p className="text-xs font-medium">{Number(req.totalPrice).toLocaleString()} DA</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Team + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isAdmin && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Shield className="h-5 w-5 text-primary" /> {t('dashboard.team', 'Équipe')}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm">{t('roles.manager', 'Managers')}</span><Badge variant="secondary">{stats?.totalManagers ?? 0}</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm">{t('roles.guest', 'Guests')}</span><Badge variant="outline">{stats?.totalGuests ?? 0}</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm">{t('dashboard.assignments', 'Assignations')}</span><Badge variant="outline">{stats?.totalAssignments ?? 0}</Badge></div>
            </div>
          </GlassCard>
        )}

        <GlassCard variant="accent" className="p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Zap className="h-5 w-5 text-primary" /> {t('dashboard.quickActions', 'Actions rapides')}</h3>
          <div className="flex flex-wrap gap-2">
            {canInviteManager && <Button onClick={() => setInviteOpen(true)} className="gap-2"><UserPlus className="h-4 w-4" /> {t('dashboard.inviteManager', 'Inviter Manager')}</Button>}
            {canInviteGuest && !canInviteManager && <Button onClick={() => setInviteOpen(true)} className="gap-2"><UserPlus className="h-4 w-4" /> {t('dashboard.inviteGuest', 'Inviter Guest')}</Button>}
            {access.canCreateProperty && <Button variant="outline" onClick={() => navigate('/properties/new')} className="gap-2"><PlusCircle className="h-4 w-4" /> {t('dashboard.newProperty', 'Propriété')}</Button>}
            {access.canCreateService && <Button variant="outline" onClick={() => navigate('/services/new')} className="gap-2"><Compass className="h-4 w-4" /> {t('dashboard.newService', 'Service')}</Button>}
            <Button variant="outline" onClick={() => navigate('/properties')} className="gap-2"><Building2 className="h-4 w-4" /> {t('dashboard.myProperties', 'Mes Propriétés')}</Button>
          </div>
        </GlassCard>
      </div>

      {/* Manager Assignments */}
      {assignments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> {t('dashboard.assignments', 'Assignations')}</h3>
          {assignments.map(assignment => {
            const perms = permissionsMap[assignment.id] || [];
            const granted = perms.filter(p => p.isGranted);
            const scopeLabel = assignment.scope === 'all' ? t('scope.all', 'Toutes les propriétés') : assignment.scope === 'property' ? assignment.property?.title || 'Propriété' : assignment.propertyGroup?.name || 'Groupe';

            return (
              <GlassCard key={assignment.id} variant="elevated" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-lg">{scopeLabel}</h4>
                      <Badge variant={assignment.scope === 'all' ? 'destructive' : 'secondary'}>{assignment.scope.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{granted.length} / {Object.keys(PERMISSION_LABELS).length} permissions</p>
                  </div>
                  <Badge variant={assignment.isActive ? 'default' : 'outline'}>{assignment.isActive ? t('common.active', 'Actif') : t('common.inactive', 'Inactif')}</Badge>
                </div>
                <Separator className="mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(PERMISSION_CATEGORIES).map(([category, categoryPerms]) => (
                    <div key={category} className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</p>
                      {categoryPerms.map(perm => {
                        const isGranted = hasPermission(assignment.id, perm);
                        return (
                          <div key={perm} className="flex items-center gap-2 text-sm">
                            {isGranted ? <Unlock className="h-3.5 w-3.5 text-emerald-500" /> : <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />}
                            <span className={isGranted ? 'text-foreground' : 'text-muted-foreground/50'}>{PERMISSION_LABELS[perm]}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/40">
                  {hasPermission(assignment.id, 'view_bookings') && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/bookings/host')} className="gap-1.5"><CalendarCheck className="h-3.5 w-3.5" /> {t('nav.bookings', 'Réservations')}</Button>
                  )}
                  {hasPermission(assignment.id, 'contact_guests') && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/support')} className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Messages</Button>
                  )}
                  {hasPermission(assignment.id, 'modify_prices') && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/properties')} className="gap-1.5"><DollarSign className="h-3.5 w-3.5" /> {t('nav.prices', 'Tarifs')}</Button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );

  const tabs = [
    { value: 'overview', label: t('dashboard.tabs.overview', 'Vue d\'ensemble'), icon: <BarChart3 className="h-4 w-4" />, content: <ErrorBoundary>{overviewContent}</ErrorBoundary> },

    // Points — available for admin; manager with view_analytics permission
    ...(isAdmin || access.canViewAnalytics ? [{
      value: 'points', label: t('dashboard.tabs.points', 'Points & Récompenses'), icon: <Trophy className="h-4 w-4" />, content: (
        <ErrorBoundary>
          <div className="space-y-6">
            <PointsDashboardWidget />
            {isAdmin && <PointsRulesManager />}
          </div>
        </ErrorBoundary>
      ),
    }] : []),

    // Fees — admin only or manager with view_analytics
    ...(isAdmin || access.canViewAnalytics ? [{
      value: 'fees', label: t('dashboard.tabs.fees', 'Frais & Marges'), icon: <DollarSign className="h-4 w-4" />, content: (
        <ErrorBoundary>
          <div className="space-y-6">
            {isAdmin && <ServiceFeesManager />}
            <FeeSimulator />
          </div>
        </ErrorBoundary>
      ),
    }] : []),

    // Fee Absorption — admin or manager with manage_fee_absorption
    ...(access.canManageFeeAbsorption ? [{
      value: 'fee-absorption', label: t('dashboard.tabs.absorption', 'Absorption frais'), icon: <Percent className="h-4 w-4" />, content: (
        <ErrorBoundary><HostFeeAbsorptionPage /></ErrorBoundary>
      ),
    }] : []),

    // Cancellation Rules — admin or manager with manage_cancellation_rules
    ...(access.canManageCancellationRules ? [{
      value: 'cancellation', label: t('dashboard.tabs.cancellation', "Règles d'annulation"), icon: <ShieldX className="h-4 w-4" />, content: (
        <ErrorBoundary><CancellationRulesPage /></ErrorBoundary>
      ),
    }] : []),

    // Payout Accounts — admin only
    ...(isAdmin ? [{
      value: 'payout-accounts', label: t('dashboard.tabs.payoutAccounts', 'Comptes de paiement'), icon: <Wallet className="h-4 w-4" />, content: (
        <ErrorBoundary><PayoutAccountsPage /></ErrorBoundary>
      ),
    }] : []),

    // Email Analytics — admin or manager with view_email_analytics
    ...(access.canViewEmailAnalytics ? [{
      value: 'email-analytics', label: t('dashboard.tabs.emailAnalytics', 'Email Analytics'), icon: <Mail className="h-4 w-4" />, content: (
        <ErrorBoundary><EmailAnalyticsPage /></ErrorBoundary>
      ),
    }] : []),

    // Users Management — admin manages own invitees; manager sees own guests
    {
      value: 'users', label: t('dashboard.tabs.users', 'Utilisateurs'), icon: <Users className="h-4 w-4" />, content: (
        <ErrorBoundary><AdminUsersManagement /></ErrorBoundary>
      ),
    },

    // Groups — admin only
    ...(isAdmin ? [{
      value: 'groups', label: t('dashboard.tabs.groups', 'Groupes'), icon: <FolderKanban className="h-4 w-4" />, badge: stats?.totalGroups, content: (
        <ErrorBoundary><GroupsManagement /></ErrorBoundary>
      ),
    }] : []),

    // Assignments — admin manages their managers; manager sees own assignments
    {
      value: 'assignments', label: t('dashboard.tabs.assignments', 'Assignations'), icon: <ShieldCheck className="h-4 w-4" />, badge: stats?.totalAssignments, content: (
        <ErrorBoundary><ManagerAssignments /></ErrorBoundary>
      ),
    },

    // Verifications — admin or manager with verify_documents
    ...(access.canVerifyDocuments ? [{
      value: 'verifications', label: t('dashboard.tabs.verifications', 'Vérifications'), icon: <FileCheck2 className="h-4 w-4" />, badge: stats?.pendingVerifications, content: (
        <ErrorBoundary><VerificationReview /></ErrorBoundary>
      ),
    }] : []),

    // Roles — admin only (manages manager/guest roles)
    ...(isAdmin ? [{
      value: 'roles', label: t('dashboard.tabs.roles', 'Rôles'), icon: <Users className="h-4 w-4" />, content: (
        <ErrorBoundary><RolesManagement excludeHyperAdmin /></ErrorBoundary>
      ),
    }] : []),

    // Payment Validation — admin or manager with view_payments
    ...(access.canViewPayments ? [{
      value: 'payment-validation', label: t('dashboard.tabs.paymentValidation', 'Validation paiements'), icon: <CreditCard className="h-4 w-4" />, content: (
        <ErrorBoundary><PaymentValidation /></ErrorBoundary>
      ),
    }] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 dark:from-primary/20 dark:to-accent/10 p-6 sm:p-8 border border-border/30">
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
              {isAdmin ? <Building2 className="h-8 w-8 text-primary" /> : <Shield className="h-8 w-8 text-secondary" />}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {isAdmin ? t('dashboard.adminTitle', 'Dashboard Admin') : t('dashboard.managerTitle', 'Dashboard Manager')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isAdmin ? t('dashboard.adminSubtitle', 'Gérer vos propriétés, équipes et vérifications') : t('dashboard.managerSubtitle', 'Gérer vos propriétés assignées')}
              </p>
            </div>
          </div>
          {(canInviteManager || canInviteGuest) && (
            <Button onClick={() => setInviteOpen(true)} size="lg" className="gap-2 shadow-lg shadow-primary/20">
              <UserPlus className="h-5 w-5" /> {t('dashboard.invite', 'Inviter')}
            </Button>
          )}
        </div>
      </div>

      <DynamicTabs tabs={tabs} defaultValue="overview" variant="underline" fullWidth />

      {(canInviteManager || canInviteGuest) && (
        <InvitationForm
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          allowedRoles={invitationRoles}
          onSuccess={loadData}
        />
      )}
    </div>
  );
});

AdminManagerDashboard.displayName = 'AdminManagerDashboard';
