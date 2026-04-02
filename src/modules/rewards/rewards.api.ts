import { api } from '@/lib/axios';

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
  /** Public shop */
  getShop: () =>
    api.get<Reward[]>(`${REWARDS_BASE}/shop`).then(r => r.data),

  /** Admin: all rewards */
  getAll: () =>
    api.get<Reward[]>(REWARDS_BASE).then(r => r.data),

  /** Get single reward */
  getById: (id: string) =>
    api.get<Reward>(`${REWARDS_BASE}/${id}`).then(r => r.data),

  /** Admin: create reward */
  create: (data: Partial<Reward>) =>
    api.post<Reward>(REWARDS_BASE, data).then(r => r.data),

  /** Admin: update reward */
  update: (id: string, data: Partial<Reward>) =>
    api.put<Reward>(`${REWARDS_BASE}/${id}`, data).then(r => r.data),

  /** Admin: delete reward */
  remove: (id: string) =>
    api.delete(`${REWARDS_BASE}/${id}`),

  /** Redeem a reward */
  redeem: (rewardId: string) =>
    api.post<RewardRedemption>(`${REWARDS_BASE}/${rewardId}/redeem`).then(r => r.data),

  /** Get my redemptions */
  getMyRedemptions: () =>
    api.get<RewardRedemption[]>(`${REWARDS_BASE}/me/redemptions`).then(r => r.data),

  /** Use a redemption code */
  useRedemption: (code: string, data?: { referenceId?: string; referenceType?: string }) =>
    api.post<RewardRedemption>(`${REWARDS_BASE}/redemptions/${code}/use`, data).then(r => r.data),

  /** Cancel a redemption */
  cancelRedemption: (redemptionId: string) =>
    api.delete(`${REWARDS_BASE}/redemptions/${redemptionId}/cancel`).then(r => r.data),

  /** Admin: all redemptions */
  getAllRedemptions: () =>
    api.get<RewardRedemption[]>(`${REWARDS_BASE}/admin/redemptions`).then(r => r.data),
};
