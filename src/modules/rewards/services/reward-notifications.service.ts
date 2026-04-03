/**
 * Reward & Tier notification triggers.
 * These helpers call the backend notification API to push tier-unlock and reward-expiry alerts.
 */
import { api } from '@/lib/axios';

const NOTIF_BASE = '/notifications';

export interface TierNotificationPayload {
  userId: number;
  newTier: string;
  previousTier: string;
  lifetimePoints: number;
}

export interface RewardExpiryPayload {
  userId: number;
  rewardName: string;
  code: string;
  expiresAt: string;
  daysRemaining: number;
}

export const rewardNotificationsService = {
  /**
   * Notify user they unlocked a new tier
   */
  notifyTierUnlock: (data: TierNotificationPayload) =>
    api.post(`${NOTIF_BASE}/tier-unlock`, data).then(r => r.data),

  /**
   * Notify user a reward is about to expire
   */
  notifyRewardExpiry: (data: RewardExpiryPayload) =>
    api.post(`${NOTIF_BASE}/reward-expiry`, data).then(r => r.data),

  /**
   * Batch check: find all redemptions expiring in X days and trigger notifications
   */
  triggerExpiryAlerts: (daysThreshold: number = 7) =>
    api.post(`${NOTIF_BASE}/check-reward-expiry`, { daysThreshold }).then(r => r.data),
};
