import { useState, useEffect, useCallback } from 'react';
import { pointsApi, type PointsSummary, type PointTransaction, type LeaderboardEntry } from './points.api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const MOCK_SUMMARY: PointsSummary = {
  id: 'mock-1',
  userId: 1,
  totalPoints: 1250,
  availablePoints: 850,
  spentPoints: 400,
  tier: 'gold',
  lifetimePoints: 1250,
  recentTransactions: [
    { id: 't1', userId: 1, action: 'booking_completed', points: 50, type: 'earn', description: 'Réservation complétée', createdAt: new Date().toISOString() },
    { id: 't2', userId: 1, action: 'review_submitted', points: 20, type: 'earn', description: 'Avis soumis', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 't3', userId: 1, action: 'referral_signup', points: 100, type: 'earn', description: 'Parrainage réussi', createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 't4', userId: 1, action: 'five_star_review', points: 30, type: 'earn', description: 'Avis 5 étoiles reçu', createdAt: new Date(Date.now() - 259200000).toISOString() },
    { id: 't5', userId: 1, action: 'first_booking', points: 75, type: 'bonus', description: 'Première réservation', createdAt: new Date(Date.now() - 345600000).toISOString() },
  ],
  nextTier: { tier: 'platinum', pointsNeeded: 750 },
  tierProgress: 50,
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'l1', userId: 1, totalPoints: 3200, lifetimePoints: 3200, tier: 'platinum', user: { firstName: 'Ahmed', lastName: 'B.' } },
  { id: 'l2', userId: 2, totalPoints: 2800, lifetimePoints: 2800, tier: 'platinum', user: { firstName: 'Sara', lastName: 'M.' } },
  { id: 'l3', userId: 3, totalPoints: 1500, lifetimePoints: 1500, tier: 'gold', user: { firstName: 'Karim', lastName: 'L.' } },
  { id: 'l4', userId: 4, totalPoints: 950, lifetimePoints: 950, tier: 'silver', user: { firstName: 'Amina', lastName: 'D.' } },
  { id: 'l5', userId: 5, totalPoints: 700, lifetimePoints: 700, tier: 'silver', user: { firstName: 'Yacine', lastName: 'H.' } },
];

export function usePointsSummary() {
  const [data, setData] = useState<PointsSummary | null>(USE_MOCK ? MOCK_SUMMARY : null);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (USE_MOCK) { setData(MOCK_SUMMARY); setLoading(false); return; }
    try {
      setLoading(true);
      const result = await pointsApi.getMySummary();
      setData(result);
    } catch {
      setData(MOCK_SUMMARY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

export function useLeaderboard(limit = 20) {
  const [data, setData] = useState<LeaderboardEntry[]>(USE_MOCK ? MOCK_LEADERBOARD : []);
  const [loading, setLoading] = useState(!USE_MOCK);

  const fetch = useCallback(async () => {
    if (USE_MOCK) { setData(MOCK_LEADERBOARD); setLoading(false); return; }
    try {
      setLoading(true);
      const result = await pointsApi.getLeaderboard(limit);
      setData(result);
    } catch {
      setData(MOCK_LEADERBOARD);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function usePointsTransactions(limit = 20) {
  const [data, setData] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    if (USE_MOCK) {
      setData(MOCK_SUMMARY.recentTransactions);
      setTotalPages(1);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const result = await pointsApi.getMyTransactions(page, limit);
      setData(result.data);
      setTotalPages(result.totalPages);
    } catch {
      setData(MOCK_SUMMARY.recentTransactions);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, page, setPage, totalPages, refetch: fetchData };
}
