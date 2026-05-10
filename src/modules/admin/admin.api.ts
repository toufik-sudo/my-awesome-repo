import { api } from '@/lib/axios';
import { rbac, rbacMerge } from '@/lib/api-rbac';
import type {
  AppRole, UserRole, PropertyGroup, ManagerAssignment,
  ManagerPermission, PermissionType, AssignmentScope, UserWithRoles,
  Invitation, CreateInvitationRequest, ConvertGuestToUserRequest, ConvertGuestToUserResponse,
} from './admin.types';
import type {
  VerificationDocument,
  DocumentValidationResponse,
  TrustRecalculationResponse,
} from '@/types/verification.types';
import type { Paginated, PaginationParams } from '@/modules/shared/types/pagination';

const ROLES_BASE = '/roles';
const GROUPS_BASE = '/property-groups';
const DOCUMENTS_BASE = '/documents';
const PROPERTIES_BASE = '/properties';

// ─── Roles ──────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> { data: T[]; total: number; page: number; pageSize: number; }
export interface UsersQueryParams { page?: number; pageSize?: number; search?: string; role?: AppRole; }
export interface AssignmentsQueryParams { page?: number; pageSize?: number; type?: 'manager' | 'hyper_manager' | 'guest'; }

export const rolesApi = {
  getUserRoles: (userId: number) =>
    api.get<AppRole[]>(`${ROLES_BASE}/user/${userId}`, rbac('rolesApi.getUserRoles.GET')).then(r => r.data),

  assignRole: (userId: number, role: AppRole) =>
    api.post<UserRole>(`${ROLES_BASE}/assign`, { userId, role }, rbac('rolesApi.assignRole.POST')).then(r => r.data),

  removeRole: (userId: number, role: AppRole) =>
    api.delete(`${ROLES_BASE}/user/${userId}/${role}`, rbac('rolesApi.removeRole.DELETE')),

  getAllUsers: () =>
    api.get<UserWithRoles[]>(`${ROLES_BASE}/users`, rbac('rolesApi.getAllUsers.GET')).then(r => r.data),

  getAllUsersPaginated: (params: UsersQueryParams) =>
    api.get<PaginatedResponse<UserWithRoles>>(
      `${ROLES_BASE}/users`,
      { ...rbac('rolesApi.getAllUsers.GET'), params },
    ).then(r => r.data),
};

// ─── All Assignments (3 tables) ─────────────────────────────────────────────

export interface AllAssignmentsResponse {
  managerPermissions: any[];
  hyperManagerPermissions: any[];
  guestPermissions: any[];
  totals?: { managerPermissions: number; hyperManagerPermissions: number; guestPermissions: number };
  page?: number;
  pageSize?: number;
}

// ── In-flight dedup + short TTL cache for assignments.getAll ──
// Multiple components call usePermissions()/getAll() on mount; without
// dedup this triggers a burst of identical requests and the server returns 429.
const ASSIGNMENTS_TTL_MS = 30_000;
const assignmentsCache = new Map<string, { ts: number; data: AllAssignmentsResponse }>();
const assignmentsInflight = new Map<string, Promise<AllAssignmentsResponse>>();
const assignmentsCacheKey = (params?: AssignmentsQueryParams) => JSON.stringify(params ?? {});
const invalidateAssignmentsCache = () => {
  assignmentsCache.clear();
  assignmentsInflight.clear();
};

