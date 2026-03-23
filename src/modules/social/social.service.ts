import { api } from '@/lib/axios';
import { COMMENTS_API, REACTIONS_API, RANKINGS_API } from './social.api';
import type { CommentData, CommentMedia, CommentMention } from '@/modules/shared/components/DynamicComments';
import type { ReactionType, ReactionSummary } from '@/modules/shared/components/DynamicReactions';
import type { RankingUser } from '@/modules/shared/components/DynamicRanking';

// ─── Comments Service ────────────────────────────────────────────────────────

export const commentsService = {
  async getComments(targetType: string, targetId: string, page = 1, limit = 20) {
    const response = await api.get<{ items: CommentData[]; total: number }>(
      COMMENTS_API.GET(targetType, targetId),
      { params: { page, limit } },
    );
    return response.data;
  },

  async getReplies(commentId: string, page = 1, limit = 20) {
    const response = await api.get<{ items: CommentData[]; total: number }>(
      COMMENTS_API.REPLIES(commentId),
      { params: { page, limit } },
    );
    return response.data;
  },

  async createComment(
    content: string,
    targetType: string,
    targetId: string,
    parentId?: string,
    media?: CommentMedia[],
    mentions?: CommentMention[],
  ) {
    const response = await api.post<CommentData>(COMMENTS_API.CREATE, {
      content,
      targetType,
      targetId,
      parentId,
      media,
      mentions,
    });
    return response.data;
  },

  async updateComment(commentId: string, content: string, media?: CommentMedia[]) {
    const response = await api.put<CommentData>(COMMENTS_API.UPDATE(commentId), {
      content,
      media,
    });
    return response.data;
  },

  async deleteComment(commentId: string) {
    await api.delete(COMMENTS_API.DELETE(commentId));
  },
};

// ─── Reactions Service ───────────────────────────────────────────────────────

export const reactionsService = {
  async getReactionSummary(targetType: string, targetId: string) {
    const response = await api.get<ReactionSummary>(REACTIONS_API.GET(targetType, targetId));
    return response.data;
  },

  async toggleReaction(type: ReactionType, targetType: string, targetId: string) {
    const response = await api.post<{ action: string; type?: string }>(REACTIONS_API.TOGGLE, {
      type,
      targetType,
      targetId,
    });
    return response.data;
  },

  async removeReaction(targetType: string, targetId: string) {
    await api.delete(REACTIONS_API.REMOVE(targetType, targetId));
  },
};

// ─── Rankings Service ────────────────────────────────────────────────────────

export const rankingsService = {
  async getRankings(category = 'global', page = 1, limit = 50) {
    const response = await api.get<{ items: RankingUser[]; total: number }>(RANKINGS_API.LIST, {
      params: { category, page, limit },
    });
    return response.data;
  },

  async getMyRank(category = 'global') {
    const response = await api.get<{ rank: number | null; score: number }>(RANKINGS_API.ME, {
      params: { category },
    });
    return response.data;
  },
};
