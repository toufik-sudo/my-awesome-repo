import { api } from '@/lib/axios';

export interface SupportThread {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
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
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function normalize<T>(body: any): PaginatedResponse<T> {
  if (Array.isArray(body)) {
    return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
  }
  // Backend support uses { items, total, page, limit }
  if (body && Array.isArray(body.items)) {
    const limit = body.limit || body.items.length || 1;
    return {
      data: body.items,
      total: body.total ?? body.items.length,
      page: body.page ?? 1,
      limit,
      totalPages: Math.max(1, Math.ceil((body.total ?? body.items.length) / limit)),
    };
  }
  return body;
}

export const supportApi = {
  async getMyThreads(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<SupportThread>> {
    const res = await api.get('/support/threads/mine', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    });
    return normalize<SupportThread>(res.data);
  },

  async createThread(data: { subject: string; content: string; category?: string }) {
    return api.post<SupportThread>('/support/threads', data).then(r => r.data);
  },

  async getThread(id: string): Promise<SupportThread> {
    const res = await api.get(`/support/threads/${id}`);
    return res.data;
  },

  async getMessages(id: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<SupportMessage>> {
    const res = await api.get(`/support/threads/${id}/messages`, {
      params: { page: params.page ?? 1, limit: params.limit ?? 50 },
    });
    return normalize<SupportMessage>(res.data);
  },

  async sendMessage(id: string, content: string) {
    return api.post(`/support/threads/${id}/messages`, { content }).then(r => r.data);
  },

  async markRead(id: string) {
    return api.post(`/support/threads/${id}/read`).then(r => r.data);
  },
};
