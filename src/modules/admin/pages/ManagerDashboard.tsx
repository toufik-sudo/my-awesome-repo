import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { GlassCard, GlassStat } from '../components/GlassCard';
import { assignmentsApi, statsApi, type AdminStats } from '../admin.api';
import type { ManagerAssignment, ManagerPermission, PermissionType } from '../admin.types';
import { PERMISSION_LABELS, PERMISSION_CATEGORIES } from '../admin.types';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  Shield,
  CalendarCheck,
  MessageSquare,
  Eye,
  DollarSign,
  Lock,
  Unlock,
  Activity,
  Home,
  Calendar,
  TrendingUp,
  Users,
  FileCheck2,
} from 'lucide-react';

export const ManagerDashboard: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<ManagerAssignment[]>([]);
  const [permissionsMap, setPermissionsMap] = useState<Record<string, ManagerPermission[]>>({});
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [assignData, statsData] = await Promise.allSettled([
        assignmentsApi.getAll(),
        statsApi.getDashboardStats(),
      ]);

      if (assignData.status === 'fulfilled') {
        const myAssignments = assignData.value.filter(a => a.managerId === Number(user?.id));
        setAssignments(myAssignments);

        // Load permissions for each assignment
        const permMap: Record<string, ManagerPermission[]> = {};
        await Promise.all(
          myAssignments.map(async (a) => {
            try {
              const perms = await assignmentsApi.getPermissions(a.id);
              permMap[a.id] = perms;
            } catch {
              permMap[a.id] = [];
            }
          })
        );
        setPermissionsMap(permMap);
      }

      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      }
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const hasPermission = useCallback((assignmentId: string, perm: PermissionType): boolean => {
    const perms = permissionsMap[assignmentId] || [];
    return perms.some(p => p.permission === perm && p.isGranted);
  }, [permissionsMap]);

  const totalProperties = useMemo(() => {
    return assignments.reduce((count, a) => {
      if (a.scope === 'all') return count + 999;
      return count + 1;
    }, 0);
  }, [assignments]);

  const grantedPermissions = useMemo(() => {
    const allPerms = new Set<PermissionType>();
    Object.values(permissionsMap).forEach(perms => {
      perms.filter(p => p.isGranted).forEach(p => allPerms.add(p.permission));
    });
    return allPerms;
  }, [permissionsMap]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/10 via-background to-primary/10 dark:from-secondary/20 dark:to-primary/20 p-6 sm:p-8 border border-border/30">
        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-secondary/10 backdrop-blur-sm border border-secondary/20">
            <Shield className="h-8 w-8 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manager Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your assigned properties and tasks</p>
          </div>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassStat
          title="Assigned Properties"
          value={totalProperties > 900 ? 'All' : totalProperties}
          icon={<Building2 className="h-5 w-5" />}
          color="primary"
        />
        <GlassStat
          title="Active Permissions"
          value={grantedPermissions.size}
          icon={<Unlock className="h-5 w-5" />}
          color="secondary"
        />
        <GlassStat
          title="Assignments"
          value={assignments.length}
          icon={<Activity className="h-5 w-5" />}
          color="accent"
        />
        <GlassStat
          title="Total Bookings"
          value={stats?.totalBookings ?? 0}
          icon={<Calendar className="h-5 w-5" />}
          color="amber"
        />
      </div>

      {/* Extended Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassStat
          title="Total Properties"
          value={stats?.totalProperties ?? 0}
          icon={<Home className="h-5 w-5" />}
          color="primary"
        />
        <GlassStat
          title="Pending Bookings"
          value={stats?.pendingBookings ?? 0}
          icon={<CalendarCheck className="h-5 w-5" />}
          color="secondary"
        />
        <GlassStat
          title="Pending Verifications"
          value={stats?.pendingVerifications ?? 0}
          icon={<FileCheck2 className="h-5 w-5" />}
          color="accent"
        />
        <GlassStat
          title="Revenue"
          value={`${(stats?.totalRevenue ?? 0).toLocaleString()} DA`}
          icon={<TrendingUp className="h-5 w-5" />}
          color="amber"
        />
      </div>

      {/* Assignments */}
      <div className="grid gap-4">
        {assignments.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No assignments yet. An admin will assign properties to you.</p>
          </GlassCard>
        ) : (
          assignments.map((assignment) => {
            const perms = permissionsMap[assignment.id] || [];
            const granted = perms.filter(p => p.isGranted);
            const scopeLabel = assignment.scope === 'all'
              ? 'All Properties'
              : assignment.scope === 'property'
                ? assignment.property?.title || 'Property'
                : assignment.propertyGroup?.name || 'Property Group';

            return (
              <GlassCard key={assignment.id} variant="elevated" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{scopeLabel}</h3>
                      <Badge variant={assignment.scope === 'all' ? 'destructive' : assignment.scope === 'property' ? 'secondary' : 'default'}>
                        {assignment.scope.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {granted.length} of {Object.keys(PERMISSION_LABELS).length} permissions granted
                    </p>
                  </div>
                  <Badge variant={assignment.isActive ? 'default' : 'outline'}>
                    {assignment.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <Separator className="mb-4" />

                {/* Permissions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(PERMISSION_CATEGORIES).map(([category, categoryPerms]) => (
                    <div key={category} className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</p>
                      {categoryPerms.map(perm => {
                        const isGranted = hasPermission(assignment.id, perm);
                        return (
                          <div key={perm} className="flex items-center gap-2 text-sm">
                            {isGranted ? (
                              <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
                            )}
                            <span className={isGranted ? 'text-foreground' : 'text-muted-foreground/50'}>
                              {PERMISSION_LABELS[perm]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Quick Action Buttons based on permissions */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/40">
                  {hasPermission(assignment.id, 'view_bookings') && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/bookings/host')} className="gap-1.5">
                      <CalendarCheck className="h-3.5 w-3.5" /> Bookings
                    </Button>
                  )}
                  {hasPermission(assignment.id, 'contact_guests') && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/support')} className="gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" /> Messages
                    </Button>
                  )}
                  {hasPermission(assignment.id, 'modify_prices') && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/properties')} className="gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" /> Pricing
                    </Button>
                  )}
                  {hasPermission(assignment.id, 'view_analytics') && (
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Eye className="h-3.5 w-3.5" /> Analytics
                    </Button>
                  )}
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
});

ManagerDashboard.displayName = 'ManagerDashboard';
