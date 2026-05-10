import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';

const BASE = '/hyper';

export const hyperManagementApi = {
  pauseProperty: (id: string) =>
    api.put(`${BASE}/properties/${id}/pause`, undefined, rbac('hyperManagementApi.pauseProperty.PUT')).then(r => r.data),
  resumeProperty: (id: string) =>
    api.put(`${BASE}/properties/${id}/resume`, undefined, rbac('hyperManagementApi.resumeProperty.PUT')).then(r => r.data),
  archiveProperty: (id: string, reason?: string) =>
    api.delete(`${BASE}/properties/${id}/archive`, { ...rbac('hyperManagementApi.archiveProperty.DELETE'), data: { reason } }).then(r => r.data),
  deleteProperty: (id: string) =>
    api.delete(`${BASE}/properties/${id}`, rbac('hyperManagementApi.deleteProperty.DELETE')).then(r => r.data),

  pauseService: (id: string) =>
    api.put(`${BASE}/services/${id}/pause`, undefined, rbac('hyperManagementApi.pauseService.PUT')).then(r => r.data),
  resumeService: (id: string) =>
    api.put(`${BASE}/services/${id}/resume`, undefined, rbac('hyperManagementApi.resumeService.PUT')).then(r => r.data),
  archiveService: (id: string, reason?: string) =>
    api.delete(`${BASE}/services/${id}/archive`, { ...rbac('hyperManagementApi.archiveService.DELETE'), data: { reason } }).then(r => r.data),
  deleteService: (id: string) =>
    api.delete(`${BASE}/services/${id}`, rbac('hyperManagementApi.deleteService.DELETE')).then(r => r.data),

  pauseUser: (id: number) =>
    api.put(`${BASE}/users/${id}/pause`, undefined, rbac('hyperManagementApi.pauseUser.PUT')).then(r => r.data),
  resumeUser: (id: number) =>
    api.put(`${BASE}/users/${id}/resume`, undefined, rbac('hyperManagementApi.resumeUser.PUT')).then(r => r.data),
  archiveUser: (id: number, reason?: string) =>
    api.delete(`${BASE}/users/${id}/archive`, { ...rbac('hyperManagementApi.archiveUser.DELETE'), data: { reason } }).then(r => r.data),
  reactivateUser: (id: number) =>
    api.put(`${BASE}/users/${id}/reactivate`, undefined, rbac('hyperManagementApi.reactivateUser.PUT')).then(r => r.data),
};
