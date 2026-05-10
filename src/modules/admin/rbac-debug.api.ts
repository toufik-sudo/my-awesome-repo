import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TraceResourceKind = 'property' | 'service';

export interface PermissionTraceStep {
  step: number;
  label: string;
  detail: string;
  data?: Record<string, any>;
}

export type PermissionBranchKind =
  | 'explicit-properties'
  | 'explicit-services'
  | 'explicit-property-groups'
  | 'explicit-service-groups'
  | 'explicit-admins'
  | 'fallback-inherit-inviter'
  | 'all-platform-wide'
  | 'no-match';

export interface PermissionBranchEvaluation {
  scope: string;
  permissionKey: string;
  assignedById: number | null;
  branch: PermissionBranchKind;
  reason: string;
  contributesIds: string[];
  inviterIds?: number[];
}

export interface PermissionTraceResult {
  userId: number;
  role: string;
  permissionKey: string;
  resourceKind: TraceResourceKind;
  resourceId: string | null;
  effectiveIds: string[] | null;
  allowed: boolean;
  fellBackToInviter: boolean;
  steps: PermissionTraceStep[];
  branches: PermissionBranchEvaluation[];
  summary: string;
}

export interface ScopeFallbackEvent {
  id: string;
  source: string;
  role?: string;
  userId?: number;
  permissionKey?: string;
  scope?: string;
  inviterIds: number[];
  resolvedCount: number;
  resourceKind: 'property' | 'service';
  reason: string;
  timestamp: string;
}

export interface ScopeFallbackEventList {
  total: number;
  events: ScopeFallbackEvent[];
}

// ─── API ──────────────────────────────────────────────────────────────────────

const BASE = '/rbac-debug';

export const rbacDebugApi = {
  trace: (params: {
    userId?: number;
    permissionKey: string;
    resourceKind: TraceResourceKind;
    resourceId?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params.userId != null) qs.set('userId', String(params.userId));
    qs.set('permissionKey', params.permissionKey);
    qs.set('resourceKind', params.resourceKind);
    if (params.resourceId) qs.set('resourceId', params.resourceId);
    return api
      .get<PermissionTraceResult>(`${BASE}/trace?${qs.toString()}`, rbac('rbacDebugApi.trace.GET'))
      .then(r => r.data);
  },

  listFallbacks: (filters: {
    userId?: number;
    role?: string;
    permissionKey?: string;
    resourceKind?: 'property' | 'service';
    limit?: number;
  } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null && v !== '') qs.set(k, String(v));
    });
    const tail = qs.toString() ? `?${qs.toString()}` : '';
    return api
      .get<ScopeFallbackEventList>(`${BASE}/scope-fallbacks${tail}`, rbac('rbacDebugApi.listFallbacks.GET'))
      .then(r => r.data);
  },

  clearFallbacks: () =>
    api
      .delete<{ success: boolean; cleared: number }>(`${BASE}/scope-fallbacks`, rbac('rbacDebugApi.clearFallbacks.DELETE'))
      .then(r => r.data),
};
