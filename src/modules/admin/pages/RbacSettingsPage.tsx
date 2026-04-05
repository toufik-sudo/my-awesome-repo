import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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

export const RbacSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { role: currentUserRole, isHyperAdmin, isHyperManager, isHyper, isAdmin, rbacConfig: userRbacConfig } = usePermissions();

  const [activeTab, setActiveTab] = useState('backend');
  const [backendPerms, setBackendPerms] = useState<RbacBackendPermission[]>([]);
  const [frontendPerms, setFrontendPerms] = useState<RbacFrontendPermission[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingBackendChanges, setPendingBackendChanges] = useState<Map<string, { allowed?: boolean; scope?: RbacScope }>>(new Map());
  const [pendingFrontendChanges, setPendingFrontendChanges] = useState<Map<string, { allowed?: boolean }>>(new Map());
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filters
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  // Pagination
  const [backendPage, setBackendPage] = useState(1);
  const [frontendPage, setFrontendPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // ─── Access control ────────────────────────────────────────────────
  const canViewRbac = isHyperAdmin || isHyperManager || (isAdmin && (userRbacConfig['show_rbac_settings'] ?? false));
  const canEditRbac = isHyperAdmin || (isAdmin && (userRbacConfig['show_rbac_settings_edit'] ?? false));

  // Roles visible to the current user
  const visibleRoles = useMemo(() => {
    if (isHyperAdmin) return roles;
    if (isHyperManager) return roles.filter(r => !['hyper_admin'].includes(r));
    if (isAdmin) return roles.filter(r => ['manager', 'guest'].includes(r));
    return [];
  }, [roles, isHyperAdmin, isHyperManager, isAdmin]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [b, f, r] = await Promise.all([
        rbacConfigApi.getBackendPermissions(),
        rbacConfigApi.getFrontendPermissions(),
        rbacConfigApi.getRoles(),
      ]);
      // Filter perms based on visible roles for admin
      if (isAdmin) {
        setBackendPerms(b.filter(p => ['manager', 'guest'].includes(p.role)));
        setFrontendPerms(f.filter(p => ['manager', 'guest'].includes(p.role)));
      } else if (isHyperManager) {
        setBackendPerms(b.filter(p => p.role !== 'hyper_admin'));
        setFrontendPerms(f.filter(p => p.role !== 'hyper_admin'));
      } else {
        setBackendPerms(b);
        setFrontendPerms(f);
      }
      setRoles(r);
      setPendingBackendChanges(new Map());
      setPendingFrontendChanges(new Map());
    } catch {
      toast.error(t('rbac.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t, isAdmin, isHyperManager]);

  useEffect(() => { if (canViewRbac) fetchAll(); }, [fetchAll, canViewRbac]);

  useEffectSocket(() => {
    const token = getStoredJWT();
    if (!token) return;
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8095';
    const socket = io(socketUrl, { auth: { token }, transports: ['websocket', 'polling'] });
    socket.on('rbac:updated', () => {
      toast.info(t('rbac.realtimeUpdate'));
      fetchAll();
    });
    return () => { socket.disconnect(); };
  }, [fetchAll, t]);

  // ─── DynamicFilter configs ─────────────────────────────────────────
  const filterConfigs: FilterConfig[] = useMemo(() => {
    const roleOptions = visibleRoles.map(r => ({ label: ROLE_LABELS[r] || r, value: r }));
    const scopeOptions = SCOPE_OPTIONS.map(s => ({ label: s, value: s }));
    const resources = [...new Set(backendPerms.map(p => p.resource))].sort();
    const resourceOptions = resources.map(r => ({ label: r, value: r }));
    const actions = [...new Set(backendPerms.map(p => p.action))].sort();
    const actionOptions = actions.map(a => ({ label: a, value: a }));

    return [
      { id: 'search', name: t('rbac.filters.search'), icon: Shield, type: 'text' as const, placeholder: t('rbac.filters.searchPlaceholder') },
      { id: 'role', name: t('rbac.filters.role'), icon: Shield, type: 'multiselect' as const, options: roleOptions },
      { id: 'resource', name: t('rbac.filters.resource'), icon: Shield, type: 'multiselect' as const, options: resourceOptions },
      { id: 'action', name: t('rbac.filters.action'), icon: Shield, type: 'multiselect' as const, options: actionOptions },
      { id: 'scope', name: t('rbac.filters.scope'), icon: Shield, type: 'select' as const, options: scopeOptions },
      { id: 'status', name: t('rbac.filters.status'), icon: Shield, type: 'select' as const, options: [
        { label: t('rbac.filters.allowed'), value: 'allowed' },
        { label: t('rbac.filters.denied'), value: 'denied' },
      ]},
    ];
  }, [visibleRoles, backendPerms, t]);

  const getFilterValue = useCallback((filterId: string) => {
    return activeFilters.find(f => f.id === filterId)?.value;
  }, [activeFilters]);

  // ─── Backend permission matrix ─────────────────────────────────────
  const backendResources = useMemo(() => {
    const searchVal = getFilterValue('search') as string || '';
    const roleFilter = getFilterValue('role') as string[] || [];
    const resourceFilter = getFilterValue('resource') as string[] || [];
    const actionFilter = getFilterValue('action') as string[] || [];
    const scopeFilter = getFilterValue('scope') as string || '';
    const statusFilter = getFilterValue('status') as string || '';

    let filtered = backendPerms;
    if (roleFilter.length > 0) filtered = filtered.filter(p => roleFilter.includes(p.role));
    if (resourceFilter.length > 0) filtered = filtered.filter(p => resourceFilter.includes(p.resource));
    if (actionFilter.length > 0) filtered = filtered.filter(p => actionFilter.includes(p.action));
    if (scopeFilter) filtered = filtered.filter(p => p.scope === scopeFilter);
    if (statusFilter === 'allowed') filtered = filtered.filter(p => p.allowed);
    else if (statusFilter === 'denied') filtered = filtered.filter(p => !p.allowed);

    const map = new Map<string, RbacBackendPermission[]>();
    for (const p of filtered) {
      const key = `${p.resource}:${p.action}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }

    return Array.from(map.entries())
      .filter(([key]) => !searchVal || key.toLowerCase().includes(searchVal.toLowerCase()) ||
        filtered.some(p => `${p.resource}:${p.action}` === key && p.permission_key.toLowerCase().includes(searchVal.toLowerCase())))
      .sort(([a], [b]) => a.localeCompare(b));
  }, [backendPerms, getFilterValue]);

  // Frontend filtered
  const frontendFiltered = useMemo(() => {
    const searchVal = getFilterValue('search') as string || '';
    const roleFilter = getFilterValue('role') as string[] || [];
    const statusFilter = getFilterValue('status') as string || '';

    const uiKeys = [...new Set(frontendPerms.map(p => p.ui_key))].sort();
    let filtered = uiKeys;
    if (searchVal) filtered = filtered.filter(k => k.toLowerCase().includes(searchVal.toLowerCase()));

    return filtered.filter(uiKey => {
      const permsForKey = frontendPerms.filter(p => p.ui_key === uiKey);
      if (roleFilter.length > 0 && !permsForKey.some(p => roleFilter.includes(p.role))) return false;
      if (statusFilter === 'allowed' && !permsForKey.some(p => p.allowed)) return false;
      if (statusFilter === 'denied' && !permsForKey.some(p => !p.allowed)) return false;
      return true;
    });
  }, [frontendPerms, getFilterValue]);

  // Pagination helpers
  const backendTotalPages = Math.max(1, Math.ceil(backendResources.length / pageSize));
  const frontendTotalPages = Math.max(1, Math.ceil(frontendFiltered.length / pageSize));

  const paginatedBackend = useMemo(() => {
    const start = (backendPage - 1) * pageSize;
    return backendResources.slice(start, start + pageSize);
  }, [backendResources, backendPage, pageSize]);

  const paginatedFrontend = useMemo(() => {
    const start = (frontendPage - 1) * pageSize;
    return frontendFiltered.slice(start, start + pageSize);
  }, [frontendFiltered, frontendPage, pageSize]);

  useEffect(() => { setBackendPage(1); setFrontendPage(1); }, [activeFilters, pageSize]);

  // ─── Swal confirmation for permission changes ──────────────────────
  const confirmAndToggleBackendPerm = async (perm: RbacBackendPermission) => {
    if (!canEditRbac) return;
    const existing = pendingBackendChanges.get(perm.id) || {};
    const currentAllowed = existing.allowed !== undefined ? existing.allowed : perm.allowed;
    const newAllowed = !currentAllowed;

    const result = await Swal.fire({
      title: t('rbac.confirm.title'),
      html: `
        <div style="text-align:left;font-size:14px;line-height:1.8">
          <p><strong>${t('rbac.confirm.role')}:</strong> ${ROLE_LABELS[perm.role] || perm.role}</p>
          <p><strong>${t('rbac.confirm.permission')}:</strong> ${perm.permission_key}</p>
          <p><strong>${t('rbac.confirm.resource')}:</strong> ${perm.resource} → ${perm.action}</p>
          <p><strong>${t('rbac.confirm.change')}:</strong> ${currentAllowed ? '✅ ' + t('rbac.confirm.allowed') : '❌ ' + t('rbac.confirm.denied')} → ${newAllowed ? '✅ ' + t('rbac.confirm.allowed') : '❌ ' + t('rbac.confirm.denied')}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(var(--primary))',
      cancelButtonColor: 'hsl(var(--destructive))',
      confirmButtonText: t('rbac.confirm.apply'),
      cancelButtonText: t('rbac.confirm.cancel'),
    });

    if (result.isConfirmed) {
      setPendingBackendChanges(prev => {
        const next = new Map(prev);
        next.set(perm.id, { ...existing, allowed: newAllowed });
        return next;
      });
    }
  };

  const confirmAndUpdateBackendScope = async (perm: RbacBackendPermission, newScope: RbacScope) => {
    if (!canEditRbac) return;
    const result = await Swal.fire({
      title: t('rbac.confirm.scopeTitle'),
      html: `
        <div style="text-align:left;font-size:14px;line-height:1.8">
          <p><strong>${t('rbac.confirm.role')}:</strong> ${ROLE_LABELS[perm.role] || perm.role}</p>
          <p><strong>${t('rbac.confirm.permission')}:</strong> ${perm.permission_key}</p>
          <p><strong>${t('rbac.confirm.scopeChange')}:</strong> ${perm.scope} → ${newScope}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(var(--primary))',
      cancelButtonColor: 'hsl(var(--destructive))',
      confirmButtonText: t('rbac.confirm.apply'),
      cancelButtonText: t('rbac.confirm.cancel'),
    });

    if (result.isConfirmed) {
      const existing = pendingBackendChanges.get(perm.id) || {};
      setPendingBackendChanges(prev => {
        const next = new Map(prev);
        next.set(perm.id, { ...existing, scope: newScope });
        return next;
      });
    }
  };

  const confirmAndToggleFrontendPerm = async (perm: RbacFrontendPermission) => {
    if (!canEditRbac) return;
    const existing = pendingFrontendChanges.get(perm.id) || {};
    const currentAllowed = existing.allowed !== undefined ? existing.allowed : perm.allowed;
    const newAllowed = !currentAllowed;

    const result = await Swal.fire({
      title: t('rbac.confirm.title'),
      html: `
        <div style="text-align:left;font-size:14px;line-height:1.8">
          <p><strong>${t('rbac.confirm.role')}:</strong> ${ROLE_LABELS[perm.role] || perm.role}</p>
          <p><strong>${t('rbac.confirm.uiKey')}:</strong> ${perm.ui_key}</p>
          <p><strong>${t('rbac.confirm.change')}:</strong> ${currentAllowed ? '✅ ' + t('rbac.confirm.allowed') : '❌ ' + t('rbac.confirm.denied')} → ${newAllowed ? '✅ ' + t('rbac.confirm.allowed') : '❌ ' + t('rbac.confirm.denied')}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(var(--primary))',
      cancelButtonColor: 'hsl(var(--destructive))',
      confirmButtonText: t('rbac.confirm.apply'),
      cancelButtonText: t('rbac.confirm.cancel'),
    });

    if (result.isConfirmed) {
      setPendingFrontendChanges(prev => {
        const next = new Map(prev);
        next.set(perm.id, { allowed: newAllowed });
        return next;
      });
    }
  };

  const getEffectiveAllowed = (perm: RbacBackendPermission): boolean => {
    const change = pendingBackendChanges.get(perm.id);
    return change?.allowed !== undefined ? change.allowed : perm.allowed;
  };

  const getEffectiveScope = (perm: RbacBackendPermission): RbacScope => {
    const change = pendingBackendChanges.get(perm.id);
    return change?.scope || perm.scope;
  };

  const getEffectiveFrontendAllowed = (perm: RbacFrontendPermission): boolean => {
    const change = pendingFrontendChanges.get(perm.id);
    return change?.allowed !== undefined ? change.allowed : perm.allowed;
  };

  const hasChanges = pendingBackendChanges.size > 0 || pendingFrontendChanges.size > 0;

  const saveChanges = async () => {
    if (!canEditRbac) return;
    const confirmResult = await Swal.fire({
      title: t('rbac.confirm.saveTitle'),
      html: `<p>${t('rbac.confirm.saveDescription', { count: pendingBackendChanges.size + pendingFrontendChanges.size })}</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(var(--primary))',
      cancelButtonColor: 'hsl(var(--destructive))',
      confirmButtonText: t('rbac.confirm.saveConfirm'),
      cancelButtonText: t('rbac.confirm.cancel'),
    });

    if (!confirmResult.isConfirmed) return;

    setSaving(true);
    try {
      const errors: string[] = [];

      if (pendingBackendChanges.size > 0) {
        const updates = Array.from(pendingBackendChanges.entries()).map(([id, changes]) => {
          const perm = backendPerms.find(p => p.id === id)!;
          return { role: perm.role, permission_key: perm.permission_key, allowed: changes.allowed ?? perm.allowed, scope: changes.scope };
        });
        const result = await rbacConfigApi.bulkUpdateBackend(updates);
        if (result.errors.length) errors.push(...result.errors);
      }

      if (pendingFrontendChanges.size > 0) {
        const updates = Array.from(pendingFrontendChanges.entries()).map(([id, changes]) => {
          const perm = frontendPerms.find(p => p.id === id)!;
          return { role: perm.role, permission_key: perm.permission_key, allowed: changes.allowed ?? perm.allowed };
        });
        const result = await rbacConfigApi.bulkUpdateFrontend(updates);
        if (result.errors.length) errors.push(...result.errors);
      }

      if (errors.length) {
        toast.warning(t('rbac.savePartial', { count: errors.length }), { description: errors.join(', ') });
      } else {
        Swal.fire({
          title: t('rbac.confirm.saved'),
          text: t('rbac.confirm.savedDescription'),
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      await fetchAll();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('rbac.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleReload = async () => {
    try {
      await rbacConfigApi.reloadCache();
      toast.success(t('rbac.cacheReloaded'));
      await fetchAll();
    } catch {
      toast.error(t('rbac.errors.reloadFailed'));
    }
  };

  const discardChanges = () => {
    setPendingBackendChanges(new Map());
    setPendingFrontendChanges(new Map());
    toast.info(t('rbac.changesDiscarded'));
  };

  const handleFilterApply = useCallback((filter: ActiveFilter) => {
    setActiveFilters(prev => {
      const next = prev.filter(f => f.id !== filter.id);
      next.push(filter);
      return next;
    });
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  }, []);

  // ─── Pagination Component ──────────────────────────────────────────
  const PaginationControls: React.FC<{ currentPage: number; totalPages: number; totalItems: number; onPageChange: (p: number) => void }> = ({ currentPage, totalPages, totalItems, onPageChange }) => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{t('rbac.pagination.showing')} {Math.min((currentPage - 1) * pageSize + 1, totalItems)}–{Math.min(currentPage * pageSize, totalItems)} {t('rbac.pagination.of')} {totalItems}</span>
        <Select value={String(pageSize)} onValueChange={v => setPageSize(Number(v))}>
          <SelectTrigger className="h-7 w-[70px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map(s => (
              <SelectItem key={s} value={String(s)} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs">/ {t('rbac.pagination.page')}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="h-7 w-7" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let page: number;
          if (totalPages <= 5) page = i + 1;
          else if (currentPage <= 3) page = i + 1;
          else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
          else page = currentPage - 2 + i;
          return (
            <Button key={page} variant={page === currentPage ? 'default' : 'outline'} size="icon" className="h-7 w-7 text-xs" onClick={() => onPageChange(page)}>
              {page}
            </Button>
          );
        })}
        <Button variant="outline" size="icon" className="h-7 w-7" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // ─── Access denied ─────────────────────────────────────────────────
  if (!canViewRbac) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">{t('rbac.accessDenied', 'Access Denied')}</h2>
        <p className="text-sm text-muted-foreground">{t('rbac.accessDeniedDesc', 'You do not have permission to view RBAC settings.')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('rbac.title')}</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? t('rbac.subtitleAdmin', 'Manage permissions for your managers and guests.')
                : t('rbac.subtitle')
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEditRbac && (
            <Button size="sm" variant="default" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-1" /> {t('rbac.create.btn')}
            </Button>
          )}
          {!canEditRbac && (
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" /> {t('rbac.readOnly')}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={handleReload}>
            <RefreshCw className="h-4 w-4 mr-1" /> {t('rbac.reload')}
          </Button>
          {hasChanges && canEditRbac && (
            <>
              <Button variant="ghost" size="sm" onClick={discardChanges}>
                <X className="h-4 w-4 mr-1" /> {t('rbac.discard')}
              </Button>
              <Button size="sm" onClick={saveChanges} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                {t('rbac.save')} ({pendingBackendChanges.size + pendingFrontendChanges.size})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Warning banner */}
      {hasChanges && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-700 dark:text-amber-400">
            {t('rbac.pendingWarning', { count: pendingBackendChanges.size + pendingFrontendChanges.size })}
          </span>
        </div>
      )}

      {/* DynamicFilter */}
      <DynamicFilter
        filters={filterConfigs}
        onFilterApply={handleFilterApply}
        onFilterRemove={handleFilterRemove}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="backend">{t('rbac.tabs.backend')} ({backendResources.length})</TabsTrigger>
          <TabsTrigger value="frontend">{t('rbac.tabs.frontend')} ({frontendFiltered.length})</TabsTrigger>
        </TabsList>

        {/* ─── Backend Matrix ─────────────────────────────────────── */}
        <TabsContent value="backend">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('rbac.backendMatrix')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground min-w-[200px]">{t('rbac.columns.permission')}</th>
                        {visibleRoles.map(role => (
                          <th key={role} className="text-center p-3 min-w-[120px]">
                            <Badge variant="outline" className={`text-xs ${ROLE_COLORS[role] || ''}`}>
                              {ROLE_LABELS[role] || role}
                            </Badge>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBackend.map(([key, perms]) => (
                        <tr key={key} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="font-medium text-foreground">{key.replace(':', ' → ')}</div>
                            <div className="text-xs text-muted-foreground">{perms[0]?.permission_key}</div>
                          </td>
                          {visibleRoles.map(role => {
                            const perm = perms.find(p => p.role === role);
                            if (!perm) {
                              return <td key={role} className="text-center p-3 text-muted-foreground">—</td>;
                            }
                            const allowed = getEffectiveAllowed(perm);
                            const scope = getEffectiveScope(perm);
                            const isChanged = pendingBackendChanges.has(perm.id);
                            return (
                              <td key={role} className={`text-center p-2 ${isChanged ? 'bg-amber-50 dark:bg-amber-950/20' : ''}`}>
                                <div className="flex flex-col items-center gap-1">
                                  <Switch
                                    checked={allowed}
                                    onCheckedChange={() => confirmAndToggleBackendPerm(perm)}
                                    className="scale-75"
                                    disabled={!canEditRbac}
                                  />
                                  <Select value={scope} onValueChange={(v) => confirmAndUpdateBackendScope(perm, v as RbacScope)} disabled={!canEditRbac}>
                                    <SelectTrigger className="h-6 text-[10px] w-[80px] px-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {SCOPE_OPTIONS.map(s => (
                                        <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
              <PaginationControls currentPage={backendPage} totalPages={backendTotalPages} totalItems={backendResources.length} onPageChange={setBackendPage} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Frontend Matrix ────────────────────────────────────── */}
        <TabsContent value="frontend">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('rbac.frontendMatrix')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground min-w-[250px]">{t('rbac.columns.uiKey')}</th>
                        {visibleRoles.map(role => (
                          <th key={role} className="text-center p-3 min-w-[100px]">
                            <Badge variant="outline" className={`text-xs ${ROLE_COLORS[role] || ''}`}>
                              {ROLE_LABELS[role] || role}
                            </Badge>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedFrontend.map(uiKey => (
                        <tr key={uiKey} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="font-medium text-foreground">{uiKey}</div>
                          </td>
                          {visibleRoles.map(role => {
                            const perm = frontendPerms.find(p => p.role === role && p.ui_key === uiKey);
                            if (!perm) {
                              return <td key={role} className="text-center p-3 text-muted-foreground">—</td>;
                            }
                            const allowed = getEffectiveFrontendAllowed(perm);
                            const isChanged = pendingFrontendChanges.has(perm.id);
                            return (
                              <td key={role} className={`text-center p-3 ${isChanged ? 'bg-amber-50 dark:bg-amber-950/20' : ''}`}>
                                <div className="flex justify-center">
                                  <Switch
                                    checked={allowed}
                                    onCheckedChange={() => confirmAndToggleFrontendPerm(perm)}
                                    className="scale-75"
                                    disabled={!canEditRbac}
                                  />
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
              <PaginationControls currentPage={frontendPage} totalPages={frontendTotalPages} totalItems={frontendFiltered.length} onPageChange={setFrontendPage} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Permission Modal */}
      <CreatePermissionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roles={roles}
        existingBackendPerms={backendPerms}
        existingFrontendPerms={frontendPerms}
        currentUserRole={currentUserRole}
        onCreateBackend={async (data) => {
          await rbacConfigApi.createBackendPermission(data);
          await fetchAll();
        }}
        onCreateFrontend={async (data) => {
          await rbacConfigApi.createFrontendPermission(data);
          await fetchAll();
        }}
      />
    </div>
  );
};
