import React, { memo, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Home, Calendar, TrendingUp, Heart, ShieldCheck, Star, MapPin, Users,
  Clock, CheckCircle2, XCircle, ArrowRight, Building2, AlertCircle,
  Search, Plus, Eye, UserPlus, Compass,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout, DashboardStatCard, DashboardQuickAction } from '@/modules/shared/layout/DashboardLayout';
import { DynamicCharts } from '@/modules/shared/components/DynamicCharts';
import { TrustBadge } from '@/modules/shared/components/TrustBadge';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { PointsDashboardWidget } from '@/modules/points/PointsDashboardWidget';
import { useDashboard } from './useDashboard';
import { format, parseISO } from 'date-fns';
import { BookingDetailModal } from './components/BookingDetailModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { HostRequestDetailModal } from './components/HostRequestDetailModal';
import { CreateUserModal } from './components/CreateUserModal';
import { bookingsApi } from '@/modules/bookings/bookings.api';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import type { RecentBooking, HostRequest, DashboardProperty } from './dashboard.types';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  confirmed: { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  completed: { icon: CheckCircle2, color: 'text-primary', bgColor: 'bg-primary/10' },
  cancelled: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
};

export const Dashboard = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDashboard();

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<RecentBooking | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<DashboardProperty | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<HostRequest | null>(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);

  const canAddProperty = useMemo(() => {
    if (!user?.roles) return false;
    return user.roles.some(r => ['hyper_admin', 'admin', 'hyper_manager', 'manager'].includes(r));
  }, [user]);

  const canManageBookings = useMemo(() => {
    if (!user?.roles) return false;
    return user.roles.some(r => ['hyper_admin', 'admin', 'hyper_manager', 'manager'].includes(r));
  }, [user]);

  const canCreateUsers = useMemo(() => {
    if (!user?.roles) return false;
    return user.roles.some(r => ['hyper_admin', 'hyper_manager'].includes(r));
  }, [user]);

  const createUserRoles = useMemo(() => {
    if (!user?.roles) return [];
    if (user.roles.includes('hyper_admin')) return ['admin', 'manager'];
    if (user.roles.includes('hyper_manager')) return ['admin', 'manager'];
    return [];
  }, [user]);

  // Booking approve/reject handlers
  const handleApproveBooking = useCallback(async (id: string) => {
    try {
      await bookingsApi.accept(id, '');
      toast.success('Réservation approuvée');
      refetch();
    } catch {
      toast.error('Erreur lors de l\'approbation');
    }
  }, [refetch]);

  const handleRejectBooking = useCallback(async (id: string, reason: string) => {
    try {
      await bookingsApi.decline(id, '', reason);
      toast.success('Réservation rejetée');
      refetch();
    } catch {
      toast.error('Erreur lors du rejet');
    }
  }, [refetch]);

  const stats: DashboardStatCard[] = useMemo(() => {
    if (!data) return [];
    return [
      {
        title: t('dashboard.stats.properties'),
        value: data.stats.totalProperties,
        icon: <Home className="h-5 w-5" />,
        color: 'primary',
        change: data.stats.publishedProperties > 0 ? Math.round((data.stats.publishedProperties / data.stats.totalProperties) * 100) : 0,
        changeLabel: t('dashboard.stats.published'),
      },
      {
        title: t('dashboard.stats.totalRevenue'),
        value: `${data.stats.totalRevenue.toLocaleString()} DA`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: 'accent',
      },
      {
        title: t('dashboard.stats.bookings'),
        value: data.stats.totalBookings,
        icon: <Calendar className="h-5 w-5" />,
        color: 'secondary',
        change: data.stats.pendingBookings,
        changeLabel: t('dashboard.stats.pending'),
      },
      {
        title: t('dashboard.stats.favorites'),
        value: data.stats.favoritesCount,
        icon: <Heart className="h-5 w-5" />,
        color: 'destructive',
      },
    ];
  }, [data, t]);

  const quickActions: DashboardQuickAction[] = useMemo(() => {
    const actions: DashboardQuickAction[] = [];
    if (canAddProperty) {
      actions.push({
        label: t('dashboard.actions.addProperty'),
        icon: <Plus className="h-4 w-4" />,
        onClick: () => navigate('/properties/new'),
        variant: 'default' as const,
      });
      actions.push({
        label: t('dashboard.actions.addService', 'Ajouter Service'),
        icon: <Compass className="h-4 w-4" />,
        onClick: () => navigate('/services/new'),
        variant: 'default' as const,
      });
    }
    if (canCreateUsers) {
      actions.push({
        label: 'Créer Admin/Manager',
        icon: <UserPlus className="h-4 w-4" />,
        onClick: () => setCreateUserOpen(true),
        variant: 'default' as const,
      });
    }
    actions.push(
      {
        label: t('dashboard.actions.browseProperties'),
        icon: <Search className="h-4 w-4" />,
        onClick: () => navigate('/properties'),
        variant: 'outline' as const,
      },
      {
        label: t('dashboard.actions.myBookings'),
        icon: <Calendar className="h-4 w-4" />,
        onClick: () => navigate('/bookings'),
        variant: 'outline' as const,
      },
      {
        label: t('dashboard.actions.settings'),
        icon: <Building2 className="h-4 w-4" />,
        onClick: () => navigate('/settings'),
        variant: 'ghost' as const,
      },
    );
    return actions;
  }, [t, navigate, canAddProperty, canCreateUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">{error || t('dashboard.error')}</p>
        <Button onClick={refetch}>{t('dashboard.retry')}</Button>
      </div>
    );
  }

  const revenueChartData = data.revenueByMonth.map(m => ({
    name: m.month,
    revenue: m.revenue,
    bookings: m.bookings,
  }));

  const verificationData = [
    { name: t('dashboard.verification.approved'), value: data.verificationStats.approved },
    { name: t('dashboard.verification.pending'), value: data.verificationStats.pending },
    { name: t('dashboard.verification.rejected'), value: data.verificationStats.rejected },
  ].filter(d => d.value > 0);

  const propertyTypeData = Object.entries(data.propertyTypeDistribution).map(([key, value]) => ({
    name: t(`byootdz.categories.${key}s`, key),
    value,
  }));

  // Sidebar content
  const sidebar = (
    <div className="space-y-4">
      {data.verificationStats.total > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {t('dashboard.verification.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('dashboard.verification.approved')}</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                {data.verificationStats.approved}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('dashboard.verification.pending')}</span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30">
                {data.verificationStats.pending}
              </Badge>
            </div>
            {data.verificationStats.rejected > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('dashboard.verification.rejected')}</span>
                <Badge variant="destructive">{data.verificationStats.rejected}</Badge>
              </div>
            )}
            <Progress
              value={(data.verificationStats.approved / Math.max(data.verificationStats.total, 1)) * 100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {Math.round((data.verificationStats.approved / Math.max(data.verificationStats.total, 1)) * 100)}% {t('dashboard.verification.rate')}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-accent" />
            {t('dashboard.trustScore')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">{data.stats.avgTrustStars}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i <= Math.round(data.stats.avgTrustStars) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t('dashboard.avgTrustDesc')}
          </p>
        </CardContent>
      </Card>

      {data.stats.pendingRequests > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{data.stats.pendingRequests} {t('dashboard.pendingRequests')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.pendingRequestsDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <>
      <DashboardLayout
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        stats={stats}
        quickActions={quickActions}
        sidebar={sidebar}
        sidebarPosition="right"
        gridCols={2}
      >
        {/* Revenue Chart */}
        <ErrorBoundary>
          <DynamicCharts
            data={revenueChartData}
            type="area"
            series={[
              { dataKey: 'revenue', name: t('dashboard.charts.revenue'), color: 'hsl(var(--primary))' },
              { dataKey: 'bookings', name: t('dashboard.charts.bookings'), color: 'hsl(var(--secondary))' },
            ]}
            title={t('dashboard.charts.revenueTitle')}
            description={t('dashboard.charts.revenueDesc')}
            withCard
            chartHeight={280}
          />
        </ErrorBoundary>

        {/* Property Type Distribution */}
        {propertyTypeData.length > 0 && (
          <ErrorBoundary>
            <DynamicCharts
              data={propertyTypeData}
              type="pie"
              series={[{ dataKey: 'value' }]}
              title={t('dashboard.charts.propertyTypes')}
              description={t('dashboard.charts.propertyTypesDesc')}
              withCard
              chartHeight={280}
              labelKey="name"
              valueKey="value"
            />
          </ErrorBoundary>
        )}

        {/* My Properties */}
        <Card className="col-span-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{t('dashboard.myProperties')}</CardTitle>
                <CardDescription>{data.stats.totalProperties} {t('dashboard.total')}</CardDescription>
              </div>
              <div className="flex gap-2">
                {canAddProperty && (
                  <Button size="sm" onClick={() => navigate('/properties/new')} className="gap-1">
                    <Plus className="h-4 w-4" />
                    {t('dashboard.actions.addProperty')}
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => navigate('/properties')} className="gap-1">
                  {t('dashboard.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {data.properties.length === 0 ? (
              <div className="text-center py-8">
                <Home className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">{t('dashboard.noProperties')}</p>
                {canAddProperty && (
                  <Button size="sm" onClick={() => navigate('/properties/new')}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t('dashboard.actions.addProperty')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.properties.map(property => (
                  <div
                    key={property.id}
                    className="group flex gap-3 p-3 rounded-lg border border-border/60 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {property.title}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <TrustBadge trustStars={property.trustStars} isVerified={property.isVerified} size="sm" showLabel={false} />
                        <span className="text-xs text-muted-foreground">
                          <Star className="h-3 w-3 inline fill-accent text-accent" /> {property.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-semibold text-primary">{property.price.toLocaleString()} DA</span>
                        <Badge variant={property.status === 'published' ? 'secondary' : 'outline'} className="text-[10px] px-1.5 py-0">
                          {property.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t('dashboard.recentBookings')}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')} className="gap-1">
                {t('dashboard.viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data.recentBookings.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('dashboard.noBookings')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentBookings.map(booking => {
                  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={booking.propertyImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{booking.propertyTitle}</p>
                        <p className="text-xs text-muted-foreground">{booking.location}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`flex items-center gap-1 text-xs ${cfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {booking.status}
                        </div>
                        <p className="text-xs font-medium">{Number(booking.totalPrice).toLocaleString()} DA</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Host Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.hostRequests')}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentHostRequests.length === 0 ? (
              <div className="text-center py-6">
                <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('dashboard.noHostRequests')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentHostRequests.map(req => {
                  const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <div
                      key={req.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedRequest(req)}
                    >
                      <div className="p-2 rounded-full bg-muted">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{req.guestName}</p>
                        <p className="text-xs text-muted-foreground truncate">{req.propertyTitle}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`flex items-center gap-1 text-xs ${cfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {req.status}
                        </div>
                        <p className="text-xs font-medium">{Number(req.totalPrice).toLocaleString()} DA</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Points & Rewards */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              {t('points.title', 'Points & Récompenses')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              <PointsDashboardWidget />
            </ErrorBoundary>
          </CardContent>
        </Card>
      </DashboardLayout>

      {/* Detail Modals */}
      <BookingDetailModal
        booking={selectedBooking}
        open={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
        canManage={canManageBookings}
        onApprove={handleApproveBooking}
        onReject={handleRejectBooking}
      />
      <PropertyDetailModal
        property={selectedProperty}
        open={!!selectedProperty}
        onOpenChange={(open) => !open && setSelectedProperty(null)}
      />
      <HostRequestDetailModal
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
        onApprove={handleApproveBooking}
        onReject={handleRejectBooking}
      />
      <CreateUserModal
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        allowedRoles={createUserRoles}
        onSuccess={refetch}
      />
    </>
  );
});

Dashboard.displayName = 'Dashboard';
export default Dashboard;
