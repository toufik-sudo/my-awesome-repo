import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { DynamicTabs } from '@/modules/shared/components/DynamicTabs';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { GlassCard, GlassStat } from '../components/GlassCard';
import { InvitationForm } from '../components/InvitationForm';
import { UserStatusActions, UserStatusBadge } from '../components/UserStatusActions';
import { RolesManagement } from './RolesManagement';
import { PropertyGroupsManagement } from './PropertyGroupsManagement';
import { ManagerAssignments } from './ManagerAssignments';
import { VerificationReview } from './VerificationReview';
import { statsApi, rolesApi, invitationsApi, type AdminStats, type Invitation } from '../admin.api';
import type { AppRole, UserWithRoles } from '../admin.types';
import type { GridColumn } from '@/types/component.types';
import {
  Crown,
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  FileCheck2,
  FolderKanban,
  BarChart3,
  Building2,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  Zap,
  Bell,
} from 'lucide-react';

export const HyperManagerDashboard: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await statsApi.getDashboardStats();
      setStats(data);
    } catch {
      // non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInvitations = useCallback(async () => {
    setInvitationsLoading(true);
    try {
      const data = await invitationsApi.getAll();
      setInvitations(data);
    } catch {
      // fail silently
    } finally {
      setInvitationsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); loadInvitations(); }, [loadData, loadInvitations]);

  const invitationColumns = useMemo<GridColumn[]>(() => [
    {
      key: 'contact', title: 'Contact',
      render: (_: any, row: Invitation) => row.email || row.phone || '—',
    },
    {
      key: 'role', title: 'Role', width: '120px',
      render: (v: string) => (
        <Badge variant={v === 'admin' ? 'default' : v === 'manager' ? 'secondary' : 'outline'}>
          {v?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'status', title: 'Status', width: '120px',
      render: (v: string) => {
        const cfg: Record<string, { variant: any; icon: React.ReactNode }> = {
          pending: { variant: 'outline', icon: <Clock className="h-3 w-3" /> },
          accepted: { variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
          expired: { variant: 'secondary', icon: <XCircle className="h-3 w-3" /> },
          cancelled: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
        };
        const c = cfg[v] || cfg.pending;
        return <Badge variant={c.variant} className="gap-1">{c.icon} {v}</Badge>;
      },
    },
    {
      key: 'createdAt', title: 'Sent', width: '140px',
      render: (v: string) => v ? new Date(v).toLocaleDateString() : '—',
    },
    {
      key: 'actions', title: '', width: '100px',
      render: (_: any, row: Invitation) => row.status === 'pending' ? (
        <div className="flex gap-1">
          <DynamicButton variant="ghost" size="sm" icon={<Send className="h-3.5 w-3.5" />}
            onClick={() => handleResend(row.id)}>
            Resend
          </DynamicButton>
        </div>
      ) : null,
    },
  ], []);

  const handleResend = useCallback(async (id: string) => {
    try {
      await invitationsApi.resend(id);
      toast.success('Invitation resent');
    } catch {
      toast.error('Failed to resend invitation');
    }
  }, []);

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
                title="Active Managers"
                value={stats?.activeManagers ?? 0}
                icon={<Shield className="h-5 w-5" />}
                color="secondary"
              />
              <GlassStat
                title="Total Assignments"
                value={stats?.totalAssignments ?? 0}
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
                  <p className="text-sm text-muted-foreground mt-1">Manage your platform from here</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setInviteOpen(true)} className="gap-2">
                    <UserPlus className="h-4 w-4" /> Invite User
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/admin/verification-review')} className="gap-2">
                    <FileCheck2 className="h-4 w-4" /> Review Documents
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/properties/new')} className="gap-2">
                    <Building2 className="h-4 w-4" /> Add Property
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Recent Invitations */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" /> Recent Invitations
                </h3>
                <Button variant="ghost" size="sm" onClick={loadInvitations}>Refresh</Button>
              </div>
              <DynamicGrid
                columns={invitationColumns}
                data={invitations.slice(0, 10)}
                loading={invitationsLoading}
                emptyMessage="No invitations sent yet"
                hoverable
                pageSize={10}
              />
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
      value: 'users',
      label: 'User Management',
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 sm:p-8 border border-border/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Hyper Admin Console</h1>
              <p className="text-muted-foreground mt-1">Full platform control — manage users, roles, and verifications</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setInviteOpen(true)} size="lg" className="gap-2 shadow-lg shadow-primary/20">
              <UserPlus className="h-5 w-5" /> Invite
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
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
        allowedRoles={['hyper_manager', 'admin', 'manager']}
        onSuccess={loadInvitations}
      />
    </div>
  );
});

HyperManagerDashboard.displayName = 'HyperManagerDashboard';
