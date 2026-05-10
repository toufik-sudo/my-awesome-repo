import { api } from '@/lib/axios';

const BASE = '/api';

export interface CommentItem {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  parentId?: string;
  replies?: CommentItem[];
}

export interface ReactionSummary {
  type: string;
  count: number;
  userReacted: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const socialApi = {
  /** Legacy non-paginated fetch — kept for back-compat. */
  async getComments(targetType: string, targetId: string): Promise<CommentItem[]> {
    const res = await api.get(`${BASE}/comments/${targetType}/${targetId}`);
    const body: any = res.data;
    return Array.isArray(body) ? body : body?.data || body?.items || [];
  },

  /** Paginated comments fetcher (page/limit). Falls back to array shape. */
  async getCommentsPaginated(
    targetType: string,
    targetId: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<PaginatedResponse<CommentItem>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const res = await api.get(`${BASE}/comments/${targetType}/${targetId}`, {
      params: { page, limit },
    });
    const body: any = res.data;
    if (Array.isArray(body)) {
      return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }
    if (body?.data) {
      return {
        data: body.data,
        total: body.total ?? body.data.length,
        page: body.page ?? page,
        limit: body.limit ?? limit,
        totalPages: body.totalPages ?? 1,
      };
    }
    return { data: [], total: 0, page: 1, limit, totalPages: 1 };
  },

  async createComment(data: { targetType: string; targetId: string; content: string; parentId?: string }) {
    return api.post(`${BASE}/comments`, data).then((r) => r.data);
  },

  async deleteComment(id: string) {
    return api.delete(`${BASE}/comments/${id}`).then((r) => r.data);
  },

  async getReactions(targetType: string, targetId: string): Promise<ReactionSummary[]> {
    const res = await api.get(`${BASE}/reactions/${targetType}/${targetId}`);
    const body: any = res.data;
    return Array.isArray(body) ? body : body?.summary || body?.data || [];
  },

  async toggleReaction(data: { targetType: string; targetId: string; type: string }) {
    return api.post(`${BASE}/reactions`, data).then((r) => r.data);
  },
};
