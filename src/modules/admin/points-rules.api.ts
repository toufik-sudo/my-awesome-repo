import { api } from '@/lib/axios';

const RULES_BASE = '/points-rules';

export type PointsRuleType = 'earning' | 'conversion';
export type PointsTargetRole = 'guest' | 'manager';
export type PointsRuleScope = 'global' | 'host' | 'property_group' | 'service_group' | 'property' | 'service';

export interface PointsRule {
  id: string;
  createdByUserId: number;
  ruleType: PointsRuleType;
  targetRole: PointsTargetRole;
  scope: PointsRuleScope;
  targetHostId?: number;
  targetPropertyGroupId?: string;
  targetServiceGroupId?: string;
  targetPropertyId?: string;
  targetServiceId?: string;
  action: string;
  /** Points earned per action (earning rules only, must be > 0) */
  pointsAmount: number;
  /** For conversion rules: how many points = 1 unit of currency */
  conversionRate?: number;
  /** Currency code for conversion */
  currency: string;
  /** Min points required for conversion (conversion rules only) */
  minPointsForConversion?: number;
  /** Max points per period (earning rules only, 0 = unlimited) */
  maxPointsPerPeriod: number;
  /** Period for max points: daily, weekly, monthly (earning rules only) */
  period?: string;
  /** Multiplier for special events (earning rules only, must be > 0) */
  multiplier: number;
  /** Minimum number of nights required to earn points (optional for earning) */
  minNights?: number;
  /** Start date of the rule application period */
  validFrom?: string;
  /** End date of the rule application period */
  validTo?: string;
  isDefault: boolean;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** Actions available for points rules */
export const POINTS_ACTIONS = [
  'booking_completed',
  'review_submitted',
  'referral_signup',
  'first_booking',
  'profile_completed',
  'property_verified',
  'service_created',
  'five_star_review',
  'monthly_bonus',
  'event_participation',
  'photo_upload',
  'social_share',
  'property_shared',
  'loyalty_milestone',
  'points_to_currency',
] as const;

export type PointsAction = typeof POINTS_ACTIONS[number];

export const pointsRulesApi = {
  getAll: () =>
    api.get<PointsRule[]>(RULES_BASE).then(r => r.data),

  getDefaults: () =>
    api.get<PointsRule[]>(`${RULES_BASE}/defaults`).then(r => r.data),

  getEarning: () =>
    api.get<PointsRule[]>(`${RULES_BASE}/earning`).then(r => r.data),

  getConversion: () =>
    api.get<PointsRule[]>(`${RULES_BASE}/conversion`).then(r => r.data),

  getByRole: (role: PointsTargetRole) =>
    api.get<PointsRule[]>(`${RULES_BASE}/role/${role}`).then(r => r.data),

  create: (data: Partial<PointsRule>) =>
    api.post<PointsRule>(RULES_BASE, data).then(r => r.data),

  update: (ruleId: string, data: Partial<PointsRule>) =>
    api.put<PointsRule>(`${RULES_BASE}/${ruleId}`, data).then(r => r.data),

  remove: (ruleId: string) =>
    api.delete(`${RULES_BASE}/${ruleId}`),
};
