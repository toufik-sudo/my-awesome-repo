import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/modules/shared/layout/DashboardLayout';
import { DynamicTabs } from '@/modules/shared/components/DynamicTabs';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { RolesManagement } from './RolesManagement';
import { PropertyGroupsManagement } from './PropertyGroupsManagement';
import { ManagerAssignments } from './ManagerAssignments';
import { VerificationReview } from './VerificationReview';
import { Users, FolderKanban, ShieldCheck, BarChart3, FileCheck2 } from 'lucide-react';
import { statsApi, type AdminStats } from '../admin.api';

export const AdminDashboard: React.FC = React.memo(() => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const data = await statsApi.getDashboardStats();
      setStats(data);
    } catch {
      // Stats are non-critical, fail silently
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const tabs = [
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
    <DashboardLayout
      title="Administration"
      subtitle="Manage verifications, roles, property groups, and permissions"
      stats={[
        { title: 'Pending Verifications', value: stats?.pendingVerifications ?? '—', icon: <FileCheck2 className="h-5 w-5" />, color: 'accent' },
        { title: 'Total Users', value: stats?.totalUsers ?? '—', icon: <Users className="h-5 w-5" /> },
        { title: 'Property Groups', value: stats?.totalGroups ?? '—', icon: <FolderKanban className="h-5 w-5" />, color: 'secondary' },
        { title: 'Active Managers', value: stats?.activeManagers ?? '—', icon: <ShieldCheck className="h-5 w-5" />, color: 'destructive' },
      ]}
    >
      <DynamicTabs
        tabs={tabs}
        defaultValue="verifications"
        variant="underline"
        fullWidth
      />
    </DashboardLayout>
  );
});

AdminDashboard.displayName = 'AdminDashboard';
