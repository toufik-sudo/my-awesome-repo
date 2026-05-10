import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiScopeSelector } from '@/modules/admin/components/MultiScopeSelector';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Plus, Trash2, Shield, Search, ChevronDown, Users, ShieldCheck, UserCheck } from 'lucide-react';
import { assignmentsApi, rolesApi, type AllAssignmentsResponse } from '../admin.api';
import type { UserWithRoles } from '../admin.types';
import { rbacConfigApi, type RbacBackendPermission } from '../rbac-config.api';
import { useRoleAccess } from '@/hooks/useRoleAccess';

// ─── Types ────────────────────────────────────────────────────────────────────

type PermTableType = 'manager' | 'hyper_manager' | 'guest';

const SCOPE_OPTIONS: Record<PermTableType, { label: string; value: string }[]> = {
  manager: [
    { label: 'Toutes (accès global)', value: 'all' },
    { label: 'Propriétés', value: 'properties' },
    { label: 'Services', value: 'services' },
    { label: 'Groupes de propriétés', value: 'property_groups' },
    { label: 'Groupes de services', value: 'service_groups' },
  ],
  hyper_manager: [
    { label: 'Toutes (accès global)', value: 'all' },
    { label: 'Propriétés', value: 'properties' },
    { label: 'Services', value: 'services' },
    { label: 'Groupes de propriétés', value: 'property_groups' },
    { label: 'Groupes de services', value: 'service_groups' },
    { label: 'Admins', value: 'admins' },
  ],
  guest: [
    { label: 'Toutes (accès global)', value: 'all' },
    { label: 'Propriétés', value: 'properties' },
    { label: 'Services', value: 'services' },
    { label: 'Groupes de propriétés', value: 'property_groups' },
    { label: 'Groupes de services', value: 'service_groups' },
  ],
};

const SCOPE_BADGE_VARIANT: Record<string, string> = {
  all: 'destructive',
  properties: 'default',
  services: 'secondary',
  property_groups: 'outline',
  service_groups: 'outline',
  admins: 'default',
};

interface ManagerAssignmentsProps {
  isHyperContext?: boolean;
}

// ─── Searchable User Select ──────────────────────────────────────────────────

