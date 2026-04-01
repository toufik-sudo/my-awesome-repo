import { api } from '@/lib/axios';

export interface Badge {
  id: string;
  code: string;
  name: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  category: 'booking' | 'review' | 'social' | 'loyalty' | 'special' | 'achievement';
  pointsThreshold: number;
  actionRequired?: string;
  actionCountRequired: number;
  bonusPoints: number;
  sortOrder: number;
  isActive: boolean;
}

export interface UserBadge {
  id: string;
  userId: number;
  badgeId: string;
  badge: Badge;
  unlockedAt: string;
}

export interface BadgeProgress {
  badge: Badge;
  progress: number;
  total: number;
  unlocked: boolean;
}

export const badgesApi = {
  getAll: () => api.get<Badge[]>('/badges').then(r => r.data),
  getMine: () => api.get<UserBadge[]>('/badges/me').then(r => r.data),
  getProgress: () => api.get<BadgeProgress[]>('/badges/me/progress').then(r => r.data),
  checkUnlocks: () => api.post<UserBadge[]>('/badges/me/check').then(r => r.data),
};
