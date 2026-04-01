import { api } from '@/lib/axios';

const RULES_BASE = '/points-rules';

export interface PointsRule {
  id: string;
  createdByUserId: number;
  ruleType: 'earning' | 'conversion';
  targetRole: 'guest' | 'manager';
  action: string;
  pointsAmount: number;
  conversionRate?: number;
  currency: string;
  minPointsForConversion?: number;
  maxPointsPerPeriod: number;
  period?: string;
  multiplier: number;
  isDefault: boolean;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const pointsRulesApi = {
  getAll: () =>
    api.get<PointsRule[]>(RULES_BASE).then(r => r.data),

  getDefaults: () =>
    api.get<PointsRule[]>(`${RULES_BASE}/defaults`).then(r => r.data),

  getEarning: () =>
    api.get<PointsRule[]>(`${RULES_BASE}/earning`).then(r => r.data),

  getConversion: () =>
    api.get<PointsRule[]>(`${RULES_BASE}/conversion`).then(r => r.data),

  getByRole: (role: 'guest' | 'manager') =>
    api.get<PointsRule[]>(`${RULES_BASE}/role/${role}`).then(r => r.data),

  create: (data: Partial<PointsRule>) =>
    api.post<PointsRule>(RULES_BASE, data).then(r => r.data),

  update: (ruleId: string, data: Partial<PointsRule>) =>
    api.put<PointsRule>(`${RULES_BASE}/${ruleId}`, data).then(r => r.data),

  remove: (ruleId: string) =>
    api.delete(`${RULES_BASE}/${ruleId}`),
};
