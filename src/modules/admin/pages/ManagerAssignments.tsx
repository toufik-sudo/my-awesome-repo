import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiScopeSelector } from '@/modules/admin/components/MultiScopeSelector';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Plus, Settings2, Trash2, Shield } from 'lucide-react';
import { assignmentsApi, rolesApi } from '../admin.api';
import type { ManagerAssignment, PermissionType, AssignmentScope, UserWithRoles } from '../admin.types';
import { PERMISSION_LABELS, PERMISSION_CATEGORIES } from '../admin.types';
import type { GridColumn } from '@/types/component.types';

const SCOPE_COLORS: Record<AssignmentScope, string> = {
  all: 'destructive',
  property_group: 'default',
  property: 'secondary',
};

const SCOPE_OPTIONS = [
  { label: 'Toutes les propriétés', value: 'all' },
  { label: 'Propriété spécifique', value: 'property' },
  { label: 'Groupe de propriétés', value: 'property_group' },
];

interface ManagerAssignmentsProps {
  /** When true, only hyper_manager can be assigned (hyper admin context) */
  isHyperContext?: boolean;
}

export const ManagerAssignments: React.FC<ManagerAssignmentsProps> = React.memo(({ isHyperContext = false }) => {
  const [assignments, setAssignments] = useState<ManagerAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [permModalAssignment, setPermModalAssignment] = useState<ManagerAssignment | null>(null);
  const [permissions, setPermissions] = useState<Record<PermissionType, boolean>>({} as any);

  // Create form state
  const [managers, setManagers] = useState<UserWithRoles[]>([]);
  const [managersLoading, setManagersLoading] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [selectedScope, setSelectedScope] = useState<AssignmentScope>('all');
  const [scopeTargetIds, setScopeTargetIds] = useState<string[]>([]);

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

  const loadManagers = useCallback(async () => {
    setManagersLoading(true);
    try {
      const users = await rolesApi.getAllUsers();
      // In hyper context, only show hyper_managers; otherwise show managers
      const filtered = isHyperContext
        ? users.filter(u => u.role === 'hyper_manager')
        : users.filter(u => u.role === 'manager');
      setManagers(filtered);
    } catch {
      toast.error('Erreur chargement managers');
    } finally {
      setManagersLoading(false);
    }
  }, [isHyperContext]);

  useEffect(() => { loadAssignments(); }, [loadAssignments]);

  const openCreateModal = useCallback(() => {
    setSelectedManagerId('');
    setSelectedScope('all');
    setScopeTargetIds([]);
    setCreateOpen(true);
    loadManagers();
  }, [loadManagers]);

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
      key: 'managerId', title: 'Manager', width: '200px', sortable: true,
      render: (_: any, row: ManagerAssignment) => {
        const mgr = (row as any).manager;
        if (mgr) return `${mgr.firstName || ''} ${mgr.lastName || ''} (${mgr.email || ''})`.trim();
        return `ID: ${row.managerId}`;
      },
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

  const handleCreate = useCallback(async () => {
    if (!selectedManagerId) {
      toast.error('Veuillez sélectionner un manager');
      return;
    }
    try {
      await assignmentsApi.create({
        managerId: Number(selectedManagerId),
        scope: selectedScope,
        propertyId: selectedScope === 'property' ? scopeTargetIds[0] : undefined,
        propertyGroupId: selectedScope === 'property_group' ? scopeTargetIds[0] : undefined,
      });
      toast.success('Manager assigned');
      setCreateOpen(false);
      loadAssignments();
    } catch {
      toast.error('Failed to create assignment');
    }
  }, [selectedManagerId, selectedScope, scopeTargetIds, loadAssignments]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await assignmentsApi.remove(id);
      toast.success('Assignment removed');
      loadAssignments();
    } catch {
      toast.error('Failed to remove assignment');
    }
  }, [loadAssignments]);

  if (loading) return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DynamicButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={openCreateModal}>
          {isHyperContext ? 'Assigner Hypermanager' : 'Assigner Manager'}
        </DynamicButton>
      </div>

      <DynamicGrid columns={columns} data={assignments} loading={loading} striped hoverable emptyMessage="No manager assignments" />

      {/* Create Assignment Modal */}
      <DynamicModal open={createOpen} onOpenChange={setCreateOpen} title={isHyperContext ? 'Assigner un Hypermanager' : 'Assigner un Manager'} size="md">
        <div className="space-y-4">
          {/* Manager select (single) */}
          <div className="space-y-2">
            <Label>{isHyperContext ? 'Hypermanager' : 'Manager'}</Label>
            {managersLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><LoadingSpinner size="sm" /> Chargement...</div>
            ) : managers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {isHyperContext ? 'Aucun hypermanager disponible. Invitez-en un d\'abord.' : 'Aucun manager disponible. Invitez-en un d\'abord.'}
              </p>
            ) : (
              <Select value={selectedManagerId} onValueChange={setSelectedManagerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un manager..." />
                </SelectTrigger>
                <SelectContent>
                  {managers.map(m => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.firstName || ''} {m.lastName || ''} ({m.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <Label>Portée d'accès</Label>
            <Select value={selectedScope} onValueChange={(v) => {
              setSelectedScope(v as AssignmentScope);
              setScopeTargetIds([]);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCOPE_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scope target multi-select */}
          {selectedScope !== 'all' && (
            <MultiScopeSelector
              scope={selectedScope}
              selectedIds={scopeTargetIds}
              onSelectionChange={setScopeTargetIds}
              label={selectedScope === 'property' ? 'Propriétés' : 'Groupes de propriétés'}
            />
          )}

          <div className="flex gap-2 pt-2">
            <DynamicButton variant="primary" onClick={handleCreate}>Assigner</DynamicButton>
            <DynamicButton variant="outline" onClick={() => setCreateOpen(false)}>Annuler</DynamicButton>
          </div>
        </div>
      </DynamicModal>

      {/* Permissions Modal */}
      <DynamicModal
        open={!!permModalAssignment}
        onOpenChange={(o) => !o && setPermModalAssignment(null)}
        title="Configurer les permissions"
        description={`Manager #${permModalAssignment?.managerId} — ${permModalAssignment?.scope.replace('_', ' ')} scope`}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <DynamicButton variant="outline" onClick={() => setPermModalAssignment(null)}>Annuler</DynamicButton>
            <DynamicButton variant="primary" icon={<Shield className="h-4 w-4" />} onClick={handleSavePermissions}>
              Sauvegarder
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