export const assignmentsApi = {
  getAll: (params?: AssignmentsQueryParams, opts?: { force?: boolean }): Promise<AllAssignmentsResponse> => {
    const key = assignmentsCacheKey(params);
    if (!opts?.force) {
      const cached = assignmentsCache.get(key);
      if (cached && Date.now() - cached.ts < ASSIGNMENTS_TTL_MS) {
        return Promise.resolve(cached.data);
      }
      const inflight = assignmentsInflight.get(key);
      if (inflight) return inflight;
    }
    const p = api.get<AllAssignmentsResponse>(
      `${ROLES_BASE}/assignments`,
      { ...rbac('assignmentsApi.getAll.GET'), params },
    ).then(r => {
      assignmentsCache.set(key, { ts: Date.now(), data: r.data });
      assignmentsInflight.delete(key);
      return r.data;
    }).catch(err => {
      assignmentsInflight.delete(key);
      throw err;
    });
    assignmentsInflight.set(key, p);
    return p;
  },

  invalidateCache: invalidateAssignmentsCache,

  remove: (permissionId: string, type: 'manager' | 'hyper_manager' | 'guest') => {
    invalidateAssignmentsCache();
    return api.delete(`${ROLES_BASE}/assignments/${permissionId}/${type}`, rbac('assignmentsApi.remove.DELETE'));
  },

  getManagerPermissions: (managerId: number) =>
    api.get(`${ROLES_BASE}/manager/${managerId}/permissions`, rbac('assignmentsApi.getPermissions.GET')).then(r => r.data),

  setManagerPermissions: (managerId: number, permissions: {
    backendPermissionKey: string;
    frontendPermissionKey?: string;
    scope: string;
    isGranted: boolean;
    properties?: string[];
    services?: string[];
    propertyGroups?: string[];
    serviceGroups?: string[];
  }[]) =>
    api.post(`${ROLES_BASE}/manager/permissions`, { managerId, permissions }, rbac('assignmentsApi.setPermissions.POST'))
      .then(r => { invalidateAssignmentsCache(); return r.data; }),

  getHyperManagerPermissions: (hyperManagerId: number) =>
    api.get(`${ROLES_BASE}/hyper-manager/${hyperManagerId}/permissions`, rbac('assignmentsApi.getPermissions.GET')).then(r => r.data),

  setHyperManagerPermissions: (hyperManagerId: number, permissions: {
    backendPermissionKey: string;
    frontendPermissionKey?: string;
    scope: string;
    isGranted: boolean;
    properties?: string[];
    services?: string[];
    propertyGroups?: string[];
    serviceGroups?: string[];
    admins?: number[];
  }[]) =>
    api.post(`${ROLES_BASE}/hyper-manager/permissions`, { hyperManagerId, permissions }, rbac('assignmentsApi.setPermissions.POST'))
      .then(r => { invalidateAssignmentsCache(); return r.data; }),

  getGuestPermissions: (guestId: number) =>
    api.get(`${ROLES_BASE}/guest/${guestId}/permissions`, rbac('assignmentsApi.getPermissions.GET')).then(r => r.data),

  setGuestPermissions: (guestId: number, permissions: {
    backendPermissionKey: string;
    frontendPermissionKey?: string;
    scope: string;
    isGranted: boolean;
    properties?: string[];
    services?: string[];
    propertyGroups?: string[];
    serviceGroups?: string[];
  }[]) =>
    api.post(`${ROLES_BASE}/guest/permissions`, { guestId, permissions }, rbac('assignmentsApi.setPermissions.POST'))
      .then(r => { invalidateAssignmentsCache(); return r.data; }),
};

// ─── Stats ──────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalGroups: number;
  activeManagers: number;
  totalAssignments: number;
  pendingVerifications?: number;
  totalAdmins?: number;
  totalManagers?: number;
  totalRegularUsers?: number;
  totalGuests?: number;
  hyperAdmins?: number;
  hyperManagers?: number;
  approvedVerifications?: number;
  rejectedVerifications?: number;
  totalProperties?: number;
  publishedProperties?: number;
  totalBookings?: number;
  pendingBookings?: number;
  totalRevenue?: number;
}

export const statsApi = {
  getDashboardStats: () =>
    api.get<AdminStats>(`${ROLES_BASE}/stats`, rbac('statsApi.getDashboardStats.GET')).then(r => r.data),
};

// ─── Property Groups ────────────────────────────────────────────────────────

