import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';
import type { Paginated, PaginationParams } from '@/modules/shared/types/pagination';

const REWARDS_BASE = '/rewards';

export type RewardType = 'discount' | 'upgrade' | 'free_service' | 'free_night' | 'cashback' | 'gift';
export type RewardStatus = 'active' | 'paused' | 'expired' | 'sold_out';
export type RedemptionStatus = 'pending' | 'confirmed' | 'used' | 'expired' | 'cancelled';

export interface Reward {
  id: string;
  name: string;
  description?: string;
  type: RewardType;
  pointsCost: number;
  discountPercent: number;
  discountAmount: number;
  currency: string;
  icon: string;
  imageUrl?: string;
  requiredTier?: string;
  maxRedemptions?: number;
  currentRedemptions: number;
  maxPerUser?: number;
  validFrom?: string;
  validTo?: string;
  status: RewardStatus;
  category: string;
  sortOrder: number;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RewardRedemption {
  id: string;
  userId: number;
  rewardId: string;
  reward?: Reward;
  pointsSpent: number;
  code: string;
  status: RedemptionStatus;
  usedAt?: string;
  usedOnReferenceId?: string;
  usedOnReferenceType?: string;
  expiresAt?: string;
  createdAt: string;
}

export const REWARD_TYPE_LABELS: Record<RewardType, { fr: string; en: string; ar: string; icon: string }> = {
  discount: { fr: 'Réduction', en: 'Discount', ar: 'خصم', icon: '🏷️' },
  upgrade: { fr: 'Surclassement', en: 'Upgrade', ar: 'ترقية', icon: '⬆️' },
  free_service: { fr: 'Service gratuit', en: 'Free Service', ar: 'خدمة مجانية', icon: '🎁' },
  free_night: { fr: 'Nuit gratuite', en: 'Free Night', ar: 'ليلة مجانية', icon: '🌙' },
  cashback: { fr: 'Cashback', en: 'Cashback', ar: 'استرداد', icon: '💰' },
  gift: { fr: 'Cadeau', en: 'Gift', ar: 'هدية', icon: '🎀' },
};

export const REWARD_CATEGORIES: Record<string, { fr: string; en: string; ar: string }> = {
  discounts: { fr: 'Réductions', en: 'Discounts', ar: 'خصومات' },
  upgrades: { fr: 'Surclassements', en: 'Upgrades', ar: 'ترقيات' },
  services: { fr: 'Services', en: 'Services', ar: 'خدمات' },
  experiences: { fr: 'Expériences', en: 'Experiences', ar: 'تجارب' },
  gifts: { fr: 'Cadeaux', en: 'Gifts', ar: 'هدايا' },
  general: { fr: 'Général', en: 'General', ar: 'عام' },
};

export const rewardsApi = {
  getShop: () =>
    api.get<Reward[]>(`${REWARDS_BASE}/shop`, rbac('rewardsApi.getShop.GET')).then(r => r.data),

  getShopPaginated: (params: PaginationParams = {}) =>
    api.get<Paginated<Reward>>(`${REWARDS_BASE}/shop`, {
      ...rbac('rewardsApi.getShop.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),

  getAll: () =>
    api.get<Reward[]>(REWARDS_BASE, rbac('rewardsApi.getAll.GET')).then(r => r.data),

  getAllPaginated: (params: PaginationParams = {}) =>
    api.get<Paginated<Reward>>(REWARDS_BASE, {
      ...rbac('rewardsApi.getAll.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),

  getById: (id: string) =>
    api.get<Reward>(`${REWARDS_BASE}/${id}`, rbac('rewardsApi.getById.GET')).then(r => r.data),

  create: (data: Partial<Reward>) =>
    api.post<Reward>(REWARDS_BASE, data, rbac('rewardsApi.create.POST')).then(r => r.data),

  update: (id: string, data: Partial<Reward>) =>
    api.put<Reward>(`${REWARDS_BASE}/${id}`, data, rbac('rewardsApi.update.PUT')).then(r => r.data),

  remove: (id: string) =>
    api.delete(`${REWARDS_BASE}/${id}`, rbac('rewardsApi.remove.DELETE')),

  redeem: (rewardId: string) =>
    api.post<RewardRedemption>(`${REWARDS_BASE}/${rewardId}/redeem`, undefined, rbac('rewardsApi.redeem.POST')).then(r => r.data),

  getMyRedemptions: () =>
    api.get<RewardRedemption[]>(`${REWARDS_BASE}/me/redemptions`, rbac('rewardsApi.getMyRedemptions.GET')).then(r => r.data),

  getMyRedemptionsPaginated: (params: PaginationParams = {}) =>
    api.get<Paginated<RewardRedemption>>(`${REWARDS_BASE}/me/redemptions`, {
      ...rbac('rewardsApi.getMyRedemptions.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),

  useRedemption: (code: string, data?: { referenceId?: string; referenceType?: string }) =>
    api.post<RewardRedemption>(`${REWARDS_BASE}/redemptions/${code}/use`, data, rbac('rewardsApi.useRedemption.POST')).then(r => r.data),

  cancelRedemption: (redemptionId: string) =>
    api.delete(`${REWARDS_BASE}/redemptions/${redemptionId}/cancel`, rbac('rewardsApi.cancelRedemption.DELETE')).then(r => r.data),

  getAllRedemptions: () =>
    api.get<RewardRedemption[]>(`${REWARDS_BASE}/admin/redemptions`, rbac('rewardsApi.getAllRedemptions.GET')).then(r => r.data),

  getAllRedemptionsPaginated: (params: PaginationParams = {}) =>
    api.get<Paginated<RewardRedemption>>(`${REWARDS_BASE}/admin/redemptions`, {
      ...rbac('rewardsApi.getAllRedemptions.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),
};
