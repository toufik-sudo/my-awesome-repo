import { api } from '@/lib/axios';

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderRole: 'host' | 'guest';
  content: string;
  originalContent?: string; // Before filtering
  filtered: boolean;
  filterReason?: string;
  createdAt: string;
}

export interface ChatConversation {
  bookingId: string;
  messages: ChatMessage[];
  participants: {
    host: { id: string; name: string; avatar?: string };
    guest: { id: string; name: string; avatar?: string };
  };
}

export interface SendMessageDto {
  bookingId: string;
  content: string;
}

export const chatApi = {
  getConversation: (bookingId: string) =>
    api.get<ChatConversation>(`/chat/${bookingId}`).then(r => r.data),

  sendMessage: (data: SendMessageDto) =>
    api.post<ChatMessage>(`/chat/${data.bookingId}/messages`, { content: data.content }).then(r => r.data),

  getMessages: (bookingId: string, page = 1, limit = 50) =>
    api.get<{ messages: ChatMessage[]; total: number }>(`/chat/${bookingId}/messages`, {
      params: { page, limit },
    }).then(r => r.data),
};
