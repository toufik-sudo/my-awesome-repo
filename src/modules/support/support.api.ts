import { api } from '@/lib/axios';
import { rbac, rbacMerge } from '@/lib/api-rbac';

// ─── Types ───────────────────────────────────────────────

export interface SupportThread {
  id: string;
  subject: string;
  category: 'technical' | 'booking_issue' | 'payment' | 'property_issue' | 'general' | 'negative_review';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  initiatorId: number;
  initiator?: { id: number; name?: string; email?: string };
  assignedAdminId?: number;
  assignedAdmin?: { id: number; name?: string };
  propertyId?: string;
  bookingId?: string;
  reviewId?: string;
  unreadCountAdmin: number;
  unreadCountUser: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  threadId: string;
  senderId: number;
  senderRole: string;
  content: string;
  isSystemMessage: boolean;
  sender?: { id: number; name?: string };
  createdAt: string;
}

export interface CreateThreadDto {
  subject: string;
  category?: string;
  content: string;
  propertyId?: string;
  bookingId?: string;
  reviewId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── API ─────────────────────────────────────────────────

export const supportApi = {
  createThread: (data: CreateThreadDto) =>
    api.post<SupportThread>('/support/threads', data, rbac('supportApi.createThread.POST')).then(r => r.data),

  getMyThreads: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<SupportThread>>('/support/threads/mine', rbacMerge('supportApi.getMyThreads.GET', {
      params: { page, limit },
    })).then(r => r.data),

  getAdminThreads: (page = 1, limit = 20, status?: string, category?: string) =>
    api.get<PaginatedResponse<SupportThread>>('/support/threads', rbacMerge('supportApi.getAdminThreads.GET', {
      params: { page, limit, status, category },
    })).then(r => r.data),

  getThread: (threadId: string) =>
    api.get<SupportThread>(`/support/threads/${threadId}`, rbac('supportApi.getThread.GET')).then(r => r.data),

  getMessages: (threadId: string, page = 1, limit = 50) =>
    api.get<PaginatedResponse<SupportMessage>>(`/support/threads/${threadId}/messages`, rbacMerge('supportApi.getMessages.GET', {
      params: { page, limit },
    })).then(r => r.data),

  sendMessage: (threadId: string, content: string) =>
    api.post<SupportMessage>(`/support/threads/${threadId}/messages`, { content }, rbac('supportApi.sendMessage.POST')).then(r => r.data),

  updateStatus: (threadId: string, status: string) =>
    api.patch(`/support/threads/${threadId}/status`, { status }, rbac('supportApi.updateStatus.PATCH')).then(r => r.data),

  assignThread: (threadId: string, adminId: number) =>
    api.patch(`/support/threads/${threadId}/assign`, { adminId }, rbac('supportApi.assignThread.PATCH')).then(r => r.data),

  markRead: (threadId: string) =>
    api.post(`/support/threads/${threadId}/read`, undefined, rbac('supportApi.markRead.POST')).then(r => r.data),
};
