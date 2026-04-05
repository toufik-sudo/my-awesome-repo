import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Users, Shield, ShieldCheck, ShieldAlert, Settings2, Pause, Play, Info } from 'lucide-react';
import { rolesApi, invitationsApi } from '../admin.api';
import { UserManageModal } from '../components/UserManageModal';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import type { AppRole, UserWithRoles } from '../admin.types';
import type { GridColumn } from '@/types/component.types';

const ROLE_COLORS: Record<AppRole, string> = {
  hyper_admin: 'destructive',
  hyper_manager: 'destructive',
  admin: 'default',
  manager: 'secondary',
  user: 'outline',
  guest: 'outline',
};

export const AdminUsersManagement: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isAdmin, isManager, isHyper, canManageUsers, canManageManagers, allowedInvitationRoles } = usePermissions();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(false);
  const [manageUser, setManageUser] = useState<UserWithRoles | null>(null);
  const [manageOpen, setManageOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const allUsers = await rolesApi.getAllUsers();
      // FE-06: Exclude hyper_admin from the manageable users table
      setUsers(allUsers.filter(u => u.role !== 'hyper_admin'));
    } catch {
      toast.error(t('usersManagement.loadError', 'Erreur de chargement'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleStatusChange = useCallback(async (userId: number, status: string) => {
    try {
      await invitationsApi.updateUserStatus(userId, status);
      toast.success(t('usersManagement.statusUpdated', 'Statut mis à jour'));
      loadUsers();
    } catch {
      toast.error(t('usersManagement.statusError', 'Erreur'));
    }
  }, [loadUsers, t]);

  const scopeInfo = useMemo(() => {
    if (isAdmin) return t('usersManagement.adminInfo', 'Gérez les guests et managers que vous avez invités. Vous pouvez mettre en pause, réactiver ou gérer leurs permissions.');
    if (isManager) return t('usersManagement.managerInfo', 'Gérez les guests que vous avez invités.');
    return '';
  }, [isAdmin, isManager, t]);

  const columns = useMemo<GridColumn[]>(() => [
    { key: 'id', title: 'ID', width: '60px', sortable: true },
    { key: 'email', title: t('usersManagement.email', 'Email'), sortable: true, filterable: true, filterType: 'text' },
    {
      key: 'firstName', title: t('usersManagement.name', 'Nom'), sortable: true,
      render: (_: any, row: UserWithRoles) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || '—',
    },
    {
      key: 'role', title: t('usersManagement.roles', 'Rôle'),
      render: (_: any, row: UserWithRoles) => (
        <Badge variant={ROLE_COLORS[row.role] as any} className="text-[10px]">
          {row.role.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'isActive', title: t('usersManagement.status', 'Statut'), width: '90px',
      render: (v: boolean) => (
        <Badge variant={v !== false ? 'default' : 'destructive'} className="text-[10px]">
          {v !== false ? t('common.active', 'Actif') : t('common.inactive', 'Inactif')}
        </Badge>
      ),
    },
    {
      key: 'actions', title: t('usersManagement.actions', 'Actions'), width: '200px',
      render: (_: any, row: UserWithRoles) => (
        <div className="flex items-center gap-1">
          {isAdmin && (
            <DynamicButton variant="outline" size="sm" icon={<Settings2 className="h-3.5 w-3.5" />}
              onClick={() => { setManageUser(row); setManageOpen(true); }}>
              {t('usersManagement.manage', 'Gérer')}
            </DynamicButton>
          )}
          {row.isActive !== false ? (
            <DynamicButton variant="ghost" size="sm" icon={<Pause className="h-3.5 w-3.5 text-amber-500" />}
              onClick={() => handleStatusChange(row.id, 'paused')} />
          ) : (
            <DynamicButton variant="ghost" size="sm" icon={<Play className="h-3.5 w-3.5 text-emerald-500" />}
              onClick={() => handleStatusChange(row.id, 'active')} />
          )}
        </div>
      ),
    },
  ], [handleStatusChange, t, isAdmin]);

  return (
    <div className="space-y-4">
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{scopeInfo}</p>
          </div>
        </CardContent>
      </Card>

      <DynamicGrid
        columns={columns}
        data={users}
        loading={loading}
        striped
        hoverable
        showFilters
        emptyMessage={t('usersManagement.empty', 'Aucun utilisateur trouvé')}
        pageSize={20}
      />

      {isAdmin && (
        <UserManageModal
          open={manageOpen}
          onOpenChange={setManageOpen}
          user={manageUser}
          onRefresh={loadUsers}
        />
      )}
    </div>
  );
});

AdminUsersManagement.displayName = 'AdminUsersManagement';
