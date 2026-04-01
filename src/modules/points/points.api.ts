import { api } from '@/lib/axios';

const POINTS_BASE = '/points';

export interface PointsSummary {
  id: string;
  userId: number;
  totalPoints: number;
  availablePoints: number;
  spentPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  lifetimePoints: number;
  recentTransactions: PointTransaction[];
  nextTier: { tier: string; pointsNeeded: number } | null;
  tierProgress: number;
}

export interface PointTransaction {
  id: string;
  userId: number;
  action: string;
  points: number;
  type: 'earn' | 'spend' | 'bonus' | 'penalty';
  description: string;
  referenceId?: string;
  referenceType?: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: number;
  totalPoints: number;
  lifetimePoints: number;
  tier: string;
  user?: { firstName?: string; lastName?: string; email?: string };
}

export const pointsApi = {
  getMySummary: () =>
    api.get<PointsSummary>(`${POINTS_BASE}/me`).then(r => r.data),

  getMyTransactions: (page = 1, limit = 20) =>
    api.get<{ data: PointTransaction[]; total: number; page: number; totalPages: number }>(
      `${POINTS_BASE}/me/transactions`, { params: { page, limit } }
    ).then(r => r.data),

  getLeaderboard: (limit = 20) =>
    api.get<LeaderboardEntry[]>(`${POINTS_BASE}/leaderboard`, { params: { limit } }).then(r => r.data),

  adminAward: (userId: number, points: number, description: string) =>
    api.post(`${POINTS_BASE}/admin/award`, { userId, points, description }).then(r => r.data),

  adminDeduct: (userId: number, points: number, reason: string) =>
    api.post(`${POINTS_BASE}/admin/deduct`, { userId, points, reason }).then(r => r.data),

  getUserPoints: (userId: number) =>
    api.get<PointsSummary>(`${POINTS_BASE}/user/${userId}`).then(r => r.data),
};

export const TIER_CONFIG: Record<string, { label: string; color: string; icon: string; minPoints: number }> = {
  bronze: { label: 'Bronze', color: 'text-amber-700', icon: '🥉', minPoints: 0 },
  silver: { label: 'Silver', color: 'text-gray-400', icon: '🥈', minPoints: 500 },
  gold: { label: 'Gold', color: 'text-yellow-500', icon: '🥇', minPoints: 1000 },
  platinum: { label: 'Platinum', color: 'text-cyan-400', icon: '💎', minPoints: 2000 },
  diamond: { label: 'Diamond', color: 'text-violet-400', icon: '👑', minPoints: 5000 },
};

export const ACTION_LABELS: Record<string, { fr: string; en: string; ar: string }> = {
  booking_completed: { fr: 'Réservation complétée', en: 'Booking completed', ar: 'حجز مكتمل' },
  review_submitted: { fr: 'Avis soumis', en: 'Review submitted', ar: 'تقييم مقدم' },
  referral_signup: { fr: 'Parrainage', en: 'Referral signup', ar: 'تسجيل إحالة' },
  first_booking: { fr: 'Première réservation', en: 'First booking', ar: 'أول حجز' },
  profile_completed: { fr: 'Profil complété', en: 'Profile completed', ar: 'ملف مكتمل' },
  property_verified: { fr: 'Propriété vérifiée', en: 'Property verified', ar: 'عقار موثق' },
  service_created: { fr: 'Service créé', en: 'Service created', ar: 'خدمة مُنشأة' },
  five_star_review: { fr: 'Avis 5 étoiles reçu', en: '5-star review received', ar: 'تقييم 5 نجوم' },
  monthly_bonus: { fr: 'Bonus mensuel', en: 'Monthly bonus', ar: 'مكافأة شهرية' },
  event_participation: { fr: 'Participation événement', en: 'Event participation', ar: 'مشاركة في حدث' },
  photo_upload: { fr: 'Photo ajoutée', en: 'Photo uploaded', ar: 'صورة مرفوعة' },
  social_share: { fr: 'Partage social', en: 'Social share', ar: 'مشاركة اجتماعية' },
  loyalty_milestone: { fr: 'Palier fidélité', en: 'Loyalty milestone', ar: 'مرحلة ولاء' },
  admin_bonus: { fr: 'Bonus administrateur', en: 'Admin bonus', ar: 'مكافأة إدارية' },
  penalty: { fr: 'Pénalité', en: 'Penalty', ar: 'عقوبة' },
};