export const groupsApi = {
  getAll: () =>
    api.get<PropertyGroup[]>(GROUPS_BASE, rbac('groupsApi.getAll.GET')).then(r => r.data),

  getAllPaginated: (params: PaginationParams = {}) =>
    api.get<Paginated<PropertyGroup>>(GROUPS_BASE, {
      ...rbac('groupsApi.getAll.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),

  getOne: (id: string) =>
    api.get<PropertyGroup>(`${GROUPS_BASE}/${id}`, rbac('groupsApi.getOne.GET')).then(r => r.data),

  create: (data: { name: string; description?: string }) =>
    api.post<PropertyGroup>(GROUPS_BASE, data, rbac('groupsApi.create.POST')).then(r => r.data),

  update: (id: string, data: { name?: string; description?: string; isActive?: boolean }) =>
    api.put<PropertyGroup>(`${GROUPS_BASE}/${id}`, data, rbac('groupsApi.update.PUT')).then(r => r.data),

  remove: (id: string) =>
    api.delete(`${GROUPS_BASE}/${id}`, rbac('groupsApi.remove.DELETE')),

  getProperties: (groupId: string) =>
    api.get(`${GROUPS_BASE}/${groupId}/properties`, rbac('groupsApi.getProperties.GET')).then(r => r.data),

  addProperty: (groupId: string, propertyId: string) =>
    api.post(`${GROUPS_BASE}/${groupId}/properties`, { propertyId }, rbac('groupsApi.addProperty.POST')).then(r => r.data),

  removeProperty: (groupId: string, propertyId: string) =>
    api.delete(`${GROUPS_BASE}/${groupId}/properties/${propertyId}`, rbac('groupsApi.removeProperty.DELETE')),
};

// ─── Document Verification ──────────────────────────────────────────────────

export const documentsApi = {
  getPending: () =>
    api.get<VerificationDocument[]>(`${DOCUMENTS_BASE}/pending`, rbac('documentsApi.getPending.GET')).then(r => r.data),

  submitForValidation: (docId: string) =>
    api.post<DocumentValidationResponse>(`${DOCUMENTS_BASE}/${docId}/validate`, undefined, rbac('documentsApi.submitForValidation.POST')).then(r => r.data),

  approve: (docId: string, note?: string) =>
    api.put<VerificationDocument>(`${DOCUMENTS_BASE}/${docId}/approve`, { note }, rbac('documentsApi.approve.PUT')).then(r => r.data),

  reject: (docId: string, note?: string) =>
    api.put<VerificationDocument>(`${DOCUMENTS_BASE}/${docId}/reject`, { note }, rbac('documentsApi.reject.PUT')).then(r => r.data),

  upload: (propertyId: string, type: string, file: File, replacesDocumentId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('propertyId', propertyId);
    if (replacesDocumentId) formData.append('replacesDocumentId', replacesDocumentId);
    return api.post<VerificationDocument>(`${DOCUMENTS_BASE}/upload`, formData, rbacMerge('documentsApi.upload.POST', {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).then(r => r.data);
  },

  getByProperty: (propertyId: string) =>
    api.get<VerificationDocument[]>(`${PROPERTIES_BASE}/${propertyId}/documents`, rbac('documentsApi.getByProperty.GET')).then(r => r.data),
};

// ─── Trust Recalculation ────────────────────────────────────────────────────

export const trustApi = {
  recalculate: (propertyId: string) =>
    api.put<TrustRecalculationResponse>(`${PROPERTIES_BASE}/${propertyId}/recalculate-trust`, undefined, rbac('trustApi.recalculate.PUT')).then(r => r.data),
};

// ─── Invitations ────────────────────────────────────────────────────────────

export const invitationsApi = {
  getAllowedRoles: () =>
    api.get<AppRole[]>(`${ROLES_BASE}/invitations/allowed-roles`, rbac('invitationsApi.getAllowedRoles.GET')).then(r => r.data),

  create: (data: CreateInvitationRequest) =>
    api.post<Invitation>(`${ROLES_BASE}/invitations`, data, rbac('invitationsApi.create.POST')).then(r => r.data),

  getAll: () =>
    api.get<Invitation[]>(`${ROLES_BASE}/invitations`, rbac('invitationsApi.getAll.GET')).then(r => r.data),

  getAllPaginated: (params: PaginationParams = {}) =>
    api.get<Paginated<Invitation>>(`${ROLES_BASE}/invitations`, {
      ...rbac('invitationsApi.getAll.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),

  cancel: (invitationId: string) =>
    api.delete(`${ROLES_BASE}/invitations/${invitationId}`, rbac('invitationsApi.cancel.DELETE')),

  resend: (invitationId: string) =>
    api.post(`${ROLES_BASE}/invitations/${invitationId}/resend`, undefined, rbac('invitationsApi.resend.POST')).then(r => r.data),

  convertGuestToUser: (data: ConvertGuestToUserRequest) =>
    api.post<ConvertGuestToUserResponse>(`${ROLES_BASE}/invitations/convert-guest-to-user`, data, rbac('invitationsApi.convertGuestToUser.POST')).then(r => r.data),

  updateUserStatus: (userId: number, status: string) =>
    api.put(`${ROLES_BASE}/users/${userId}/status`, { status }, rbac('invitationsApi.updateUserStatus.PUT')).then(r => r.data),

  deleteUser: (userId: number) =>
    api.delete(`${ROLES_BASE}/users/${userId}`, rbac('invitationsApi.deleteUser.DELETE')),
};
