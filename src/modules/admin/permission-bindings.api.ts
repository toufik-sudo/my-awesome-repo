import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';
import type { Paginated, PaginationParams } from '@/modules/shared/types/pagination';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PermissionBinding {
  id: string;
  backendPermissionId: string;
  backendPermissionKey: string;
  backendUserRoles: string[];
  frontendPermissionApi: string;
  endpoint_url: string | null;
  module: string;
  created_at: string;
}

export interface BindingMapEntry {
  backendKey: string;
  roles: string[];
}

export interface BindingMap {
  [frontendApi: string]: BindingMapEntry[];
}

// ─── API Calls ────────────────────────────────────────────────────────────────

const BASE = '/rbac-config/bindings';

export const permissionBindingsApi = {
  getAll: (module?: string) =>
    api.get<PermissionBinding[]>(BASE, module ? { ...rbac('permissionBindingsApi.getAll.GET'), params: { module } } : rbac('permissionBindingsApi.getAll.GET')).then(r => r.data),

  getAllPaginated: (params: PaginationParams & { module?: string } = {}) =>
    api.get<Paginated<PermissionBinding>>(BASE, {
      ...rbac('permissionBindingsApi.getAll.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20, module: params.module },
    }).then(r => r.data),

  getBindingMap: () =>
    api.get<BindingMap>(`${BASE}/map`, rbac('permissionBindingsApi.getBindingMap.GET')).then(r => r.data),

  getByFrontendApi: (key: string) =>
    api.get<PermissionBinding[]>(`${BASE}/frontend-api/${encodeURIComponent(key)}`, rbac('permissionBindingsApi.getByFrontendApi.GET')).then(r => r.data),

  getByBackendKey: (key: string) =>
    api.get<PermissionBinding[]>(`${BASE}/backend/${encodeURIComponent(key)}`, rbac('permissionBindingsApi.getByBackendKey.GET')).then(r => r.data),

  create: (data: { backendPermissionId: string; frontendPermissionApi: string; endpoint_url?: string; module?: string }) =>
    api.post<PermissionBinding>(BASE, data, rbac('permissionBindingsApi.create.POST')).then(r => r.data),

  createByKeys: (data: { backendPermissionKey: string; frontendPermissionApi: string; endpoint_url?: string; module?: string }) =>
    api.post<PermissionBinding>(`${BASE}/by-keys`, data, rbac('permissionBindingsApi.createByKeys.POST')).then(r => r.data),

  bulkCreate: (bindings: Array<{ backendPermissionKey: string; frontendPermissionApi: string; endpoint_url?: string; module?: string }>) =>
    api.post<{ created: number; errors: string[] }>(`${BASE}/bulk`, { bindings }, rbac('permissionBindingsApi.bulkCreate.POST')).then(r => r.data),

  update: (id: string, data: { module?: string; endpoint_url?: string | null }) =>
    api.put<PermissionBinding>(`${BASE}/${id}`, data, rbac('permissionBindingsApi.update.PUT')).then(r => r.data),

  remove: (id: string) =>
    api.delete(`${BASE}/${id}`, rbac('permissionBindingsApi.remove.DELETE')).then(r => r.data),
};
