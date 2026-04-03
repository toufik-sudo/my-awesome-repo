import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicForm } from '@/modules/shared/components/DynamicForm';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { Badge } from '@/components/ui/badge';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { UserPlus, Shield, ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';
import { rolesApi } from '../admin.api';
import type { AppRole, UserWithRoles } from '../admin.types';
import type { GridColumn, DynamicFormField } from '@/types/component.types';

const ROLE_COLORS: Record<AppRole, string> = {
  hyper_admin: 'destructive',
  hyper_manager: 'destructive',
  admin: 'default',
  manager: 'secondary',
  user: 'outline',
  guest: 'outline',
};

const ROLE_ICONS: Record<AppRole, React.ReactNode> = {
  hyper_admin: <ShieldAlert className="h-3 w-3" />,
  hyper_manager: <ShieldAlert className="h-3 w-3" />,
  admin: <ShieldCheck className="h-3 w-3" />,
  manager: <Shield className="h-3 w-3" />,
  user: null,
  guest: null,
};

interface RolesManagementProps {
  /** When true, hyper_admin users are excluded from the table */
  excludeHyperAdmin?: boolean;
}

export const RolesManagement: React.FC<RolesManagementProps> = React.memo(({ excludeHyperAdmin = false }) => {
  const { t: _t } = useTranslation();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await rolesApi.getAllUsers();
      setUsers(excludeHyperAdmin ? data.filter(u => u.role !== 'hyper_admin') : data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [excludeHyperAdmin]);

  React.useEffect(() => { loadUsers(); }, [loadUsers]);

  const columns = useMemo<GridColumn[]>(() => [
    { key: 'id', title: 'ID', width: '80px', sortable: true },
    { key: 'email', title: 'Email', sortable: true, filterable: true, filterType: 'text' },
    {
      key: 'firstName', title: 'Name', sortable: true,
      render: (_: any, row: UserWithRoles) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || '—',
    },
    {
      key: 'role', title: 'Role',
      render: (_: any, row: UserWithRoles) => (
        <Badge variant={ROLE_COLORS[row.role] as any} className="gap-1 text-xs">
          {ROLE_ICONS[row.role]}
          {row.role.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions', title: 'Actions', width: '120px',
      render: (_: any, row: UserWithRoles) => (
        <DynamicButton
          variant="outline"
          size="sm"
          icon={<UserPlus className="h-3.5 w-3.5" />}
          onClick={() => { setSelectedUser(row); setAssignModalOpen(true); }}
        >
          Manage
        </DynamicButton>
      ),
    },
  ], []);

  const assignFields = useMemo<DynamicFormField[]>(() => [
    {
      fieldType: 'select',
      name: 'role',
      label: 'Role',
      placeholder: 'Select role to assign',
      validation: { required: true },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'User', value: 'user' },
      ],
    },
  ], []);

  const handleAssignRole = useCallback(async (values: Record<string, any>) => {
    if (!selectedUser) return;
    try {
      await rolesApi.assignRole(selectedUser.id, values.role as AppRole);
      toast.success(`Role "${values.role}" assigned successfully`);
      setAssignModalOpen(false);
      loadUsers();
    } catch {
      toast.error('Failed to assign role');
    }
  }, [selectedUser, loadUsers]);

  const handleRemoveRole = useCallback(async (userId: number, role: AppRole) => {
    try {
      await rolesApi.removeRole(userId, role);
      toast.success(`Role "${role}" removed`);
      loadUsers();
    } catch {
      toast.error('Failed to remove role');
    }
  }, [loadUsers]);

  return (
    <div className="space-y-4">
      <DynamicGrid
        columns={columns}
        data={users}
        loading={loading}
        selectable={false}
        striped
        hoverable
        showFilters
        emptyMessage="No users found"
        pageSize={20}
      />

      <DynamicModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        title={`Manage Roles — ${selectedUser?.email || ''}`}
        description="Assign or remove roles for this user"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Current Roles</p>
              <div className="flex flex-wrap gap-2">
                {selectedUser.role && (
                  <Badge variant={ROLE_COLORS[selectedUser.role] as any} className="gap-1.5 pr-1">
                    {ROLE_ICONS[selectedUser.role]}
                    {selectedUser.role.replace('_', ' ')}
                    {selectedUser.role !== 'user' && (
                      <button
                        onClick={() => handleRemoveRole(selectedUser.id, selectedUser.role)}
                        className="ml-1 p-0.5 rounded-full hover:bg-destructive/20"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    )}
                  </Badge>
                )}
              </div>
            </div>

            <DynamicForm
              fields={assignFields}
              onSubmit={handleAssignRole}
              submitButtonText="Assign Role"
              onCancel={() => setAssignModalOpen(false)}
              cancelButtonText="Close"
            />
          </div>
        )}
      </DynamicModal>
    </div>
  );
});

RolesManagement.displayName = 'RolesManagement';
