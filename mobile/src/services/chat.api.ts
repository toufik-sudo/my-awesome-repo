import { api } from '@/lib/axios';

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderRole: 'host' | 'guest';
  content: string;
  filtered: boolean;
  createdAt: string;
}

export interface ChatConversationSummary {
  bookingId: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  participant: { id: string; name: string; avatar?: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const chatApi = {
  async getConversations(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ChatConversationSummary>> {
    const res = await api.get('/chat/conversations', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    });
    const body: any = res.data;
    if (Array.isArray(body)) {
      return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }
    return body;
  },

  async getMessages(bookingId: string, page = 1, limit = 50) {
    return api.get(`/chat/${bookingId}/messages`, { params: { page, limit } }).then(r => r.data);
  },

  async sendMessage(bookingId: string, content: string) {
    return api.post(`/chat/${bookingId}/messages`, { content }).then(r => r.data);
  },
};
