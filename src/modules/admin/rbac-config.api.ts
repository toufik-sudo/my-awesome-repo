import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RbacScope = 'global' | 'admin' | 'assigned' | 'own' | 'inherited';

export interface RbacBackendPermission {
  id: string;
  created_by: string | null;
  permission_key: string;
  user_roles: string[];
  controller: string;
  endpoint: string;
  method: string;
   endpoint_url: string | null;
  module: string;
  description: string | null;
  scope: RbacScope;
  allowed: boolean;
  conditions: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface RbacFrontendPermission {
  id: string;
  created_by: string | null;
  permission_key: string;
  user_roles: string[];
  component: string;
  sub_view: string | null;
  element_type: string | null;
  action_name: string | null;
  module: string;
  description: string | null;
  allowed: boolean;
  conditions: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface BulkUpdateResult {
  updated: number;
  errors: string[];
}

export interface BackendCatalogEndpoint {
  endpoint: string;
  method: string;
  endpoint_url: string | null;
  permission_key: string;
  module: string;
  description: string | null;
  /** True when this endpoint is also present in rbac_backend_permissions */
  inDb?: boolean;
}

export interface BackendCatalogController {
  controller: string;
  endpoints: BackendCatalogEndpoint[];
}

export interface BackendCatalogDiffEntry {
  permission_key: string;
  controller: string;
  endpoint: string;
  method: string;
  endpoint_url: string | null;
  module: string;
}

export interface BackendCatalogDiff {
  missing: BackendCatalogDiffEntry[];
  orphan: BackendCatalogDiffEntry[];
  matchedCount: number;
  liveCount: number;
  dbCount: number;
}

export interface FrontendApiCatalogEntry {
  frontendApiKey: string;
  module: string;
  source: string | null;
  /** Inferred from the enclosing `api.<verb>('<url>', ...)` call site. */
  endpoint_url: string | null;
  /** Inferred HTTP verb (uppercase) — from the api call or the key suffix. */
  method: string | null;
}

export interface FrontendCatalogMeta {
  generatedAt: string | null;
  count: number;
  generator: string | null;
  fileMtime: string | null;
}

export interface FrontendCatalogDiff {
  missing: FrontendApiCatalogEntry[];
  orphan: Array<{ frontendApiKey: string }>;
  matchedCount: number;
  liveCount: number;
  dbCount: number;
  meta?: FrontendCatalogMeta;
}

export interface RefreshCatalogsResult {
  success: boolean;
  routesRescanned: number;
  frontendRegenerated: boolean;
  frontendOutput: string;
}

export interface BindingsDiffEntryBackend {
  permission_key: string;
  controller: string;
  endpoint: string;
  method: string;
  endpoint_url: string | null;
  module: string;
}

export interface BindingsDiffEntryBinding {
  id: string;
  backendPermissionId: string;
  frontendPermissionApi: string;
  endpoint_url: string | null;
  module: string;
}

export interface BindingsDiff {
  backendWithoutBinding: BindingsDiffEntryBackend[];
  bindingWithoutBackend: BindingsDiffEntryBinding[];
  bindingWithoutFrontend: BindingsDiffEntryBinding[];
  frontendWithoutBinding: string[];
  liveBackendMissingInDb: BindingsDiffEntryBackend[];
  liveBackendMissingInBindings: BindingsDiffEntryBackend[];
  counts: { backendTotal: number; bindingsTotal: number; frontendRuntime: number; liveRoutes: number };
}

// ─── API Calls ────────────────────────────────────────────────────────────────

const BASE = '/rbac-config';

export const rbacConfigApi = {
  getRoles: () =>
    api.get<string[]>(`${BASE}/roles`, rbac('rbacConfigApi.getRoles.GET')).then(r => r.data),

  getBackendPermissions: () =>
    api.get<RbacBackendPermission[]>(`${BASE}/backend`, rbac('rbacConfigApi.getBackendPermissions.GET')).then(r => r.data),

  getBackendPermissionsPaginated: (params: { page: number; pageSize?: number; module?: string; search?: string }) =>
    api.get<{ data: RbacBackendPermission[]; total: number; page: number; pageSize: number }>(
      `${BASE}/backend`,
      { ...rbac('rbacConfigApi.getBackendPermissions.GET'), params },
    ).then(r => r.data),

  getBackendPermissionModules: () =>
    api.get<string[]>(`${BASE}/backend`, { ...rbac('rbacConfigApi.getBackendPermissions.GET'), params: { modulesOnly: 'true' } }).then(r => r.data),

  getBackendByRole: (role: string) =>
    api.get<Record<string, { allowed: boolean; scope: RbacScope }>>(`${BASE}/backend/role/${role}`, rbac('rbacConfigApi.getBackendByRole.GET')).then(r => r.data),

  getBackendCatalog: () =>
    api.get<BackendCatalogController[]>(`${BASE}/backend/catalog`, rbac('rbacConfigApi.getBackendCatalog.GET')).then(r => r.data),

  getBackendCatalogDiff: () =>
    api.get<BackendCatalogDiff>(`${BASE}/backend/catalog/diff`, rbac('rbacConfigApi.getBackendCatalogDiff.GET')).then(r => r.data),

  getFrontendCatalogDiff: (runtimeCatalog?: FrontendApiCatalogEntry[]) =>
    api.post<FrontendCatalogDiff>(
      `${BASE}/frontend/catalog/diff`,
      { runtimeCatalog: runtimeCatalog || [] },
      rbac('rbacConfigApi.getFrontendCatalogDiff.POST'),
    ).then(r => r.data),

  updateBackendPermission: (id: string, data: { allowed?: boolean; scope?: string; user_roles?: string[]; conditions?: Record<string, any> }) =>
    api.put<RbacBackendPermission>(`${BASE}/backend/${id}`, data, rbac('rbacConfigApi.updateBackendPermission.PUT')).then(r => r.data),

  bulkUpdateBackend: (updates: Array<{ permission_key: string; allowed?: boolean; scope?: RbacScope; user_roles?: string[] }>) =>
    api.put<BulkUpdateResult>(`${BASE}/backend`, { updates }, rbac('rbacConfigApi.bulkUpdateBackend.PUT')).then(r => r.data),

  createBackendPermission: (data: {
    controller: string;
    endpoint: string;
    method: string;
    endpoint_url?: string;
    user_roles: string[];
    scope?: RbacScope;
    allowed?: boolean;
    module?: string;
    description?: string;
    conditions?: Record<string, any>;
  }) =>
    api.post<RbacBackendPermission>(`${BASE}/backend`, data, rbac('rbacConfigApi.createBackendPermission.POST')).then(r => r.data),

  getFrontendPermissions: () =>
    api.get<RbacFrontendPermission[]>(`${BASE}/frontend`, rbac('rbacConfigApi.getFrontendPermissions.GET')).then(r => r.data),

  getFrontendPermissionsPaginated: (params: { page: number; pageSize?: number; module?: string; search?: string }) =>
    api.get<{ data: RbacFrontendPermission[]; total: number; page: number; pageSize: number }>(
      `${BASE}/frontend`,
      { ...rbac('rbacConfigApi.getFrontendPermissions.GET'), params },
    ).then(r => r.data),

  getFrontendPermissionModules: () =>
    api.get<string[]>(`${BASE}/frontend`, { ...rbac('rbacConfigApi.getFrontendPermissions.GET'), params: { modulesOnly: 'true' } }).then(r => r.data),

  getFrontendByRole: (role: string) =>
    api.get<Record<string, boolean>>(`${BASE}/frontend/role/${role}`, rbac('rbacConfigApi.getFrontendByRole.GET')).then(r => r.data),

  updateFrontendPermission: (id: string, data: { allowed?: boolean; user_roles?: string[]; conditions?: Record<string, any> }) =>
    api.put<RbacFrontendPermission>(`${BASE}/frontend/${id}`, data, rbac('rbacConfigApi.updateFrontendPermission.PUT')).then(r => r.data),

  bulkUpdateFrontend: (updates: Array<{ permission_key: string; allowed?: boolean; user_roles?: string[] }>) =>
    api.put<BulkUpdateResult>(`${BASE}/frontend`, { updates }, rbac('rbacConfigApi.bulkUpdateFrontend.PUT')).then(r => r.data),

  createFrontendPermission: (data: {
    component: string;
    sub_view?: string;
    element_type?: string;
    action_name?: string;
    user_roles: string[];
    allowed?: boolean;
    module?: string;
    description?: string;
    conditions?: Record<string, any>;
  }) =>
    api.post<RbacFrontendPermission>(`${BASE}/frontend`, data, rbac('rbacConfigApi.createFrontendPermission.POST')).then(r => r.data),

  reloadCache: () =>
    api.post<{ success: boolean; message: string }>(`${BASE}/reload`, {}, rbac('rbacConfigApi.reloadCache.POST')).then(r => r.data),

  refreshCatalogs: () =>
    api.post<RefreshCatalogsResult>(`${BASE}/catalog/refresh`, {}, rbac('rbacConfigApi.refreshCatalogs.POST')).then(r => r.data),

  getBindingsDiff: (runtimeFrontendKeys?: string[]) =>
    api.post<BindingsDiff>(
      `${BASE}/bindings/diff`,
      { runtimeFrontendKeys: runtimeFrontendKeys || [] },
      rbac('rbacConfigApi.getBindingsDiff.POST'),
    ).then(r => r.data),

  getStatus: () =>
    api.get<{ loaded: boolean }>(`${BASE}/status`, rbac('rbacConfigApi.getStatus.GET')).then(r => r.data),

  checkPermission: (role: string, permission: string) =>
    api.get<{ role: string; permission: string; allowed: boolean }>(
      `${BASE}/check?role=${role}&permission=${permission}`,
      rbac('rbacConfigApi.checkPermission.GET'),
    ).then(r => r.data),
};