const SearchableUserSelect: React.FC<{
  users: UserWithRoles[];
  loading: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  placeholder?: string;
}> = React.memo(({ users, loading, selectedId, onSelect, placeholder = 'Sélectionner...' }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      `${u.firstName || ''} ${u.lastName || ''} ${u.email}`.toLowerCase().includes(q)
    );
  }, [users, search]);

  const selected = useMemo(() => users.find(u => String(u.id) === selectedId), [users, selectedId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full flex items-center justify-between border border-input rounded-md px-3 py-2 text-sm bg-background hover:bg-accent/50 transition-colors">
          <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
            {loading ? 'Chargement...' : selected ? `${selected.firstName || ''} ${selected.lastName || ''} (${selected.email})` : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="start">
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom ou email..." className="pl-8 h-8 text-sm" />
          </div>
        </div>
        <ScrollArea className="max-h-[250px]">
          <div className="p-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {loading ? 'Chargement...' : 'Aucun utilisateur trouvé'}
              </p>
            ) : filtered.map(u => (
              <div
                key={u.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${
                  String(u.id) === selectedId ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50'
                }`}
                onClick={() => { onSelect(String(u.id)); setOpen(false); }}
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{u.firstName || ''} {u.lastName || ''}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">{u.role}</Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
});
SearchableUserSelect.displayName = 'SearchableUserSelect';

// ─── Scope Multi-Select ──────────────────────────────────────────────────────

const ScopeMultiSelect: React.FC<{
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (vals: string[]) => void;
}> = React.memo(({ options, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  const toggleScope = (val: string) => {
    if (val === 'all') {
      onChange(selected.includes('all') ? [] : ['all']);
    } else {
      const without = selected.filter(s => s !== 'all');
      if (without.includes(val)) {
        onChange(without.filter(s => s !== val));
      } else {
        onChange([...without, val]);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full flex items-center justify-between border border-input rounded-md px-3 py-2 text-sm bg-background hover:bg-accent/50 transition-colors min-h-[36px]">
          <div className="flex flex-wrap gap-1 flex-1">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">Sélectionner les portées...</span>
            ) : selected.map(s => (
              <Badge key={s} variant="secondary" className="text-[10px]">
                {options.find(o => o.value === s)?.label || s}
              </Badge>
            ))}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <ScrollArea className="max-h-[200px]">
          <div className="p-1">
            {options.map(opt => (
              <div
                key={opt.value}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleScope(opt.value)}
              >
                <Checkbox checked={selected.includes(opt.value)} className="pointer-events-none" />
                <span className="text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
});
ScopeMultiSelect.displayName = 'ScopeMultiSelect';

// ─── Permission Row ──────────────────────────────────────────────────────────

const PermissionRow: React.FC<{
  perm: any;
  type: PermTableType;
  onDelete: (id: string, type: PermTableType) => void;
}> = React.memo(({ perm, type, onDelete }) => {
  const scope = perm.scope || 'all';
  const userName = type === 'manager'
    ? (perm.manager ? `${perm.manager.firstName || ''} ${perm.manager.lastName || ''}`.trim() : `Manager #${perm.managerId}`)
    : type === 'hyper_manager'
    ? (perm.hyperManager ? `${perm.hyperManager.firstName || ''} ${perm.hyperManager.lastName || ''}`.trim() : `HM #${perm.hyperManagerId}`)
    : (perm.guest ? `${perm.guest.firstName || ''} ${perm.guest.lastName || ''}`.trim() : `Guest #${perm.guestId}`);

  const email = type === 'manager' ? perm.manager?.email : type === 'hyper_manager' ? perm.hyperManager?.email : perm.guest?.email;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{userName}</span>
          {email && <span className="text-xs text-muted-foreground truncate">({email})</span>}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">Permission:</span>
          <Badge variant="outline" className="text-[10px]">{perm.backendPermissionKey}</Badge>
        </div>
      </div>
      <Badge variant={SCOPE_BADGE_VARIANT[scope] as any || 'outline'} className="shrink-0">
        {scope === 'all' ? 'Global' : scope.replace(/_/g, ' ')}
      </Badge>
      <Badge variant={perm.isGranted ? 'default' : 'secondary'} className="shrink-0">
        {perm.isGranted ? 'Accordé' : 'Refusé'}
      </Badge>
      <DynamicButton variant="ghost" size="sm" icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
        onClick={() => onDelete(perm.id, type)} />
    </div>
  );
});
PermissionRow.displayName = 'PermissionRow';

// ─── Main Component ──────────────────────────────────────────────────────────

export const ManagerAssignments: React.FC<ManagerAssignmentsProps> = React.memo(({ isHyperContext = false }) => {
  const { can, guardAction } = useRoleAccess('ManagerAssignments');
  const [data, setData] = useState<AllAssignmentsResponse>({ managerPermissions: [], hyperManagerPermissions: [], guestPermissions: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<PermTableType>(isHyperContext ? 'hyper_manager' : 'manager');

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<PermTableType>('manager');
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  /** Separate list of admins (only used as scope targets when scope=admins) */
  const [adminUsers, setAdminUsers] = useState<UserWithRoles[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['all']);
  const [backendPerms, setBackendPerms] = useState<RbacBackendPermission[]>([]);
  const [selectedPermKeys, setSelectedPermKeys] = useState<string[]>([]);
  const [permSearch, setPermSearch] = useState('');
  /** Advanced mode: show explicit permission picker. When false, all assigner-allowed perms are granted on the chosen scope. */
  const [advancedMode, setAdvancedMode] = useState(false);

  // Scope target IDs (when scope is properties, services, etc.)
  const [scopeTargetIds, setScopeTargetIds] = useState<Record<string, string[]>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await assignmentsApi.getAll();
      setData(res);
    } catch {
      toast.error('Erreur chargement des permissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const loadUsersForType = useCallback(async (type: PermTableType) => {
    setUsersLoading(true);
    try {
      const allUsers = await rolesApi.getAllUsers();
      const roleFilter: Record<PermTableType, string[]> = {
        manager: ['manager'],
        hyper_manager: ['hyper_manager'],
        guest: ['guest'],
      };
      setUsers(allUsers.filter(u => roleFilter[type].includes(u.role)));
      // Always load admins separately for use as scope targets
      setAdminUsers(allUsers.filter(u => u.role === 'admin'));
    } catch {
      toast.error('Erreur chargement utilisateurs');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadBackendPerms = useCallback(async () => {
    try {
      const perms = await rbacConfigApi.getBackendPermissions();
      setBackendPerms(perms);
    } catch { /* ignore */ }
  }, []);

  const openCreate = useCallback((type: PermTableType) => {
    setCreateType(type);
    setSelectedUserId('');
    setSelectedScopes(['all']);
    setSelectedPermKeys([]);
    setScopeTargetIds({});
    setPermSearch('');
    setAdvancedMode(false);
    setCreateOpen(true);
    loadUsersForType(type);
    loadBackendPerms();
  }, [loadUsersForType, loadBackendPerms]);

  const handleDelete = useCallback(async (id: string, type: PermTableType) => {
    try {
      await assignmentsApi.remove(id, type);
      toast.success('Permission supprimée');
      loadData();
    } catch {
      toast.error('Erreur suppression');
    }
  }, [loadData]);

  const handleCreate = useCallback(async () => {
    if (!selectedUserId) {
      toast.error('Veuillez sélectionner un utilisateur');
      return;
    }

    // In simple (non-advanced) mode, auto-grant ALL backend permissions on the chosen scope.
    // The assigner only picks where (scope) the assignee can act.
    const effectivePermKeys = advancedMode
      ? selectedPermKeys
      : backendPerms.map(p => p.permission_key);

    if (effectivePermKeys.length === 0) {
      toast.error(advancedMode
        ? 'Veuillez sélectionner au moins une permission'
        : 'Aucune permission backend disponible');
      return;
    }

    const effectiveScopes = selectedScopes.length === 0 ? ['all'] : selectedScopes;

    // Validate scope targets are picked when needed
    for (const s of effectiveScopes) {
      if (s !== 'all' && (scopeTargetIds[s] || []).length === 0) {
        toast.error(`Veuillez sélectionner au moins une cible pour la portée "${s}"`);
        return;
      }
    }

    try {
      const permissions = effectivePermKeys.flatMap(permKey =>
        effectiveScopes.map(scope => ({
          backendPermissionKey: permKey,
          scope,
          isGranted: true,
          properties: scope === 'properties' ? (scopeTargetIds['properties'] || []) : undefined,
          services: scope === 'services' ? (scopeTargetIds['services'] || []) : undefined,
          propertyGroups: scope === 'property_groups' ? (scopeTargetIds['property_groups'] || []) : undefined,
          serviceGroups: scope === 'service_groups' ? (scopeTargetIds['service_groups'] || []) : undefined,
          admins: scope === 'admins' ? (scopeTargetIds['admins'] || []).map(Number) : undefined,
        }))
      );

      const userId = Number(selectedUserId);
      if (createType === 'manager') {
        await assignmentsApi.setManagerPermissions(userId, permissions);
      } else if (createType === 'hyper_manager') {
        await assignmentsApi.setHyperManagerPermissions(userId, permissions as any);
      } else {
        await assignmentsApi.setGuestPermissions(userId, permissions);
      }

      toast.success(`Permissions accordées (${permissions.length} entrées)`);
      setCreateOpen(false);
      loadData();
    } catch {
      toast.error('Erreur lors de la création');
    }
  }, [selectedUserId, selectedPermKeys, selectedScopes, scopeTargetIds, createType, loadData, advancedMode, backendPerms]);

  const filteredPerms = useMemo(() => {
    if (!permSearch) return backendPerms;
    const q = permSearch.toLowerCase();
    return backendPerms.filter(p =>
      p.permission_key.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      p.module.toLowerCase().includes(q)
    );
  }, [backendPerms, permSearch]);

  const togglePermKey = (key: string) => {
    setSelectedPermKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const needsScopeTargets = selectedScopes.some(s => s !== 'all');
  const scopesNeedingTargets = selectedScopes.filter(s => s !== 'all');

  const tabCounts = useMemo(() => ({
    manager: data.managerPermissions.length,
    hyper_manager: data.hyperManagerPermissions.length,
    guest: data.guestPermissions.length,
  }), [data]);

  const currentPerms = activeTab === 'manager' ? data.managerPermissions
    : activeTab === 'hyper_manager' ? data.hyperManagerPermissions
    : data.guestPermissions;

  const tabIcons: Record<PermTableType, React.ReactNode> = {
    manager: <Users className="h-4 w-4" />,
    hyper_manager: <ShieldCheck className="h-4 w-4" />,
    guest: <UserCheck className="h-4 w-4" />,
  };

  const tabLabels: Record<PermTableType, string> = {
    manager: 'Managers',
    hyper_manager: 'Hyper Managers',
    guest: 'Guests',
  };

  if (loading) return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as PermTableType)}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            {(['manager', 'hyper_manager', 'guest'] as PermTableType[]).map(t => (
              <TabsTrigger key={t} value={t} className="gap-2">
                {tabIcons[t]}
                {tabLabels[t]}
                <Badge variant="secondary" className="text-[10px] ml-1">{tabCounts[t]}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          {can('Header', 'Button', 'Create') && (
            <DynamicButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => openCreate(activeTab)}>
              Ajouter Permission
            </DynamicButton>
          )}
        </div>

        {(['manager', 'hyper_manager', 'guest'] as PermTableType[]).map(t => (
          <TabsContent key={t} value={t}>
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  {tabIcons[t]}
                  Permissions {tabLabels[t]}
                  {t === 'guest' && (
                    <span className="text-xs text-muted-foreground font-normal ml-2">
                      (Sans scope défini = accès global par défaut)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                {(t === 'manager' ? data.managerPermissions : t === 'hyper_manager' ? data.hyperManagerPermissions : data.guestPermissions).length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Aucune permission assignée
                    {t === 'guest' && ' — les guests ont accès à toutes les portées par défaut'}
                  </div>
                ) : (
                  <ScrollArea className="max-h-[400px]">
                    {(t === 'manager' ? data.managerPermissions : t === 'hyper_manager' ? data.hyperManagerPermissions : data.guestPermissions).map((perm: any) => (
                      <PermissionRow key={perm.id} perm={perm} type={t} onDelete={handleDelete} />
                    ))}
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Permission Modal — Redesigned */}
      <DynamicModal open={createOpen} onOpenChange={setCreateOpen}
        title={`Accorder des permissions — ${tabLabels[createType]}`}
        size="lg"
      >
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Step 1 — Pick the user */}
          <section className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
              <Label className="font-semibold">Destinataire — {tabLabels[createType]}</Label>
            </div>
            <SearchableUserSelect
              users={users}
              loading={usersLoading}
              selectedId={selectedUserId}
              onSelect={setSelectedUserId}
              placeholder={`Sélectionner un ${createType === 'guest' ? 'guest' : createType === 'hyper_manager' ? 'hyper manager' : 'manager'}...`}
            />
          </section>

          {/* Step 2 — Pick the scope */}
          <section className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
              <Label className="font-semibold">Portée — où s'applique l'accès</Label>
            </div>
            <ScopeMultiSelect
              options={SCOPE_OPTIONS[createType]}
              selected={selectedScopes}
              onChange={setSelectedScopes}
            />
            <p className="text-xs text-muted-foreground">
              {advancedMode
                ? 'Les permissions sélectionnées ci-dessous seront accordées sur cette portée.'
                : 'Toutes les permissions backend + UI autorisées seront automatiquement accordées sur la portée choisie.'}
            </p>

            {/* Scope target selectors */}
            {needsScopeTargets && (
              <div className="space-y-3 pt-2 border-t border-border/50">
                {scopesNeedingTargets.map(scope => (
                  <div key={scope}>
                    {scope === 'admins' ? (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Admins cibles</Label>
                        <SearchableUserSelect
                          users={adminUsers}
                          loading={false}
                          selectedId=""
                          onSelect={(id) => {
                            setScopeTargetIds(prev => ({
                              ...prev,
                              admins: [...(prev.admins || []), id].filter((v, i, a) => a.indexOf(v) === i),
                            }));
                          }}
                          placeholder="Ajouter un admin..."
                        />
                        {(scopeTargetIds.admins || []).length > 0 && (
                          <ScrollArea className="max-h-[120px]">
                            <div className="flex flex-wrap gap-1 p-1">
                              {(scopeTargetIds.admins || []).map(id => {
                                const u = adminUsers.find(a => String(a.id) === id);
                                return (
                                  <Badge key={id} variant="secondary" className="text-[10px] gap-1">
                                    {u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email : `Admin #${id}`}
                                    <span className="cursor-pointer" onClick={() =>
                                      setScopeTargetIds(prev => ({ ...prev, admins: (prev.admins || []).filter(a => a !== id) }))
                                    }>×</span>
                                  </Badge>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        )}
                      </div>
                    ) : (
                      <MultiScopeSelector
                        scope={scope === 'properties' ? 'property' : scope === 'services' ? 'service' : scope}
                        selectedIds={scopeTargetIds[scope] || []}
                        onSelectionChange={(ids) => setScopeTargetIds(prev => ({ ...prev, [scope]: ids }))}
                        label={`Cibles — ${scope.replace(/_/g, ' ')}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Step 3 — Optional advanced permission picker */}
          <section className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-foreground text-xs font-bold">3</span>
                <Label className="font-semibold">Mode avancé — choisir les permissions</Label>
              </div>
              <Switch checked={advancedMode} onCheckedChange={setAdvancedMode} />
            </div>
            {!advancedMode ? (
              <div className="text-xs text-muted-foreground bg-muted/30 rounded px-3 py-2">
                Mode simple actif : toutes les permissions backend + UI permises pour ce rôle seront appliquées sur la portée choisie.
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input value={permSearch} onChange={e => setPermSearch(e.target.value)}
                    placeholder="Rechercher une permission..." className="pl-8 h-8 text-sm" />
                </div>
                <div className="flex gap-2 items-center">
                  <DynamicButton variant="ghost" size="sm" onClick={() => setSelectedPermKeys(filteredPerms.map(p => p.permission_key))}>
                    Tout sélectionner
                  </DynamicButton>
                  <DynamicButton variant="ghost" size="sm" onClick={() => setSelectedPermKeys([])}>
                    Tout désélectionner
                  </DynamicButton>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {selectedPermKeys.length}/{backendPerms.length} sélectionnées
                  </span>
                </div>
                <ScrollArea className="h-[260px] border border-border rounded-md">
                  <div className="p-1">
                    {filteredPerms.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Aucune permission trouvée</p>
                    ) : filteredPerms.map(perm => (
                      <div
                        key={perm.permission_key}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => togglePermKey(perm.permission_key)}
                      >
                        <Checkbox checked={selectedPermKeys.includes(perm.permission_key)} className="pointer-events-none" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm truncate block">{perm.permission_key}</span>
                          {perm.description && <span className="text-[10px] text-muted-foreground truncate block">{perm.description}</span>}
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">{perm.module}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </section>

          <div className="flex gap-2 pt-2 sticky bottom-0 bg-background pb-1">
            <DynamicButton variant="primary" icon={<Shield className="h-4 w-4" />} onClick={handleCreate}>
              Accorder l'accès
            </DynamicButton>
            <DynamicButton variant="outline" onClick={() => setCreateOpen(false)}>Annuler</DynamicButton>
          </div>
        </div>
      </DynamicModal>
    </div>
  );
});

ManagerAssignments.displayName = 'ManagerAssignments';
