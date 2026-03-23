/**
 * Comments, Reactions, Rankings API endpoints
 */

import { API_BASE } from '@/constants/api.constants';

const SOCIAL_BASE = '/api';

export const COMMENTS_API = {
  GET: (targetType: string, targetId: string) => `${SOCIAL_BASE}/comments/${targetType}/${targetId}`,
  REPLIES: (commentId: string) => `${SOCIAL_BASE}/comments/${commentId}/replies`,
  CREATE: `${SOCIAL_BASE}/comments`,
  UPDATE: (id: string) => `${SOCIAL_BASE}/comments/${id}`,
  DELETE: (id: string) => `${SOCIAL_BASE}/comments/${id}`,
} as const;

export const REACTIONS_API = {
  GET: (targetType: string, targetId: string) => `${SOCIAL_BASE}/reactions/${targetType}/${targetId}`,
  TOGGLE: `${SOCIAL_BASE}/reactions`,
  REMOVE: (targetType: string, targetId: string) => `${SOCIAL_BASE}/reactions/${targetType}/${targetId}`,
} as const;

export const RANKINGS_API = {
  LIST: `${SOCIAL_BASE}/rankings`,
  ME: `${SOCIAL_BASE}/rankings/me`,
} as const;
