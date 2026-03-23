import React, { useState, useCallback, useMemo } from 'react';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicForm } from '@/modules/shared/components/DynamicForm';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus, Settings2, Trash2, Shield } from 'lucide-react';
import { assignmentsApi } from '../admin.api';
import type { ManagerAssignment, ManagerPermission, PermissionType, AssignmentScope } from '../admin.types';
import { PERMISSION_LABELS, PERMISSION_CATEGORIES } from '../admin.types';
import type { GridColumn, DynamicFormField } from '@/types/component.types';

const SCOPE_COLORS: Record<AssignmentScope, string> = {
  all: 'destructive',
  property_group: 'default',
  property: 'secondary',
};

export const ManagerAssignments: React.FC = React.memo(() => {
  const [assignments, setAssignments] = useState<ManagerAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [permModalAssignment, setPermModalAssignment] = useState<ManagerAssignment | null>(null);
  const [permissions, setPermissions] = useState<Record<PermissionType, boolean>>({} as any);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await assignmentsApi.getAll();
      setAssignments(data);
    } catch {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadAssignments(); }, [loadAssignments]);

  const openPermissions = useCallback(async (assignment: ManagerAssignment) => {
    try {
      const perms = await assignmentsApi.getPermissions(assignment.id);
      const permMap: Record<string, boolean> = {};
      Object.keys(PERMISSION_LABELS).forEach(p => { permMap[p] = false; });
      perms.forEach(p => { permMap[p.permission] = p.isGranted; });
      setPermissions(permMap as Record<PermissionType, boolean>);
      setPermModalAssignment(assignment);
    } catch {
      toast.error('Failed to load permissions');
    }
  }, []);

  const handleSavePermissions = useCallback(async () => {
    if (!permModalAssignment) return;
    try {
      const permArray = Object.entries(permissions).map(([permission, isGranted]) => ({
        permission: permission as PermissionType,
        isGranted,
      }));
      await assignmentsApi.setPermissions(permModalAssignment.id, permArray);
      toast.success('Permissions saved');
      setPermModalAssignment(null);
    } catch {
      toast.error('Failed to save permissions');
    }
  }, [permModalAssignment, permissions]);

  const togglePermission = useCallback((perm: PermissionType) => {
    setPermissions(prev => ({ ...prev, [perm]: !prev[perm] }));
  }, []);

  const toggleCategory = useCallback((perms: PermissionType[], enabled: boolean) => {
    setPermissions(prev => {
      const next = { ...prev };
      perms.forEach(p => { next[p] = enabled; });
      return next;
    });
  }, []);

  const columns = useMemo<GridColumn[]>(() => [
    {
      key: 'managerId', title: 'Manager ID', width: '100px', sortable: true,
    },
    {
      key: 'scope', title: 'Scope', width: '140px',
      render: (v: AssignmentScope) => (
        <Badge variant={SCOPE_COLORS[v] as any}>{v.replace('_', ' ')}</Badge>
      ),
    },
    {
      key: 'target', title: 'Target',
      render: (_: any, row: ManagerAssignment) => {
        if (row.scope === 'all') return <span className="text-muted-foreground">All properties</span>;
        if (row.scope === 'property') return row.property?.title || row.propertyId || '—';
        if (row.scope === 'property_group') return row.propertyGroup?.name || row.propertyGroupId || '—';
        return '—';
      },
    },
    {
      key: 'isActive', title: 'Status', width: '90px',
      render: (v: boolean) => <Badge variant={v ? 'default' : 'outline'}>{v ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions', title: 'Actions', width: '180px',
      render: (_: any, row: ManagerAssignment) => (
        <div className="flex gap-1">
          <DynamicButton variant="ghost" size="sm" icon={<Settings2 className="h-3.5 w-3.5" />}
            onClick={() => openPermissions(row)}>
            Permissions
          </DynamicButton>
          <DynamicButton variant="ghost" size="sm" icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
            onClick={() => handleDelete(row.id)} />
        </div>
      ),
    },
  ], [openPermissions]);

  const createFields = useMemo<DynamicFormField[]>(() => [
    { fieldType: 'input', name: 'managerId', label: 'Manager User ID', placeholder: 'Enter manager user ID', validation: { required: true } },
    {
      fieldType: 'select', name: 'scope', label: 'Access Scope', validation: { required: true },
      options: [
        { label: 'All Properties', value: 'all' },
        { label: 'Specific Property', value: 'property' },
        { label: 'Property Group', value: 'property_group' },
      ],
    },
    { fieldType: 'input', name: 'propertyId', label: 'Property ID (if scope = property)', placeholder: 'Optional' },
    { fieldType: 'input', name: 'propertyGroupId', label: 'Property Group ID (if scope = group)', placeholder: 'Optional' },
  ], []);

  const handleCreate = useCallback(async (values: Record<string, any>) => {
    try {
      await assignmentsApi.create({
        managerId: Number(values.managerId),
        scope: values.scope as AssignmentScope,
        propertyId: values.propertyId || undefined,
        propertyGroupId: values.propertyGroupId || undefined,
      });
      toast.success('Manager assigned');
      setCreateOpen(false);
      loadAssignments();
    } catch {
      toast.error('Failed to create assignment');
    }
  }, [loadAssignments]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await assignmentsApi.remove(id);
      toast.success('Assignment removed');
      loadAssignments();
    } catch {
      toast.error('Failed to remove assignment');
    }
  }, [loadAssignments]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DynamicButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Assign Manager
        </DynamicButton>
      </div>

      <DynamicGrid columns={columns} data={assignments} loading={loading} striped hoverable emptyMessage="No manager assignments" />

      {/* Create Assignment Modal */}
      <DynamicModal open={createOpen} onOpenChange={setCreateOpen} title="Assign Manager" size="md">
        <DynamicForm fields={createFields} onSubmit={handleCreate} submitButtonText="Assign" onCancel={() => setCreateOpen(false)} />
      </DynamicModal>

      {/* Permissions Modal */}
      <DynamicModal
        open={!!permModalAssignment}
        onOpenChange={(o) => !o && setPermModalAssignment(null)}
        title="Configure Permissions"
        description={`Manager #${permModalAssignment?.managerId} — ${permModalAssignment?.scope.replace('_', ' ')} scope`}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <DynamicButton variant="outline" onClick={() => setPermModalAssignment(null)}>Cancel</DynamicButton>
            <DynamicButton variant="primary" icon={<Shield className="h-4 w-4" />} onClick={handleSavePermissions}>
              Save Permissions
            </DynamicButton>
          </div>
        }
      >
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => {
            const allEnabled = perms.every(p => permissions[p]);
            return (
              <Card key={category}>
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{category}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground">All</Label>
                      <Switch checked={allEnabled} onCheckedChange={(v) => toggleCategory(perms, v)} />
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="py-3 px-4 space-y-3">
                  {perms.map(perm => (
                    <div key={perm} className="flex items-center justify-between">
                      <Label className="text-sm cursor-pointer" htmlFor={perm}>
                        {PERMISSION_LABELS[perm]}
                      </Label>
                      <Switch id={perm} checked={permissions[perm] || false} onCheckedChange={() => togglePermission(perm)} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DynamicModal>
    </div>
  );
});

ManagerAssignments.displayName = 'ManagerAssignments';
