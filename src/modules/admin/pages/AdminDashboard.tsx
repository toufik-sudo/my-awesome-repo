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
import { Button } from '@/components/ui/button';
import {
  Users,
  FolderKanban,
  ShieldCheck,
  FileCheck2,
  Building2,
  UserPlus,
  PlusCircle,
  BarChart3,
  Zap,
} from 'lucide-react';
import { statsApi, type AdminStats } from '../admin.api';

export const AdminDashboard: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassStat
                title="Pending Verifications"
                value={stats?.pendingVerifications ?? 0}
                icon={<FileCheck2 className="h-5 w-5" />}
                color="amber"
              />
              <GlassStat
                title="Total Users"
                value={stats?.totalUsers ?? 0}
                icon={<Users className="h-5 w-5" />}
                color="primary"
              />
              <GlassStat
                title="Property Groups"
                value={stats?.totalGroups ?? 0}
                icon={<FolderKanban className="h-5 w-5" />}
                color="secondary"
              />
              <GlassStat
                title="Active Managers"
                value={stats?.activeManagers ?? 0}
                icon={<ShieldCheck className="h-5 w-5" />}
                color="accent"
              />
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
