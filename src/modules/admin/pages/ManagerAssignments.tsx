import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Plus, Settings2, Trash2, Shield, Search, X } from 'lucide-react';
import { assignmentsApi, rolesApi, groupsApi } from '../admin.api';
import { propertiesApi } from '@/modules/properties/properties.api';
import { tourismServicesApi } from '@/modules/services/services.api';
import { serviceGroupsApi } from '@/modules/services/service-bookings.api';
import { useAuth } from '@/contexts/AuthContext';
import type { ManagerAssignment, ManagerPermission, PermissionType, AssignmentScope, UserWithRoles } from '../admin.types';
import { PERMISSION_LABELS, PERMISSION_CATEGORIES } from '../admin.types';
import type { GridColumn } from '@/types/component.types';

const SCOPE_COLORS: Record<AssignmentScope, string> = {
  all: 'destructive',
  property_group: 'default',
  property: 'secondary',
};

interface SelectableEntity {
  id: string;
  label: string;
  type?: 'property' | 'service' | 'property_group' | 'service_group' | 'host';
}

export const ManagerAssignments: React.FC = React.memo(() => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<ManagerAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [permModalAssignment, setPermModalAssignment] = useState<ManagerAssignment | null>(null);
  const [permissions, setPermissions] = useState<Record<PermissionType, boolean>>({} as any);

  // Create form state
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);

  // Entities for dropdowns
  const [assignees, setAssignees] = useState<SelectableEntity[]>([]);
  const [targets, setTargets] = useState<SelectableEntity[]>([]);
  const [hosts, setHosts] = useState<SelectableEntity[]>([]);
  const [assigneesLoading, setAssigneesLoading] = useState(false);
  const [targetsLoading, setTargetsLoading] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');

  const isHyperAdmin = useMemo(() => user?.roles?.includes('hyper_admin') ?? false, [user]);
  const isAdmin = useMemo(() => user?.roles?.includes('admin') ?? false, [user]);

  const loadAssignees = useCallback(async () => {
    setAssigneesLoading(true);
    try {
      const users = await rolesApi.getAllUsers();
      let filtered: UserWithRoles[];
      if (isHyperAdmin) {
        filtered = users.filter(u => u.roles?.includes('hyper_manager') && !u.roles?.includes('hyper_admin'));
      } else if (isAdmin) {
        filtered = users.filter(u => u.roles?.includes('manager') && !u.roles?.some(r => ['hyper_admin', 'hyper_manager', 'admin'].includes(r)));
      } else {
        filtered = [];
      }
      setAssignees(filtered.map(u => ({
        id: String(u.id),
        label: `${u.firstName || ''} ${u.lastName || ''} (${u.email})`.trim(),
      })));
      if (isHyperAdmin) {
        const hostUsers = users.filter(u =>
          u.roles?.some(r => ['admin', 'manager'].includes(r)) && !u.roles?.some(r => ['hyper_admin', 'hyper_manager'].includes(r))
        );
        setHosts(hostUsers.map(u => ({
          id: String(u.id),
          label: `${u.firstName || ''} ${u.lastName || ''} (${u.email})`.trim(),
          type: 'host',
        })));
      }
    } catch {
      setAssignees([]);
    } finally {
      setAssigneesLoading(false);
    }
  }, [isHyperAdmin, isAdmin]);

  // Load targets based on selected scopes
  const loadTargets = useCallback(async (scopes: string[]) => {
    if (scopes.length === 0 || (scopes.length === 1 && scopes[0] === 'all')) {
      setTargets([]);
      return;
    }
    setTargetsLoading(true);
    try {
      let items: SelectableEntity[] = [];
      if (scopes.includes('host')) items = [...items, ...hosts];
      if (scopes.includes('property')) {
        const res = await propertiesApi.getAll({ limit: 200 });
        const props = Array.isArray(res) ? res : (res as any).data || [];
        items = [...items, ...props.map((p: any) => ({ id: p.id, label: `🏠 ${p.title} — ${p.city || ''}`, type: 'property' as const }))];
      }
      if (scopes.includes('service')) {
        const res = await tourismServicesApi.getAll({ limit: 200 });
        const svcs = (res as any).data || [];
        items = [...items, ...svcs.map((s: any) => ({
          id: s.id,
          label: `🧭 ${typeof s.title === 'string' ? s.title : Object.values(s.title || {})[0] || s.id}`,
          type: 'service' as const,
        }))];
      }
      if (scopes.includes('property_group')) {
        const groups = await groupsApi.getAll();
        items = [...items, ...groups.map(g => ({ id: g.id, label: `📁 ${g.name}`, type: 'property_group' as const }))];
      }
      if (scopes.includes('service_group')) {
        const groups = await serviceGroupsApi.getAll();
        items = [...items, ...groups.map(g => ({ id: g.id, label: `📁 ${g.name}`, type: 'service_group' as const }))];
      }
      setTargets(items);
    } catch {
      setTargets([]);
    } finally {
      setTargetsLoading(false);
    }
  }, [hosts]);

  useEffect(() => { if (createOpen) loadAssignees(); }, [createOpen, loadAssignees]);

  useEffect(() => {
    const nonAllScopes = selectedScopes.filter(s => s !== 'all');
    if (nonAllScopes.length > 0) {
      loadTargets(nonAllScopes);
    } else {
      setTargets([]);
    }
    setSelectedTargetIds([]);
  }, [selectedScopes, loadTargets]);

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

  useEffect(() => { loadAssignments(); }, [loadAssignments]);

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

  const scopeOptions = useMemo(() => {
    if (isHyperAdmin) {
      return [
        { label: 'Hôtes (Admin/Manager)', value: 'host' },
        { label: 'Toutes les propriétés', value: 'all' },
        { label: 'Propriété spécifique', value: 'property' },
        { label: 'Service spécifique', value: 'service' },
        { label: 'Groupe de propriétés', value: 'property_group' },
        { label: 'Groupe de services', value: 'service_group' },
      ];
    }
    return [
      { label: 'Toutes mes propriétés/services', value: 'all' },
      { label: 'Propriété spécifique', value: 'property' },
      { label: 'Service spécifique', value: 'service' },
      { label: 'Groupe de propriétés', value: 'property_group' },
      { label: 'Groupe de services', value: 'service_group' },
    ];
  }, [isHyperAdmin]);

  const columns = useMemo<GridColumn[]>(() => [
    {
      key: 'managerId', title: 'Assigné', width: '200px', sortable: true,
      render: (_: any, row: ManagerAssignment) => {
        const mgr = assignees.find(m => m.id === String(row.managerId));
        return mgr ? mgr.label : `#${row.managerId}`;
      },
    },
    {
      key: 'scope', title: 'Portée', width: '140px',
      render: (v: AssignmentScope) => (
        <Badge variant={SCOPE_COLORS[v] as any}>{v.replace('_', ' ')}</Badge>
      ),
    },
    {
      key: 'target', title: 'Cible',
      render: (_: any, row: ManagerAssignment) => {
        if (row.scope === 'all') return <span className="text-muted-foreground">Toutes les propriétés</span>;
        if (row.scope === 'property') return row.property?.title || row.propertyId || '—';
        if (row.scope === 'property_group') return row.propertyGroup?.name || row.propertyGroupId || '—';
        return '—';
      },
    },
    {
      key: 'isActive', title: 'Statut', width: '90px',
      render: (v: boolean) => <Badge variant={v ? 'default' : 'outline'}>{v ? 'Actif' : 'Inactif'}</Badge>,
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
  ], [openPermissions, assignees]);

  const handleCreate = useCallback(async () => {
    if (selectedAssigneeIds.length === 0 || selectedScopes.length === 0) {
      toast.error('Sélectionnez au moins un assigné et une portée');
      return;
    }
    try {
      for (const assigneeId of selectedAssigneeIds) {
        if (selectedScopes.includes('all')) {
          await assignmentsApi.create({ managerId: Number(assigneeId), scope: 'all' });
        }
        // Process non-"all" scopes with targets
        if (selectedTargetIds.length > 0) {
          for (const targetId of selectedTargetIds) {
            const target = targets.find(t => t.id === targetId);
            const scopeForTarget = target?.type === 'service' ? 'property' as AssignmentScope
              : target?.type === 'service_group' ? 'property' as AssignmentScope
              : (target?.type || 'property') as AssignmentScope;
            await assignmentsApi.create({
              managerId: Number(assigneeId),
              scope: scopeForTarget,
              propertyId: ['property', 'service'].includes(target?.type || '') ? targetId : undefined,
              propertyGroupId: ['property_group', 'service_group'].includes(target?.type || '') ? targetId : undefined,
            });
          }
        }
      }
      toast.success('Assignation(s) créée(s) avec succès');
      setCreateOpen(false);
      setSelectedAssigneeIds([]);
      setSelectedScopes([]);
      setSelectedTargetIds([]);
      loadAssignments();
    } catch {
      toast.error('Erreur lors de la création');
    }
  }, [selectedAssigneeIds, selectedScopes, selectedTargetIds, targets, loadAssignments]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await assignmentsApi.remove(id);
      toast.success('Assignation supprimée');
      loadAssignments();
    } catch {
      toast.error('Erreur de suppression');
    }
  }, [loadAssignments]);

  const filteredAssignees = useMemo(() => {
    if (!assigneeSearch) return assignees;
    const q = assigneeSearch.toLowerCase();
    return assignees.filter(m => m.label.toLowerCase().includes(q));
  }, [assignees, assigneeSearch]);

  const filteredTargets = useMemo(() => {
    if (!targetSearch) return targets;
    const q = targetSearch.toLowerCase();
    return targets.filter(t => t.label.toLowerCase().includes(q));
  }, [targets, targetSearch]);

  const toggleAssignee = (id: string) => {
    setSelectedAssigneeIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleTarget = (id: string) => {
    setSelectedTargetIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleScope = (value: string) => {
    setSelectedScopes(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]);
  };

  const needsTargets = selectedScopes.some(s => s !== 'all');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {isHyperAdmin
            ? 'Assignez des hyper managers aux hôtes, groupes et propriétés/services'
            : isAdmin
              ? 'Assignez des managers à vos groupes et propriétés/services'
              : ''}
        </p>
        <DynamicButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Nouvelle assignation
        </DynamicButton>
      </div>

      <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">
        <DynamicGrid columns={columns} data={assignments} loading={loading} striped hoverable emptyMessage="Aucune assignation" pageSize={10} />
      </div>

      {/* Create Assignment Modal */}
      <DynamicModal open={createOpen} onOpenChange={setCreateOpen} title="Nouvelle assignation" size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate}>Assigner</Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Assignee Selection */}
          <div>
            <Label className="text-sm mb-1.5 block">
              {isHyperAdmin ? 'Hyper Manager à assigner' : 'Manager à assigner'}
            </Label>
            <div className="border border-border rounded-lg">
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={assigneeSearch}
                    onChange={e => setAssigneeSearch(e.target.value)}
                    placeholder="Rechercher..."
                    className="pl-8 h-8 text-sm"
                  />
                </div>
                {selectedAssigneeIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedAssigneeIds.map(id => {
                      const a = assignees.find(m => m.id === id);
                      return (
                        <Badge key={id} variant="secondary" className="text-[10px] gap-1">
                          {a?.label || id}
                          <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => toggleAssignee(id)} />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
              <ScrollArea className="h-[160px]">
                <div className="p-1">
                  {assigneesLoading ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Chargement...</p>
                  ) : filteredAssignees.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucun résultat</p>
                  ) : (
                    filteredAssignees.map(a => (
                      <div key={a.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleAssignee(a.id)}>
                        <Checkbox checked={selectedAssigneeIds.includes(a.id)} className="pointer-events-none" />
                        <span className="text-sm truncate">{a.label}</span>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Scope Selection (multi-select) */}
          <div>
            <Label className="text-sm mb-1.5 block">Portée d'accès (sélection multiple)</Label>
            <div className="border border-border rounded-lg">
              {selectedScopes.length > 0 && (
                <div className="flex flex-wrap gap-1 p-2 border-b border-border">
                  {selectedScopes.map(scope => {
                    const opt = scopeOptions.find(o => o.value === scope);
                    return (
                      <Badge key={scope} variant="secondary" className="text-[10px] gap-1">
                        {opt?.label || scope}
                        <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => toggleScope(scope)} />
                      </Badge>
                    );
                  })}
                </div>
              )}
              <ScrollArea className="h-[160px]">
                <div className="p-1">
                  {scopeOptions.map(opt => (
                    <div key={opt.value} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleScope(opt.value)}>
                      <Checkbox checked={selectedScopes.includes(opt.value)} className="pointer-events-none" />
                      <span className="text-sm">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Target Selection */}
          {needsTargets && (
            <div>
              <Label className="text-sm mb-1.5 block">Cibles</Label>
              <div className="border border-border rounded-lg">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={targetSearch}
                      onChange={e => setTargetSearch(e.target.value)}
                      placeholder="Rechercher..."
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                  {selectedTargetIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedTargetIds.map(id => {
                        const t = targets.find(t => t.id === id);
                        return (
                          <Badge key={id} variant="secondary" className="text-[10px] gap-1">
                            {t?.label || id}
                            <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => toggleTarget(id)} />
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
                <ScrollArea className="h-[180px]">
                  <div className="p-1">
                    {targetsLoading ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Chargement...</p>
                    ) : filteredTargets.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Aucun résultat</p>
                    ) : (
                      filteredTargets.map(target => (
                        <div key={target.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer"
                          onClick={() => toggleTarget(target.id)}>
                          <Checkbox checked={selectedTargetIds.includes(target.id)} className="pointer-events-none" />
                          <span className="text-sm truncate">{target.label}</span>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </DynamicModal>

      {/* Permissions Modal */}
      <DynamicModal
        open={!!permModalAssignment}
        onOpenChange={(o) => !o && setPermModalAssignment(null)}
        title="Configurer les permissions"
        description={`Assigné #${permModalAssignment?.managerId} — Portée : ${permModalAssignment?.scope.replace('_', ' ')}`}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <DynamicButton variant="outline" onClick={() => setPermModalAssignment(null)}>Annuler</DynamicButton>
            <DynamicButton variant="primary" icon={<Shield className="h-4 w-4" />} onClick={handleSavePermissions}>
              Enregistrer
            </DynamicButton>
          </div>
        }
      >
        <ScrollArea className="h-[60vh]">
          <div className="space-y-6 pr-4">
            {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => {
              const allEnabled = perms.every(p => permissions[p]);
              return (
                <Card key={category}>
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">{category}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Tout</Label>
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
        </ScrollArea>
      </DynamicModal>
    </div>
  );
});

ManagerAssignments.displayName = 'ManagerAssignments';
