import { api } from '@/lib/axios';

const BASE = '/hyper';

export const hyperManagementApi = {
  // Properties
  pauseProperty: (id: string) =>
    api.put(`${BASE}/properties/${id}/pause`).then(r => r.data),
  resumeProperty: (id: string) =>
    api.put(`${BASE}/properties/${id}/resume`).then(r => r.data),
  archiveProperty: (id: string, reason?: string) =>
    api.delete(`${BASE}/properties/${id}/archive`, { data: { reason } }).then(r => r.data),
  deleteProperty: (id: string) =>
    api.delete(`${BASE}/properties/${id}`).then(r => r.data),

  // Services
  pauseService: (id: string) =>
    api.put(`${BASE}/services/${id}/pause`).then(r => r.data),
  resumeService: (id: string) =>
    api.put(`${BASE}/services/${id}/resume`).then(r => r.data),
  archiveService: (id: string, reason?: string) =>
    api.delete(`${BASE}/services/${id}/archive`, { data: { reason } }).then(r => r.data),
  deleteService: (id: string) =>
    api.delete(`${BASE}/services/${id}`).then(r => r.data),

  // Users
  pauseUser: (id: number) =>
    api.put(`${BASE}/users/${id}/pause`).then(r => r.data),
  resumeUser: (id: number) =>
    api.put(`${BASE}/users/${id}/resume`).then(r => r.data),
  archiveUser: (id: number, reason?: string) =>
    api.delete(`${BASE}/users/${id}/archive`, { data: { reason } }).then(r => r.data),
  reactivateUser: (id: number) =>
    api.put(`${BASE}/users/${id}/reactivate`).then(r => r.data),
};
