import { api } from '@/lib/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RbacScope = 'global' | 'admin' | 'assigned' | 'own' | 'inherited';

export interface RbacBackendPermission {
  id: string;
  role: string;
  resource: string;
  action: string;
  permission_key: string;
  scope: RbacScope;
  allowed: boolean;
  conditions: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface RbacFrontendPermission {
  id: string;
  role: string;
  ui_key: string;
  permission_key: string;
  allowed: boolean;
  conditions: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface BulkUpdateResult {
  updated: number;
  errors: string[];
}

export interface RbacBinding {
  id: string;
  apiPermissionKey: string;
  uiPermissionKey: string;
  module: string;
  created_at: string;
}

// ─── API Calls ────────────────────────────────────────────────────────────────

const BASE = '/rbac-config';

export const rbacConfigApi = {
  // Roles
  getRoles: () =>
    api.get<string[]>(`${BASE}/roles`).then(r => r.data),

  // Backend permissions
  getBackendPermissions: () =>
    api.get<RbacBackendPermission[]>(`${BASE}/backend`).then(r => r.data),

  getBackendByRole: (role: string) =>
    api.get<Record<string, { allowed: boolean; scope: RbacScope }>>(`${BASE}/backend/role/${role}`).then(r => r.data),

  updateBackendPermission: (id: string, data: { allowed?: boolean; scope?: string; conditions?: Record<string, any> }) =>
    api.put<RbacBackendPermission>(`${BASE}/backend/${id}`, data).then(r => r.data),

  bulkUpdateBackend: (updates: Array<{ role: string; permission_key: string; allowed: boolean; scope?: RbacScope }>) =>
    api.put<BulkUpdateResult>(`${BASE}/backend`, { updates }).then(r => r.data),

  createBackendPermission: (data: { role: string; resource: string; action: string; permission_key: string; scope?: RbacScope; allowed?: boolean; conditions?: Record<string, any> }) =>
    api.post<RbacBackendPermission>(`${BASE}/backend`, data).then(r => r.data),

  // Frontend permissions
  getFrontendPermissions: () =>
    api.get<RbacFrontendPermission[]>(`${BASE}/frontend`).then(r => r.data),

  getFrontendByRole: (role: string) =>
    api.get<Record<string, boolean>>(`${BASE}/frontend/role/${role}`).then(r => r.data),

  updateFrontendPermission: (id: string, data: { allowed?: boolean; conditions?: Record<string, any> }) =>
    api.put<RbacFrontendPermission>(`${BASE}/frontend/${id}`, data).then(r => r.data),

  bulkUpdateFrontend: (updates: Array<{ role: string; permission_key: string; allowed: boolean }>) =>
    api.put<BulkUpdateResult>(`${BASE}/frontend`, { updates }).then(r => r.data),

  createFrontendPermission: (data: { role: string; ui_key: string; permission_key: string; allowed?: boolean; conditions?: Record<string, any> }) =>
    api.post<RbacFrontendPermission>(`${BASE}/frontend`, data).then(r => r.data),

  // Cache
  reloadCache: () =>
    api.post<{ success: boolean; message: string }>(`${BASE}/reload`, {}).then(r => r.data),

  getStatus: () =>
    api.get<{ loaded: boolean }>(`${BASE}/status`).then(r => r.data),

  // Debug
  checkPermission: (role: string, permission: string) =>
    api.get<{ role: string; permission: string; allowed: boolean }>(
      `${BASE}/check?role=${role}&permission=${permission}`,
    ).then(r => r.data),
};
