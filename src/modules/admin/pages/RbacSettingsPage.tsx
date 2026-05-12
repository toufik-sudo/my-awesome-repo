import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchableSelect } from '@/modules/onboarding/components/SearchableSelect';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Shield,
  RefreshCw,
  Save,
  AlertTriangle,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Lock,
  Link2,
  Trash2,
  Search,
  ArrowRight,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { rbacConfigApi, type RbacBackendPermission, type RbacFrontendPermission, type RbacScope, type BackendCatalogController } from '../rbac-config.api';
import { CreatePermissionModal } from '../components/CreatePermissionModal';
import { RbacCatalogDiffPanel } from '../components/RbacCatalogDiffPanel';
import { permissionBindingsApi, type PermissionBinding } from '../permission-bindings.api';
import { useEffect as useEffectSocket } from 'react';
import { io } from 'socket.io-client';
import { getStoredJWT } from '@/utils/jwt';

import { usePermissions } from '@/hooks/usePermissions';
import { useRoleAccess } from '@/hooks/useRoleAccess';

const SCOPE_OPTIONS: RbacScope[] = ['global', 'admin', 'assigned', 'own', 'inherited'];
const ALL_ROLES = ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user', 'guest'];
const ROLE_LABELS: Record<string, string> = {
  hyper_admin: 'Hyper Admin',
  hyper_manager: 'Hyper Manager',
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
  guest: 'Guest',
};
const ROLE_COLORS: Record<string, string> = {
  hyper_admin: 'bg-red-500/10 text-red-600 border-red-200',
  hyper_manager: 'bg-orange-500/10 text-orange-600 border-orange-200',
  admin: 'bg-blue-500/10 text-blue-600 border-blue-200',
  manager: 'bg-green-500/10 text-green-600 border-green-200',
  user: 'bg-gray-500/10 text-gray-600 border-gray-200',
  guest: 'bg-purple-500/10 text-purple-600 border-purple-200',
};
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const BindingsAutocomplete: React.FC<{
  value: string;
  onChange: (v: string) => void;
  bindings: PermissionBinding[];
  placeholder?: string;
}> = ({ value, onChange, bindings, placeholder }) => {
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    const pool = new Set<string>();
    bindings.forEach((b) => {
      pool.add(b.frontendPermissionApi);
      pool.add(b.backendPermissionKey);
      if (b.module) pool.add(b.module);
      if (b.endpoint_url) pool.add(b.endpoint_url);
    });
    const all = Array.from(pool);
    if (!q) return all.slice(0, 8);
    const starts = all.filter((s) => s.toLowerCase().startsWith(q));
    const contains = all.filter((s) => !s.toLowerCase().startsWith(q) && s.toLowerCase().includes(q));
    return [...starts, ...contains].slice(0, 12);
  }, [bindings, value]);

  return (
    <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => { onChange(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={placeholder}
            className="pl-9"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="end"
        className="w-[380px] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>—</CommandEmpty>
            <CommandGroup>
              {suggestions.map((s) => (
                <CommandItem
                  key={s}
                  value={s}
                  onSelect={() => { onChange(s); setOpen(false); }}
                  className="font-mono text-xs"
                >
                  {s}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const RbacSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { can } = useRoleAccess('RbacSettingsPage');
  const {
    role: currentUserRole,
    isHyperAdmin,
    isHyperManager,
    isAdmin,
    canViewRbacSettings,
    canEditRbacSettings,
    reloadPermissions,
  } = usePermissions();

  const [activeTab, setActiveTab] = useState('backend');
  const [backendPerms, setBackendPerms] = useState<RbacBackendPermission[]>([]);
  const [backendTotal, setBackendTotal] = useState(0);
  const [backendModules, setBackendModules] = useState<string[]>([]);
  const [backendModule, setBackendModule] = useState<string>('');
  const [backendSearch, setBackendSearch] = useState('');
  const [backendPage, setBackendPage] = useState(1);
  const [backendPageSize, setBackendPageSize] = useState(20);
  const [backendLoading, setBackendLoading] = useState(false);

  const [frontendPerms, setFrontendPerms] = useState<RbacFrontendPermission[]>([]);
  const [frontendTotal, setFrontendTotal] = useState(0);
  const [frontendModules, setFrontendModules] = useState<string[]>([]);
  const [frontendModule, setFrontendModule] = useState<string>('');
  const [frontendSearch, setFrontendSearch] = useState('');
  const [frontendPage, setFrontendPage] = useState(1);
  const [frontendPageSize, setFrontendPageSize] = useState(20);
  const [frontendLoading, setFrontendLoading] = useState(false);

  const [bindings, setBindings] = useState<PermissionBinding[]>([]);
  const [backendCatalog, setBackendCatalog] = useState<BackendCatalogController[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bindingsLoading, setBindingsLoading] = useState(false);
  const [pendingBackendChanges, setPendingBackendChanges] = useState<Map<string, { permission_key: string; allowed?: boolean; scope?: RbacScope; user_roles?: string[] }>>(new Map());
  const [pendingFrontendChanges, setPendingFrontendChanges] = useState<Map<string, { permission_key: string; allowed?: boolean; user_roles?: string[] }>>(new Map());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createPrefill, setCreatePrefill] = useState<import('../components/CreatePermissionModal').CreatePermissionPrefill | null>(null);
  const [allBackendPerms, setAllBackendPerms] = useState<RbacBackendPermission[]>([]);
  const [allFrontendPerms, setAllFrontendPerms] = useState<RbacFrontendPermission[]>([]);
  const [bindingsSearch, setBindingsSearch] = useState('');

  const canViewRbac = canViewRbacSettings && can('View');
  const canEditRbac = canEditRbacSettings;

  const visibleRoles = useMemo(() => {
    if (isHyperAdmin) return ALL_ROLES;
    if (isHyperManager) return ALL_ROLES.filter((role) => role !== 'hyper_admin');
    if (isAdmin) return ['manager', 'guest'];
    return [];
  }, [isHyperAdmin, isHyperManager, isAdmin]);

  const fetchBackendPage = useCallback(async () => {
    setBackendLoading(true);
    try {
      const res = await rbacConfigApi.getBackendPermissionsPaginated({
        page: backendPage,
        pageSize: backendPageSize,
        module: backendModule || undefined,
        search: backendSearch || undefined,
      });
      setBackendPerms(res.data);
      setBackendTotal(res.total);
    } catch {
      toast.error(t('rbac.errors.loadFailed'));
    } finally {
      setBackendLoading(false);
    }
  }, [backendPage, backendPageSize, backendModule, backendSearch, t]);

  const fetchFrontendPage = useCallback(async () => {
    setFrontendLoading(true);
    try {
      const res = await rbacConfigApi.getFrontendPermissionsPaginated({
        page: frontendPage,
        pageSize: frontendPageSize,
        module: frontendModule || undefined,
        search: frontendSearch || undefined,
      });
      setFrontendPerms(res.data);
      setFrontendTotal(res.total);
    } catch {
      toast.error(t('rbac.errors.loadFailed'));
    } finally {
      setFrontendLoading(false);
    }
  }, [frontendPage, frontendPageSize, frontendModule, frontendSearch, t]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [r, bindingRows, catalog, bModules, fModules] = await Promise.all([
        rbacConfigApi.getRoles(),
        permissionBindingsApi.getAll(),
        rbacConfigApi.getBackendCatalog(),
        rbacConfigApi.getBackendPermissionModules(),
        rbacConfigApi.getFrontendPermissionModules(),
      ]);
      setRoles(r);
      setBindings(bindingRows);
      setBackendCatalog(catalog);
      setBackendModules(bModules);
      setFrontendModules(fModules);
      setPendingBackendChanges(new Map());
      setPendingFrontendChanges(new Map());
      await Promise.all([fetchBackendPage(), fetchFrontendPage()]);
    } catch {
      toast.error(t('rbac.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t, fetchBackendPage, fetchFrontendPage]);

  useEffect(() => {
    if (canViewRbac) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewRbac]);

  // Refetch backend page when its filters/page change
  useEffect(() => { if (canViewRbac && !loading) fetchBackendPage(); }, [backendPage, backendPageSize, backendModule, backendSearch]); // eslint-disable-line
  useEffect(() => { if (canViewRbac && !loading) fetchFrontendPage(); }, [frontendPage, frontendPageSize, frontendModule, frontendSearch]); // eslint-disable-line

  // Reset to page 1 when filters change
  useEffect(() => { setBackendPage(1); }, [backendModule, backendSearch, backendPageSize]);
  useEffect(() => { setFrontendPage(1); }, [frontendModule, frontendSearch, frontendPageSize]);

  // Lazy-load all perms when modal opens (for duplicate detection)
  useEffect(() => {
    if (!showCreateModal) return;
    if (allBackendPerms.length === 0) rbacConfigApi.getBackendPermissions().then(setAllBackendPerms).catch(() => {});
    if (allFrontendPerms.length === 0) rbacConfigApi.getFrontendPermissions().then(setAllFrontendPerms).catch(() => {});
  }, [showCreateModal]); // eslint-disable-line

  useEffectSocket(() => {
    const token = getStoredJWT();
    if (!token) return;
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8095';
    const socket = io(socketUrl, { auth: { token }, transports: ['websocket', 'polling'] });
    socket.on('rbac:updated', () => {
      toast.info(t('rbac.realtimeUpdate'));
      fetchAll();
    });
    return () => {
      socket.disconnect();
    };
  }, [fetchAll, t]);

  const filteredBindings = useMemo(() => {
    if (!bindingsSearch) return bindings;
    const query = bindingsSearch.toLowerCase();
    return bindings.filter((binding) =>
      binding.frontendPermissionApi.toLowerCase().includes(query) ||
      binding.backendPermissionKey.toLowerCase().includes(query) ||
      binding.module.toLowerCase().includes(query) ||
      (binding.endpoint_url || '').toLowerCase().includes(query),
    );
  }, [bindings, bindingsSearch]);

  const backendTotalPages = Math.max(1, Math.ceil(backendTotal / backendPageSize));
  const frontendTotalPages = Math.max(1, Math.ceil(frontendTotal / frontendPageSize));
  const toggleBackendRole = (perm: RbacBackendPermission, roleToToggle: string) => {
    if (!canEditRbac) return;
    const existing = pendingBackendChanges.get(perm.id) || { permission_key: perm.permission_key };
    const currentRoles = existing.user_roles || [...perm.user_roles];
    const newRoles = currentRoles.includes(roleToToggle)
      ? currentRoles.filter((role) => role !== roleToToggle)
      : [...currentRoles, roleToToggle];
    setPendingBackendChanges((prev) => {
      const next = new Map(prev);
      next.set(perm.id, { ...existing, permission_key: perm.permission_key, user_roles: newRoles });
      return next;
    });
  };

  const toggleFrontendRole = (perm: RbacFrontendPermission, roleToToggle: string) => {
    if (!canEditRbac) return;
    const existing = pendingFrontendChanges.get(perm.id) || { permission_key: perm.permission_key };
    const currentRoles = existing.user_roles || [...perm.user_roles];
    const newRoles = currentRoles.includes(roleToToggle)
      ? currentRoles.filter((role) => role !== roleToToggle)
      : [...currentRoles, roleToToggle];
    setPendingFrontendChanges((prev) => {
      const next = new Map(prev);
      next.set(perm.id, { ...existing, permission_key: perm.permission_key, user_roles: newRoles });
      return next;
    });
  };

  const getEffectiveBackendRoles = (perm: RbacBackendPermission): string[] => pendingBackendChanges.get(perm.id)?.user_roles || perm.user_roles;
  const getEffectiveFrontendRoles = (perm: RbacFrontendPermission): string[] => pendingFrontendChanges.get(perm.id)?.user_roles || perm.user_roles;
  const hasChanges = pendingBackendChanges.size > 0 || pendingFrontendChanges.size > 0;

  const saveChanges = async () => {
    if (!canEditRbac) return;
    setSaving(true);
    try {
      const errors: string[] = [];
      if (pendingBackendChanges.size > 0) {
        const updates = Array.from(pendingBackendChanges.values()).map(({ permission_key, ...changes }) => ({ permission_key, ...changes }));
        const result = await rbacConfigApi.bulkUpdateBackend(updates);
        if (result.errors.length) errors.push(...result.errors);
      }
      if (pendingFrontendChanges.size > 0) {
        const updates = Array.from(pendingFrontendChanges.values()).map(({ permission_key, ...changes }) => ({ permission_key, ...changes }));
        const result = await rbacConfigApi.bulkUpdateFrontend(updates);
        if (result.errors.length) errors.push(...result.errors);
      }
      if (errors.length) {
        toast.warning(t('rbac.savePartial', { count: errors.length }));
      } else {
        toast.success(t('rbac.confirm.saved'));
      }
      await rbacConfigApi.reloadCache();
      await fetchAll();
      await reloadPermissions();
    } catch {
      toast.error(t('rbac.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleReload = async () => {
    try {
      await rbacConfigApi.reloadCache();
      toast.success(t('rbac.cacheReloaded'));
      await fetchAll();
      await reloadPermissions();
    } catch {
      toast.error(t('rbac.errors.reloadFailed'));
    }
  };

  const discardChanges = () => {
    setPendingBackendChanges(new Map());
    setPendingFrontendChanges(new Map());
    toast.info(t('rbac.changesDiscarded'));
  };

  const handleBindingDelete = async (id: string) => {
    if (!canEditRbac) return;
    setBindingsLoading(true);
    try {
      await permissionBindingsApi.remove(id);
      toast.success(t('rbac.bindingDeleted', 'Binding deleted'));
      await fetchAll();
      await reloadPermissions();
    } catch {
      toast.error(t('rbac.errors.deleteFailed', 'Delete failed'));
    } finally {
      setBindingsLoading(false);
    }
  };


  const PaginationControls: React.FC<{ currentPage: number; pageSize: number; setPageSize: (n: number) => void; totalPages: number; totalItems: number; onPageChange: (page: number) => void }> = ({ currentPage, pageSize, setPageSize, totalPages, totalItems, onPageChange }) => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{Math.min((currentPage - 1) * pageSize + 1, totalItems)}–{Math.min(currentPage * pageSize, totalItems)} / {totalItems}</span>
        <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
          <SelectTrigger className="h-7 w-[70px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{PAGE_SIZE_OPTIONS.map((size) => <SelectItem key={size} value={String(size)} className="text-xs">{size}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="h-7 w-7" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="text-sm px-2">{currentPage}/{totalPages}</span>
        <Button variant="outline" size="icon" className="h-7 w-7" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );

  const FilterBar: React.FC<{
    moduleValue: string; setModuleValue: (v: string) => void; modules: string[];
    searchValue: string; setSearchValue: (v: string) => void;
  }> = ({ moduleValue, setModuleValue, modules, searchValue, setSearchValue }) => (
    <div className="flex items-center gap-2 p-3 border-b border-border">
      <div className="w-[220px]">
        <SearchableSelect
          options={[
            { value: '__all__', label: t('rbac.filters.allModules', 'All modules') },
            ...modules.map((m) => ({ value: m, label: m })),
          ]}
          value={moduleValue || '__all__'}
          onChange={(v) => setModuleValue(v === '__all__' ? '' : v)}
          placeholder={t('rbac.filters.module', 'Module')}
          searchPlaceholder={t('rbac.filters.searchModule', 'Search module…')}
        />
      </div>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder={t('rbac.filters.searchPlaceholder', 'Search…')} className="pl-9 h-9" />
      </div>
    </div>
  );

  if (!canViewRbac) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">{t('rbac.accessDenied', 'Access Denied')}</h2>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('rbac.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('rbac.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEditRbac && (
            <Button size="sm" variant="default" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-1" /> {t('rbac.create.btn')}
            </Button>
          )}
          {!canEditRbac && <Badge variant="secondary" className="gap-1"><Lock className="h-3 w-3" /> {t('rbac.readOnly')}</Badge>}
          <Button variant="outline" size="sm" onClick={handleReload}><RefreshCw className="h-4 w-4 mr-1" /> {t('rbac.reload')}</Button>
          {hasChanges && canEditRbac && (
            <>
              <Button variant="ghost" size="sm" onClick={discardChanges}><X className="h-4 w-4 mr-1" /> {t('rbac.discard')}</Button>
              <Button size="sm" onClick={saveChanges} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                {t('rbac.save')} ({pendingBackendChanges.size + pendingFrontendChanges.size})
              </Button>
            </>
          )}
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-center gap-2 p-3 bg-muted/40 border border-border rounded-lg">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">{t('rbac.pendingWarning', { count: pendingBackendChanges.size + pendingFrontendChanges.size })}</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="backend">{t('rbac.tabs.backend')} ({backendTotal})</TabsTrigger>
          <TabsTrigger value="frontend">{t('rbac.tabs.frontend')} ({frontendTotal})</TabsTrigger>
          <TabsTrigger value="bindings"><Link2 className="h-4 w-4 mr-1" />{t('rbac.tabs.bindings', 'Bindings')} ({filteredBindings.length})</TabsTrigger>
          <TabsTrigger value="diff"><AlertTriangle className="h-4 w-4 mr-1" />{t('rbac.tabs.diff', 'Diff')}</TabsTrigger>
        </TabsList>

        <TabsContent value="backend">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-lg">{t('rbac.backendMatrix')}</CardTitle></CardHeader>
            <CardContent className="p-0">
              <FilterBar
                moduleValue={backendModule} setModuleValue={setBackendModule} modules={backendModules}
                searchValue={backendSearch} setSearchValue={setBackendSearch}
              />
              <div className="h-[500px] overflow-auto relative">
                  <table className="w-full text-sm border-separate border-spacing-0">
                    <thead className="sticky top-0 bg-background z-10 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground min-w-[360px]">{t('rbac.columns.permission')}</th>
                        {visibleRoles.map((role) => (
                          <th key={role} className="text-center p-3 min-w-[90px]"><Badge variant="outline" className={`text-xs ${ROLE_COLORS[role] || ''}`}>{ROLE_LABELS[role]}</Badge></th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {backendLoading && (
                        <tr><td colSpan={visibleRoles.length + 1} className="p-6 text-center text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />{t('common.loading', 'Loading…')}</td></tr>
                      )}
                      {!backendLoading && backendPerms.map((perm) => {
                        const effectiveRoles = getEffectiveBackendRoles(perm);
                        const isChanged = pendingBackendChanges.has(perm.id);
                        return (
                          <tr key={perm.id} className={`border-b hover:bg-muted/30 transition-colors ${isChanged ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}`}>
                            <td className="p-3">
                              <div className="font-medium text-foreground text-xs">{perm.permission_key}</div>
                              <div className="text-[10px] text-muted-foreground">{perm.controller}.{perm.endpoint} · {perm.method} · {perm.module} · {perm.scope}</div>
                              <div className="text-[10px] text-muted-foreground">{perm.endpoint_url || '—'}</div>
                            </td>
                            {visibleRoles.map((role) => (
                              <td key={role} className="text-center p-2">
                                <Checkbox checked={effectiveRoles.includes(role)} onCheckedChange={() => toggleBackendRole(perm, role)} disabled={!canEditRbac} />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
              </div>
              <PaginationControls currentPage={backendPage} pageSize={backendPageSize} setPageSize={setBackendPageSize} totalPages={backendTotalPages} totalItems={backendTotal} onPageChange={setBackendPage} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frontend">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-lg">{t('rbac.frontendMatrix')}</CardTitle></CardHeader>
            <CardContent className="p-0">
              <FilterBar
                moduleValue={frontendModule} setModuleValue={setFrontendModule} modules={frontendModules}
                searchValue={frontendSearch} setSearchValue={setFrontendSearch}
              />
              <div className="h-[500px] overflow-auto relative">
                  <table className="w-full text-sm border-separate border-spacing-0">
                    <thead className="sticky top-0 bg-background z-10 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground min-w-[280px] bg-background border-b">{t('rbac.columns.uiKey')}</th>
                        {visibleRoles.map((role) => (
                          <th key={role} className="text-center p-3 min-w-[90px] bg-background border-b"><Badge variant="outline" className={`text-xs ${ROLE_COLORS[role] || ''}`}>{ROLE_LABELS[role]}</Badge></th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {frontendLoading && (
                        <tr><td colSpan={visibleRoles.length + 1} className="p-6 text-center text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />{t('common.loading', 'Loading…')}</td></tr>
                      )}
                      {!frontendLoading && frontendPerms.map((perm) => {
                        const effectiveRoles = getEffectiveFrontendRoles(perm);
                        const isChanged = pendingFrontendChanges.has(perm.id);
                        return (
                          <tr key={perm.id} className={`border-b hover:bg-muted/30 transition-colors ${isChanged ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}`}>
                            <td className="p-3 border-b">
                              <div className="font-medium text-foreground text-xs">{perm.permission_key}</div>
                              <div className="text-[10px] text-muted-foreground">{perm.component}{perm.sub_view ? `.${perm.sub_view}` : ''}{perm.element_type ? `.${perm.element_type}` : ''}{perm.action_name ? `.${perm.action_name}` : ''} · {perm.module}</div>
                            </td>
                            {visibleRoles.map((role) => (
                              <td key={role} className="text-center p-2 border-b">
                                <Checkbox checked={effectiveRoles.includes(role)} onCheckedChange={() => toggleFrontendRole(perm, role)} disabled={!canEditRbac} />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
              </div>
              <PaginationControls currentPage={frontendPage} pageSize={frontendPageSize} setPageSize={setFrontendPageSize} totalPages={frontendTotalPages} totalItems={frontendTotal} onPageChange={setFrontendPage} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bindings">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">{t('rbac.tabs.bindings', 'Bindings')}</CardTitle>
                <BindingsAutocomplete
                  value={bindingsSearch}
                  onChange={setBindingsSearch}
                  bindings={bindings}
                  placeholder={t('rbac.bindings.search', 'Search bindings')}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-auto rounded-b-lg">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="bg-background">{t('rbac.bindings.frontendApi', 'Frontend API')}</TableHead>
                      <TableHead className="bg-background">{t('rbac.bindings.backendPermission', 'Backend Permission')}</TableHead>
                      <TableHead className="bg-background">{t('rbac.bindings.endpointUrl', 'API URL')}</TableHead>
                      <TableHead className="bg-background w-[120px]">{t('rbac.bindings.module', 'Module')}</TableHead>
                      <TableHead className="bg-background">{t('rbac.bindings.roles', 'Roles')}</TableHead>
                      <TableHead className="bg-background w-[140px]">{t('rbac.bindings.backend', 'Backend')}</TableHead>
                      <TableHead className="bg-background text-right w-[80px]">{t('rbac.bindings.actions', 'Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBindings.map((binding, idx) => (
                      <TableRow
                        key={binding.id}
                        className={idx % 2 === 0 ? 'bg-muted/20 hover:bg-muted/40' : 'hover:bg-muted/40'}
                      >
                        <TableCell className="font-mono text-xs whitespace-nowrap">{binding.frontendPermissionApi}</TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">{binding.backendPermissionKey}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[260px] truncate" title={binding.endpoint_url || ''}>{binding.endpoint_url || '—'}</TableCell>
                        <TableCell className="text-xs"><Badge variant="outline" className="text-[10px]">{binding.module}</Badge></TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {binding.backendUserRoles.map((role) => (
                              <Badge key={role} variant="outline" className={`text-[10px] px-1.5 py-0 ${ROLE_COLORS[role] || ''}`}>{ROLE_LABELS[role] || role}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 text-xs"
                            onClick={() => {
                              setBackendModule('');
                              setBackendSearch(binding.backendPermissionKey);
                              setBackendPage(1);
                              setActiveTab('backend');
                            }}
                          >
                            {t('rbac.bindings.goToBackend', 'Go to backend')}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canEditRbac || bindingsLoading} onClick={() => handleBindingDelete(binding.id)}>
                            {bindingsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredBindings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          {t('rbac.bindings.empty', 'No bindings found')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diff">
          <RbacCatalogDiffPanel
            canEditRbac={canEditRbac}
            onQuickCreateBackend={(entry) => {
              setCreatePrefill({
                type: 'backend',
                controller: entry.controller,
                endpoint: entry.endpoint,
                method: entry.method,
                endpoint_url: entry.endpoint_url || undefined,
                module: entry.module,
                permission_key: entry.permission_key,
              });
              setShowCreateModal(true);
            }}
            onQuickCreateFrontend={(entry) => {
              setCreatePrefill({
                type: 'binding',
                frontendApiKey: entry.frontendApiKey,
                module: entry.module,
              });
              setShowCreateModal(true);
            }}
          />
        </TabsContent>
      </Tabs>

      <CreatePermissionModal
        open={showCreateModal}
        onClose={() => { setShowCreateModal(false); setCreatePrefill(null); }}
        roles={visibleRoles}
        existingBackendPerms={allBackendPerms}
        existingFrontendPerms={allFrontendPerms}
        existingBindings={bindings}
        backendCatalog={backendCatalog}
        currentUserRole={currentUserRole}
        prefill={createPrefill}
        onCreateBackend={async (data) => {
          await rbacConfigApi.createBackendPermission(data);
        }}
        onCreateFrontend={async (data) => {
          await rbacConfigApi.createFrontendPermission(data);
        }}
        onCreated={async () => {
          await fetchAll();
          await reloadPermissions();
        }}
      />
    </div>
  );
};
