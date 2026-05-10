import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';
import type { Paginated, PaginationParams } from '@/modules/shared/types/pagination';

const RULES_BASE = '/points-rules';

export interface PointsRule {
  id: string;
  createdByUserId: number;
  ruleType: 'earning' | 'conversion';
  targetRole: 'guest' | 'manager';
  scope: 'global' | 'host' | 'property_group' | 'service_group' | 'property' | 'service';
  targetHostId?: number;
  targetPropertyGroupId?: string;
  targetServiceGroupId?: string;
  targetPropertyId?: string;
  targetServiceId?: string;
  action: string;
  pointsAmount: number;
  conversionRate?: number;
  currency: string;
  minPointsForConversion?: number;
  maxPointsPerPeriod: number;
  period?: string;
  multiplier: number;
  minNights?: number;
  validFrom?: string;
  validTo?: string;
  isDefault: boolean;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

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
] as const;

export const pointsRulesApi = {
  getAll: () =>
    api.get<PointsRule[]>(RULES_BASE, rbac('pointsRulesApi.getAll.GET')).then(r => r.data),

  getAllPaginated: (params: PaginationParams = {}) =>
    api.get<Paginated<PointsRule>>(RULES_BASE, {
      ...rbac('pointsRulesApi.getAll.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),

  getDefaults: () =>
    api.get<PointsRule[]>(`${RULES_BASE}/defaults`, rbac('pointsRulesApi.getDefaults.GET')).then(r => r.data),

  getEarning: () =>
    api.get<PointsRule[]>(`${RULES_BASE}/earning`, rbac('pointsRulesApi.getEarning.GET')).then(r => r.data),

  getConversion: () =>
    api.get<PointsRule[]>(`${RULES_BASE}/conversion`, rbac('pointsRulesApi.getConversion.GET')).then(r => r.data),

  getByRole: (role: 'guest' | 'manager') =>
    api.get<PointsRule[]>(`${RULES_BASE}/role/${role}`, rbac('pointsRulesApi.getByRole.GET')).then(r => r.data),

  create: (data: Partial<PointsRule>) =>
    api.post<PointsRule>(RULES_BASE, data, rbac('pointsRulesApi.create.POST')).then(r => r.data),

  update: (ruleId: string, data: Partial<PointsRule>) =>
    api.put<PointsRule>(`${RULES_BASE}/${ruleId}`, data, rbac('pointsRulesApi.update.PUT')).then(r => r.data),

  remove: (ruleId: string) =>
    api.delete(`${RULES_BASE}/${ruleId}`, rbac('pointsRulesApi.remove.DELETE')),
};
