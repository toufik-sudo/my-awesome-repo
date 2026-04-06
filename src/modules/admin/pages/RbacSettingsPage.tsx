import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Shield, RefreshCw, Save, AlertTriangle, X, Loader2, ChevronLeft, ChevronRight, Plus, Lock } from 'lucide-react';
import { rbacConfigApi, type RbacBackendPermission, type RbacFrontendPermission, type RbacScope } from '../rbac-config.api';
import { CreatePermissionModal } from '../components/CreatePermissionModal';
import { useEffect as useEffectSocket } from 'react';
import { io } from 'socket.io-client';
import { getStoredJWT } from '@/utils/jwt';
import { DynamicFilter, type FilterConfig, type ActiveFilter } from '@/modules/shared/components/DynamicFilter';
import { usePermissions } from '@/hooks/usePermissions';
import Swal from 'sweetalert2';

const SCOPE_OPTIONS: RbacScope[] = ['global', 'admin', 'assigned', 'own', 'inherited'];
const ALL_ROLES = ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user', 'guest'];
const ROLE_LABELS: Record<string, string> = {
  hyper_admin: 'Hyper Admin', hyper_manager: 'Hyper Manager', admin: 'Admin',
  manager: 'Manager', user: 'User', guest: 'Guest',
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

export const RbacSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { role: currentUserRole, isHyperAdmin, isHyperManager, isHyper, isAdmin, rbacConfig: userRbacConfig, canViewRbacSettings, canEditRbacSettings } = usePermissions();

  const [activeTab, setActiveTab] = useState('backend');
  const [backendPerms, setBackendPerms] = useState<RbacBackendPermission[]>([]);
  const [frontendPerms, setFrontendPerms] = useState<RbacFrontendPermission[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingBackendChanges, setPendingBackendChanges] = useState<Map<string, { allowed?: boolean; scope?: RbacScope; user_roles?: string[] }>>(new Map());
  const [pendingFrontendChanges, setPendingFrontendChanges] = useState<Map<string, { allowed?: boolean; user_roles?: string[] }>>(new Map());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [backendPage, setBackendPage] = useState(1);
  const [frontendPage, setFrontendPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const canViewRbac = canViewRbacSettings;
  const canEditRbac = canEditRbacSettings;

  const visibleRoles = useMemo(() => {
    if (isHyperAdmin) return ALL_ROLES;
    if (isHyperManager) return ALL_ROLES.filter(r => r !== 'hyper_admin');
    if (isAdmin) return ['manager', 'guest'];
    return [];
  }, [isHyperAdmin, isHyperManager, isAdmin]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [b, f, r] = await Promise.all([
        rbacConfigApi.getBackendPermissions(),
        rbacConfigApi.getFrontendPermissions(),
        rbacConfigApi.getRoles(),
      ]);
      setBackendPerms(b);
      setFrontendPerms(f);
      setRoles(r);
      setPendingBackendChanges(new Map());
      setPendingFrontendChanges(new Map());
    } catch {
      toast.error(t('rbac.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { if (canViewRbac) fetchAll(); }, [fetchAll, canViewRbac]);

  useEffectSocket(() => {
    const token = getStoredJWT();
    if (!token) return;
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8095';
    const socket = io(socketUrl, { auth: { token }, transports: ['websocket', 'polling'] });
    socket.on('rbac:updated', () => { toast.info(t('rbac.realtimeUpdate')); fetchAll(); });
    return () => { socket.disconnect(); };
  }, [fetchAll, t]);

  const filterConfigs: FilterConfig[] = useMemo(() => {
    const modules = [...new Set(backendPerms.map(p => p.module))].sort();
    return [
      { id: 'search', name: t('rbac.filters.search'), icon: Shield, type: 'text' as const, placeholder: t('rbac.filters.searchPlaceholder') },
      { id: 'module', name: t('rbac.filters.module', 'Module'), icon: Shield, type: 'multiselect' as const, options: modules.map(m => ({ label: m, value: m })) },
      { id: 'scope', name: t('rbac.filters.scope'), icon: Shield, type: 'select' as const, options: SCOPE_OPTIONS.map(s => ({ label: s, value: s })) },
      { id: 'status', name: t('rbac.filters.status'), icon: Shield, type: 'select' as const, options: [
        { label: t('rbac.filters.allowed'), value: 'allowed' },
        { label: t('rbac.filters.denied'), value: 'denied' },
      ]},
    ];
  }, [backendPerms, t]);

  const getFilterValue = useCallback((filterId: string) => activeFilters.find(f => f.id === filterId)?.value, [activeFilters]);

  // Backend filtered & paginated
  const filteredBackend = useMemo(() => {
    const searchVal = getFilterValue('search') as string || '';
    const moduleFilter = getFilterValue('module') as string[] || [];
    const scopeFilter = getFilterValue('scope') as string || '';
    const statusFilter = getFilterValue('status') as string || '';

    let filtered = backendPerms;
    if (moduleFilter.length > 0) filtered = filtered.filter(p => moduleFilter.includes(p.module));
    if (scopeFilter) filtered = filtered.filter(p => p.scope === scopeFilter);
    if (statusFilter === 'allowed') filtered = filtered.filter(p => p.allowed);
    else if (statusFilter === 'denied') filtered = filtered.filter(p => !p.allowed);
    if (searchVal) filtered = filtered.filter(p =>
      p.permission_key.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.controller.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.endpoint.toLowerCase().includes(searchVal.toLowerCase())
    );
    return filtered;
  }, [backendPerms, getFilterValue]);

  const filteredFrontend = useMemo(() => {
    const searchVal = getFilterValue('search') as string || '';
    const moduleFilter = getFilterValue('module') as string[] || [];
    const statusFilter = getFilterValue('status') as string || '';

    let filtered = frontendPerms;
    if (moduleFilter.length > 0) filtered = filtered.filter(p => moduleFilter.includes(p.module));
    if (statusFilter === 'allowed') filtered = filtered.filter(p => p.allowed);
    else if (statusFilter === 'denied') filtered = filtered.filter(p => !p.allowed);
    if (searchVal) filtered = filtered.filter(p =>
      p.permission_key.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.component.toLowerCase().includes(searchVal.toLowerCase())
    );
    return filtered;
  }, [frontendPerms, getFilterValue]);

  const backendTotalPages = Math.max(1, Math.ceil(filteredBackend.length / pageSize));
  const frontendTotalPages = Math.max(1, Math.ceil(filteredFrontend.length / pageSize));
  const paginatedBackend = useMemo(() => filteredBackend.slice((backendPage - 1) * pageSize, backendPage * pageSize), [filteredBackend, backendPage, pageSize]);
  const paginatedFrontend = useMemo(() => filteredFrontend.slice((frontendPage - 1) * pageSize, frontendPage * pageSize), [filteredFrontend, frontendPage, pageSize]);

  useEffect(() => { setBackendPage(1); setFrontendPage(1); }, [activeFilters, pageSize]);

  // Toggle role in user_roles array
  const toggleBackendRole = (perm: RbacBackendPermission, roleToToggle: string) => {
    if (!canEditRbac) return;
    const existing = pendingBackendChanges.get(perm.id) || {};
    const currentRoles = existing.user_roles || [...perm.user_roles];
    const newRoles = currentRoles.includes(roleToToggle)
      ? currentRoles.filter(r => r !== roleToToggle)
      : [...currentRoles, roleToToggle];
    setPendingBackendChanges(prev => {
      const next = new Map(prev);
      next.set(perm.id, { ...existing, user_roles: newRoles });
      return next;
    });
  };

  const toggleFrontendRole = (perm: RbacFrontendPermission, roleToToggle: string) => {
    if (!canEditRbac) return;
    const existing = pendingFrontendChanges.get(perm.id) || {};
    const currentRoles = existing.user_roles || [...perm.user_roles];
    const newRoles = currentRoles.includes(roleToToggle)
      ? currentRoles.filter(r => r !== roleToToggle)
      : [...currentRoles, roleToToggle];
    setPendingFrontendChanges(prev => {
      const next = new Map(prev);
      next.set(perm.id, { ...existing, user_roles: newRoles });
      return next;
    });
  };

  const getEffectiveBackendRoles = (perm: RbacBackendPermission): string[] => {
    return pendingBackendChanges.get(perm.id)?.user_roles || perm.user_roles;
  };

  const getEffectiveFrontendRoles = (perm: RbacFrontendPermission): string[] => {
    return pendingFrontendChanges.get(perm.id)?.user_roles || perm.user_roles;
  };

  const hasChanges = pendingBackendChanges.size > 0 || pendingFrontendChanges.size > 0;

  const saveChanges = async () => {
    if (!canEditRbac) return;
    setSaving(true);
    try {
      const errors: string[] = [];
      if (pendingBackendChanges.size > 0) {
        const updates = Array.from(pendingBackendChanges.entries()).map(([id, changes]) => {
          const perm = backendPerms.find(p => p.id === id)!;
          return { permission_key: perm.permission_key, ...changes };
        });
        const result = await rbacConfigApi.bulkUpdateBackend(updates);
        if (result.errors.length) errors.push(...result.errors);
      }
      if (pendingFrontendChanges.size > 0) {
        const updates = Array.from(pendingFrontendChanges.entries()).map(([id, changes]) => {
          const perm = frontendPerms.find(p => p.id === id)!;
          return { permission_key: perm.permission_key, ...changes };
        });
        const result = await rbacConfigApi.bulkUpdateFrontend(updates);
        if (result.errors.length) errors.push(...result.errors);
      }
      if (errors.length) {
        toast.warning(t('rbac.savePartial', { count: errors.length }));
      } else {
        toast.success(t('rbac.confirm.saved'));
      }
      await fetchAll();
    } catch {
      toast.error(t('rbac.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleReload = async () => {
    try { await rbacConfigApi.reloadCache(); toast.success(t('rbac.cacheReloaded')); await fetchAll(); }
    catch { toast.error(t('rbac.errors.reloadFailed')); }
  };

  const discardChanges = () => {
    setPendingBackendChanges(new Map());
    setPendingFrontendChanges(new Map());
    toast.info(t('rbac.changesDiscarded'));
  };

  const handleFilterApply = useCallback((filter: ActiveFilter) => {
    setActiveFilters(prev => { const next = prev.filter(f => f.id !== filter.id); next.push(filter); return next; });
  }, []);
  const handleFilterRemove = useCallback((filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  }, []);

  const PaginationControls: React.FC<{ currentPage: number; totalPages: number; totalItems: number; onPageChange: (p: number) => void }> = ({ currentPage, totalPages, totalItems, onPageChange }) => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{Math.min((currentPage - 1) * pageSize + 1, totalItems)}–{Math.min(currentPage * pageSize, totalItems)} / {totalItems}</span>
        <Select value={String(pageSize)} onValueChange={v => setPageSize(Number(v))}>
          <SelectTrigger className="h-7 w-[70px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{PAGE_SIZE_OPTIONS.map(s => <SelectItem key={s} value={String(s)} className="text-xs">{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="h-7 w-7" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="text-sm px-2">{currentPage}/{totalPages}</span>
        <Button variant="outline" size="icon" className="h-7 w-7" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}><ChevronRight className="h-4 w-4" /></Button>
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
      {/* Header */}
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
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-700 dark:text-amber-400">{t('rbac.pendingWarning', { count: pendingBackendChanges.size + pendingFrontendChanges.size })}</span>
        </div>
      )}

      <DynamicFilter filters={filterConfigs} onFilterApply={handleFilterApply} onFilterRemove={handleFilterRemove} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="backend">{t('rbac.tabs.backend')} ({filteredBackend.length})</TabsTrigger>
          <TabsTrigger value="frontend">{t('rbac.tabs.frontend')} ({filteredFrontend.length})</TabsTrigger>
        </TabsList>

        {/* Backend Matrix — rows = endpoints, columns = roles with checkboxes */}
        <TabsContent value="backend">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-lg">{t('rbac.backendMatrix')}</CardTitle></CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground min-w-[280px]">{t('rbac.columns.permission')}</th>
                        {visibleRoles.map(role => (
                          <th key={role} className="text-center p-3 min-w-[90px]">
                            <Badge variant="outline" className={`text-xs ${ROLE_COLORS[role] || ''}`}>{ROLE_LABELS[role]}</Badge>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBackend.map(perm => {
                        const effectiveRoles = getEffectiveBackendRoles(perm);
                        const isChanged = pendingBackendChanges.has(perm.id);
                        return (
                          <tr key={perm.id} className={`border-b hover:bg-muted/30 transition-colors ${isChanged ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}`}>
                            <td className="p-3">
                              <div className="font-medium text-foreground text-xs">{perm.controller}.{perm.endpoint}</div>
                              <div className="text-[10px] text-muted-foreground">{perm.method} · {perm.module} · {perm.scope}</div>
                            </td>
                            {visibleRoles.map(role => (
                              <td key={role} className="text-center p-2">
                                <Checkbox
                                  checked={effectiveRoles.includes(role)}
                                  onCheckedChange={() => toggleBackendRole(perm, role)}
                                  disabled={!canEditRbac}
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
              <PaginationControls currentPage={backendPage} totalPages={backendTotalPages} totalItems={filteredBackend.length} onPageChange={setBackendPage} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Frontend Matrix */}
        <TabsContent value="frontend">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-lg">{t('rbac.frontendMatrix')}</CardTitle></CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground min-w-[280px]">{t('rbac.columns.uiKey')}</th>
                        {visibleRoles.map(role => (
                          <th key={role} className="text-center p-3 min-w-[90px]">
                            <Badge variant="outline" className={`text-xs ${ROLE_COLORS[role] || ''}`}>{ROLE_LABELS[role]}</Badge>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedFrontend.map(perm => {
                        const effectiveRoles = getEffectiveFrontendRoles(perm);
                        const isChanged = pendingFrontendChanges.has(perm.id);
                        return (
                          <tr key={perm.id} className={`border-b hover:bg-muted/30 transition-colors ${isChanged ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}`}>
                            <td className="p-3">
                              <div className="font-medium text-foreground text-xs">{perm.permission_key}</div>
                              <div className="text-[10px] text-muted-foreground">{perm.component}{perm.sub_view ? `.${perm.sub_view}` : ''}{perm.element_type ? `.${perm.element_type}` : ''}{perm.action_name ? `.${perm.action_name}` : ''} · {perm.module}</div>
                            </td>
                            {visibleRoles.map(role => (
                              <td key={role} className="text-center p-2">
                                <Checkbox
                                  checked={effectiveRoles.includes(role)}
                                  onCheckedChange={() => toggleFrontendRole(perm, role)}
                                  disabled={!canEditRbac}
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
              <PaginationControls currentPage={frontendPage} totalPages={frontendTotalPages} totalItems={filteredFrontend.length} onPageChange={setFrontendPage} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreatePermissionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roles={visibleRoles}
        existingBackendPerms={backendPerms}
        existingFrontendPerms={frontendPerms}
        currentUserRole={currentUserRole}
        onCreateBackend={async (data) => { await rbacConfigApi.createBackendPermission(data); await fetchAll(); }}
        onCreateFrontend={async (data) => { await rbacConfigApi.createFrontendPermission(data); await fetchAll(); }}
      />
    </div>
  );
};
