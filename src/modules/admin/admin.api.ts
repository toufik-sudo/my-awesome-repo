import { api } from '@/lib/axios';
import type {
  AppRole, UserRole, PropertyGroup, ManagerAssignment,
  ManagerPermission, PermissionType, AssignmentScope, UserWithRoles,
} from './admin.types';
import type {
  VerificationDocument,
  DocumentValidationResponse,
  TrustRecalculationResponse,
} from '@/types/verification.types';

const ROLES_BASE = '/roles';
const GROUPS_BASE = '/property-groups';
const DOCUMENTS_BASE = '/documents';
const PROPERTIES_BASE = '/properties';

// ─── Roles ──────────────────────────────────────────────────────────────────

export const rolesApi = {
  getUserRoles: (userId: number) =>
    api.get<AppRole[]>(`${ROLES_BASE}/user/${userId}`).then(r => r.data),

  assignRole: (userId: number, role: AppRole) =>
    api.post<UserRole>(`${ROLES_BASE}/assign`, { userId, role }).then(r => r.data),

  removeRole: (userId: number, role: AppRole) =>
    api.delete(`${ROLES_BASE}/user/${userId}/${role}`),

  getAllUsers: () =>
    api.get<UserWithRoles[]>(`${ROLES_BASE}/users`).then(r => r.data),
};

// ─── Manager Assignments ────────────────────────────────────────────────────

export const assignmentsApi = {
  getAll: () =>
    api.get<ManagerAssignment[]>(`${ROLES_BASE}/assignments`).then(r => r.data),

  create: (data: {
    managerId: number;
    scope: AssignmentScope;
    propertyId?: string;
    propertyGroupId?: string;
  }) =>
    api.post<ManagerAssignment>(`${ROLES_BASE}/manager/assign`, data).then(r => r.data),

  remove: (assignmentId: string) =>
    api.delete(`${ROLES_BASE}/assignments/${assignmentId}`),

  getPermissions: (assignmentId: string) =>
    api.get<ManagerPermission[]>(`${ROLES_BASE}/manager/${assignmentId}/permissions`).then(r => r.data),

  setPermissions: (assignmentId: string, permissions: { permission: PermissionType; isGranted: boolean }[]) =>
    api.post<ManagerPermission[]>(`${ROLES_BASE}/manager/permissions`, { assignmentId, permissions }).then(r => r.data),
};

// ─── Stats ──────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalGroups: number;
  activeManagers: number;
  totalAssignments: number;
  pendingVerifications: number;
  // Extended stats
  totalAdmins?: number;
  totalManagers?: number;
  totalRegularUsers?: number;
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
    api.get<AdminStats>(`${ROLES_BASE}/stats`).then(r => r.data),
};

// ─── Property Groups ────────────────────────────────────────────────────────

export const groupsApi = {
  getAll: () =>
    api.get<PropertyGroup[]>(GROUPS_BASE).then(r => r.data),

  getOne: (id: string) =>
    api.get<PropertyGroup>(`${GROUPS_BASE}/${id}`).then(r => r.data),

  create: (data: { name: string; description?: string }) =>
    api.post<PropertyGroup>(GROUPS_BASE, data).then(r => r.data),

  update: (id: string, data: { name?: string; description?: string; isActive?: boolean }) =>
    api.put<PropertyGroup>(`${GROUPS_BASE}/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    api.delete(`${GROUPS_BASE}/${id}`),

  getProperties: (groupId: string) =>
    api.get(`${GROUPS_BASE}/${groupId}/properties`).then(r => r.data),

  addProperty: (groupId: string, propertyId: string) =>
    api.post(`${GROUPS_BASE}/${groupId}/properties`, { propertyId }).then(r => r.data),

  removeProperty: (groupId: string, propertyId: string) =>
    api.delete(`${GROUPS_BASE}/${groupId}/properties/${propertyId}`),
};

// ─── Document Verification ──────────────────────────────────────────────────

export const documentsApi = {
  /** Get all pending documents for hyper admin review */
  getPending: () =>
    api.get<VerificationDocument[]>(`${DOCUMENTS_BASE}/pending`).then(r => r.data),

  /** Submit a document for AI validation */
  submitForValidation: (docId: string) =>
    api.post<DocumentValidationResponse>(`${DOCUMENTS_BASE}/${docId}/validate`).then(r => r.data),

  /** Approve a document (hyper admin) */
  approve: (docId: string, note?: string) =>
    api.put<VerificationDocument>(`${DOCUMENTS_BASE}/${docId}/approve`, { note }).then(r => r.data),

  /** Reject a document (hyper admin) */
  reject: (docId: string, note?: string) =>
    api.put<VerificationDocument>(`${DOCUMENTS_BASE}/${docId}/reject`, { note }).then(r => r.data),

  /** Upload a new verification document */
  upload: (propertyId: string, type: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('propertyId', propertyId);
    return api.post<VerificationDocument>(`${DOCUMENTS_BASE}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  /** Get documents for a specific property */
  getByProperty: (propertyId: string) =>
    api.get<VerificationDocument[]>(`${PROPERTIES_BASE}/${propertyId}/documents`).then(r => r.data),
};

// ─── Trust Recalculation ────────────────────────────────────────────────────

export const trustApi = {
  /** Recalculate trust stars for a property */
  recalculate: (propertyId: string) =>
    api.put<TrustRecalculationResponse>(`${PROPERTIES_BASE}/${propertyId}/recalculate-trust`).then(r => r.data),
};

// ─── Invitations ────────────────────────────────────────────────────────────

export interface Invitation {
  id: string;
  method: 'email' | 'phone';
  email?: string;
  phone?: string;
  role: string;
  status: string;
  invitedBy: number;
  message?: string;
  createdAt: string;
  expiresAt: string;
}

export const invitationsApi = {
  create: (data: {
    method: 'email' | 'phone';
    email?: string;
    phone?: string;
    role: string;
    message?: string;
  }) => api.post<Invitation>(`${ROLES_BASE}/invitations`, data).then(r => r.data),

  getAll: () =>
    api.get<Invitation[]>(`${ROLES_BASE}/invitations`).then(r => r.data),

  cancel: (invitationId: string) =>
    api.delete(`${ROLES_BASE}/invitations/${invitationId}`),

  resend: (invitationId: string) =>
    api.post(`${ROLES_BASE}/invitations/${invitationId}/resend`).then(r => r.data),

  /** Update user status (pause/disable/activate) */
  updateUserStatus: (userId: number, status: string) =>
    api.put(`${ROLES_BASE}/users/${userId}/status`, { status }).then(r => r.data),

  /** Delete a user entirely */
  deleteUser: (userId: number) =>
    api.delete(`${ROLES_BASE}/users/${userId}`),
};
