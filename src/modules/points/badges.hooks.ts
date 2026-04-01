import { useState, useEffect, useCallback } from 'react';
import { badgesApi, type BadgeProgress, type UserBadge } from './badges.api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const MOCK_PROGRESS: BadgeProgress[] = [
  { badge: { id: '1', code: 'first_booking', name: { fr: 'Première réservation', en: 'First Booking', ar: 'أول حجز' }, description: { fr: 'Complétez votre première réservation', en: 'Complete your first booking', ar: 'أول حجز' }, icon: '🎯', category: 'booking', pointsThreshold: 0, actionRequired: 'booking_completed', actionCountRequired: 1, bonusPoints: 50, sortOrder: 1, isActive: true }, progress: 1, total: 1, unlocked: true },
  { badge: { id: '2', code: 'explorer_5', name: { fr: 'Explorateur', en: 'Explorer', ar: 'مستكشف' }, description: { fr: '5 réservations', en: '5 bookings', ar: '5 حجوزات' }, icon: '🧭', category: 'booking', pointsThreshold: 0, actionRequired: 'booking_completed', actionCountRequired: 5, bonusPoints: 100, sortOrder: 2, isActive: true }, progress: 3, total: 5, unlocked: false },
  { badge: { id: '3', code: 'reviewer', name: { fr: 'Critique', en: 'Reviewer', ar: 'مراجع' }, description: { fr: 'Premier avis', en: 'First review', ar: 'أول تقييم' }, icon: '📝', category: 'review', pointsThreshold: 0, actionRequired: 'review_submitted', actionCountRequired: 1, bonusPoints: 30, sortOrder: 4, isActive: true }, progress: 1, total: 1, unlocked: true },
  { badge: { id: '4', code: 'ambassador', name: { fr: 'Ambassadeur', en: 'Ambassador', ar: 'سفير' }, description: { fr: '5 parrainages', en: '5 referrals', ar: '5 إحالات' }, icon: '🤝', category: 'social', pointsThreshold: 0, actionRequired: 'referral_signup', actionCountRequired: 5, bonusPoints: 200, sortOrder: 6, isActive: true }, progress: 2, total: 5, unlocked: false },
  { badge: { id: '5', code: 'silver_tier', name: { fr: 'Membre Silver', en: 'Silver Member', ar: 'عضو فضي' }, description: { fr: '500 points', en: '500 points', ar: '500 نقطة' }, icon: '🥈', category: 'loyalty', pointsThreshold: 500, actionCountRequired: 0, bonusPoints: 50, sortOrder: 10, isActive: true }, progress: 500, total: 500, unlocked: true },
  { badge: { id: '6', code: 'gold_tier', name: { fr: 'Membre Gold', en: 'Gold Member', ar: 'عضو ذهبي' }, description: { fr: '1000 points', en: '1000 points', ar: '1000 نقطة' }, icon: '🥇', category: 'loyalty', pointsThreshold: 1000, actionCountRequired: 0, bonusPoints: 100, sortOrder: 11, isActive: true }, progress: 850, total: 1000, unlocked: false },
  { badge: { id: '7', code: 'platinum_tier', name: { fr: 'Membre Platinum', en: 'Platinum Member', ar: 'عضو بلاتيني' }, description: { fr: '2000 points', en: '2000 points', ar: '2000 نقطة' }, icon: '💎', category: 'loyalty', pointsThreshold: 2000, actionCountRequired: 0, bonusPoints: 200, sortOrder: 12, isActive: true }, progress: 850, total: 2000, unlocked: false },
  { badge: { id: '8', code: 'photographer', name: { fr: 'Photographe', en: 'Photographer', ar: 'مصور' }, description: { fr: '10 photos', en: '10 photos', ar: '10 صور' }, icon: '📸', category: 'achievement', pointsThreshold: 0, actionRequired: 'photo_upload', actionCountRequired: 10, bonusPoints: 50, sortOrder: 20, isActive: true }, progress: 4, total: 10, unlocked: false },
];

export function useBadgeProgress() {
  const [data, setData] = useState<BadgeProgress[]>(USE_MOCK ? MOCK_PROGRESS : []);
  const [loading, setLoading] = useState(!USE_MOCK);

  const fetch = useCallback(async () => {
    if (USE_MOCK) { setData(MOCK_PROGRESS); setLoading(false); return; }
    try {
      setLoading(true);
      setData(await badgesApi.getProgress());
    } catch {
      setData(MOCK_PROGRESS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useMyBadges() {
  const [data, setData] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(!USE_MOCK);

  const fetch = useCallback(async () => {
    if (USE_MOCK) { setLoading(false); return; }
    try {
      setLoading(true);
      setData(await badgesApi.getMine());
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}
