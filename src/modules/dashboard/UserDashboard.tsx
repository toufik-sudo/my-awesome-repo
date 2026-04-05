import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { DynamicTabs } from '@/modules/shared/components/DynamicTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard, GlassStat } from '@/modules/admin/components/GlassCard';
import { PointsDashboardWidget } from '@/modules/points/PointsDashboardWidget';
import { useDashboard } from './useDashboard';
import {
  Home, Calendar, Star, MapPin, ArrowRight, Search, Heart,
  CreditCard, Compass, Trophy, BarChart3, Eye, HelpCircle,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { color: string }> = {
  pending: { color: 'text-amber-600' },
  confirmed: { color: 'text-emerald-600' },
  completed: { color: 'text-primary' },
  cancelled: { color: 'text-destructive' },
};

/**
 * User Dashboard — full platform access (all properties/services).
 * Can: browse everything, book anywhere, view points, comment, share, support, profile.
 * Cannot: manage properties/services/users. No admin/manager relationship.
 */
export const UserDashboard: React.FC = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const tabs = [
    {
      value: 'overview',
      label: t('dashboard.tabs.overview', 'Vue d\'ensemble'),
      icon: <BarChart3 className="h-4 w-4" />,
      content: (
        <ErrorBoundary>
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassStat
                title={t('dashboard.stats.bookings', 'Mes réservations')}
                value={data?.stats.totalBookings ?? 0}
                icon={<Calendar className="h-5 w-5" />}
                color="primary"
                onClick={() => navigate('/bookings')}
              />
              <GlassStat
                title={t('dashboard.stats.favorites', 'Favoris')}
                value={data?.stats.favoritesCount ?? 0}
                icon={<Heart className="h-5 w-5" />}
                color="accent"
              />
              <GlassStat
                title={t('dashboard.stats.pending', 'En attente')}
                value={data?.stats.pendingBookings ?? 0}
                icon={<CreditCard className="h-5 w-5" />}
                color="secondary"
              />
              <GlassStat
                title={t('dashboard.stats.properties', 'Propriétés vues')}
                value={data?.stats.totalProperties ?? 0}
                icon={<Home className="h-5 w-5" />}
                color="amber"
              />
            </div>

            {/* Quick Actions */}
            <GlassCard variant="accent" className="p-6">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                {t('dashboard.quickActions', 'Actions rapides')}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate('/properties')} className="gap-2">
                  <Search className="h-4 w-4" /> {t('dashboard.browseProperties', 'Parcourir les propriétés')}
                </Button>
                <Button variant="outline" onClick={() => navigate('/services')} className="gap-2">
                  <Compass className="h-4 w-4" /> {t('dashboard.browseServices', 'Services touristiques')}
                </Button>
                <Button variant="outline" onClick={() => navigate('/bookings')} className="gap-2">
                  <Calendar className="h-4 w-4" /> {t('dashboard.myBookings', 'Mes réservations')}
                </Button>
                <Button variant="outline" onClick={() => navigate('/booking-calendar')} className="gap-2">
                  <Calendar className="h-4 w-4" /> {t('dashboard.calendar', 'Calendrier')}
                </Button>
                <Button variant="outline" onClick={() => navigate('/support')} className="gap-2">
                  <HelpCircle className="h-4 w-4" /> {t('dashboard.support', 'Support')}
                </Button>
              </div>
            </GlassCard>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t('dashboard.recentBookings', 'Réservations récentes')}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')} className="gap-1">
                    {t('common.viewAll', 'Voir tout')} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(!data?.recentBookings || data.recentBookings.length === 0) ? (
                  <div className="text-center py-8">
                    <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">{t('dashboard.noBookings', 'Aucune réservation')}</p>
                    <Button size="sm" onClick={() => navigate('/properties')}>
                      <Search className="h-4 w-4 mr-1" /> {t('dashboard.browseNow', 'Explorer maintenant')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.recentBookings.slice(0, 5).map(b => (
                      <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={b.propertyImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{b.propertyTitle}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{b.location}</p>
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
          <PointsDashboardWidget />
        </ErrorBoundary>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 sm:p-8 border border-border/30">
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t('dashboard.userTitle', 'Mon espace')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('dashboard.userSubtitle', 'Accès complet à toutes les propriétés et services de la plateforme')}
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/properties')} size="lg" className="gap-2 shadow-lg shadow-primary/20">
            <Search className="h-5 w-5" /> {t('dashboard.explore', 'Explorer')}
          </Button>
        </div>
      </div>

      <DynamicTabs tabs={tabs} defaultValue="overview" variant="underline" />
    </div>
  );
});

UserDashboard.displayName = 'UserDashboard';
