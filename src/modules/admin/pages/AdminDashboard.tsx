import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicTabs } from '@/modules/shared/components/DynamicTabs';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { RolesManagement } from './RolesManagement';
import { PropertyGroupsManagement } from './PropertyGroupsManagement';
import { ManagerAssignments } from './ManagerAssignments';
import { VerificationReview } from './VerificationReview';
import { GlassCard, GlassStat } from '../components/GlassCard';
import { InvitationForm } from '../components/InvitationForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  FolderKanban,
  ShieldCheck,
  Shield,
  FileCheck2,
  Building2,
  UserPlus,
  PlusCircle,
  BarChart3,
  Zap,
  Home,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { statsApi, type AdminStats } from '../admin.api';

export const AdminDashboard: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const data = await statsApi.getDashboardStats();
      setStats(data);
    } catch {
      // Stats are non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

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
      label: 'Overview',
      icon: <BarChart3 className="h-4 w-4" />,
      content: (
        <ErrorBoundary>
          <div className="space-y-6">
            {/* Primary Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassStat
                title="Total Users"
                value={stats?.totalUsers ?? 0}
                icon={<Users className="h-5 w-5" />}
                color="primary"
              />
              <GlassStat
                title="Active Managers"
                value={stats?.activeManagers ?? 0}
                icon={<Shield className="h-5 w-5" />}
                color="secondary"
              />
              <GlassStat
                title="Property Groups"
                value={stats?.totalGroups ?? 0}
                icon={<FolderKanban className="h-5 w-5" />}
                color="accent"
              />
              <GlassStat
                title="Pending Verifications"
                value={stats?.pendingVerifications ?? 0}
                icon={<FileCheck2 className="h-5 w-5" />}
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
                title="Published Properties"
                value={stats?.publishedProperties ?? 0}
                icon={<Building2 className="h-5 w-5" />}
                color="secondary"
              />
              <GlassStat
                title="Total Bookings"
                value={stats?.totalBookings ?? 0}
                icon={<Calendar className="h-5 w-5" />}
                color="accent"
              />
              <GlassStat
                title="Total Revenue"
                value={`${(stats?.totalRevenue ?? 0).toLocaleString()} DA`}
                icon={<TrendingUp className="h-5 w-5" />}
                color="amber"
              />
            </div>

            {/* Role Distribution & Verification Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" /> Team Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm">Admins</span>
                    </div>
                    <Badge>{stats?.totalAdmins ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-secondary-foreground" />
                      <span className="text-sm">Managers</span>
                    </div>
                    <Badge variant="secondary">{stats?.totalManagers ?? stats?.activeManagers ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Regular Users</span>
                    </div>
                    <Badge variant="outline">{stats?.totalRegularUsers ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-accent-foreground" />
                      <span className="text-sm">Total Assignments</span>
                    </div>
                    <Badge variant="outline">{stats?.totalAssignments ?? 0}</Badge>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FileCheck2 className="h-5 w-5 text-primary" /> Verification Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      {stats?.pendingVerifications ?? 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm">Approved</span>
                    </div>
                    <Badge className="bg-emerald-600 hover:bg-emerald-700">
                      {stats?.approvedVerifications ?? 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm">Rejected</span>
                    </div>
                    <Badge variant="destructive">
                      {stats?.rejectedVerifications ?? 0}
                    </Badge>
                  </div>
                  {(stats?.pendingVerifications ?? 0) + (stats?.approvedVerifications ?? 0) > 0 && (
                    <Progress
                      value={((stats?.approvedVerifications ?? 0) / Math.max(
                        (stats?.pendingVerifications ?? 0) + (stats?.approvedVerifications ?? 0) + (stats?.rejectedVerifications ?? 0),
                        1
                      )) * 100}
                      className="h-2 mt-2"
                    />
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Quick Actions */}
            <GlassCard variant="accent" className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" /> Quick Actions
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage your properties and team</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setInviteOpen(true)} className="gap-2">
                    <UserPlus className="h-4 w-4" /> Invite Manager
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/properties/new')} className="gap-2">
                    <PlusCircle className="h-4 w-4" /> Add Property
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/services/new')} className="gap-2">
                    <PlusCircle className="h-4 w-4" /> Add Service
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/properties')} className="gap-2">
                    <Building2 className="h-4 w-4" /> My Properties
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </ErrorBoundary>
      ),
    },
    {
      value: 'verifications',
      label: 'Verifications',
      icon: <FileCheck2 className="h-4 w-4" />,
      badge: stats?.pendingVerifications,
      content: (
        <ErrorBoundary>
          <VerificationReview />
        </ErrorBoundary>
      ),
    },
    {
      value: 'roles',
      label: 'User Roles',
      icon: <Users className="h-4 w-4" />,
      badge: stats?.totalUsers,
      content: (
        <ErrorBoundary>
          <RolesManagement />
        </ErrorBoundary>
      ),
    },
    {
      value: 'groups',
      label: 'Property Groups',
      icon: <FolderKanban className="h-4 w-4" />,
      badge: stats?.totalGroups,
      content: (
        <ErrorBoundary>
          <PropertyGroupsManagement />
        </ErrorBoundary>
      ),
    },
    {
      value: 'assignments',
      label: 'Manager Assignments',
      icon: <ShieldCheck className="h-4 w-4" />,
      badge: stats?.totalAssignments,
      content: (
        <ErrorBoundary>
          <ManagerAssignments />
        </ErrorBoundary>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 dark:from-primary/20 dark:to-accent/20 p-6 sm:p-8 border border-border/30">
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your properties, teams, and verifications</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setInviteOpen(true)} size="lg" className="gap-2 shadow-lg shadow-primary/20">
              <UserPlus className="h-5 w-5" /> Invite
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <DynamicTabs
        tabs={tabs}
        defaultValue="overview"
        variant="underline"
        fullWidth
      />

      {/* Invitation Modal */}
      <InvitationForm
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        allowedRoles={['manager']}
        onSuccess={loadStats}
      />
    </div>
  );
});

AdminDashboard.displayName = 'AdminDashboard';
