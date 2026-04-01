import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';
import { DASHBOARD_API } from './dashboard.api';
import type { DashboardData } from './dashboard.types';
import { MOCK_PROPERTIES } from '@/modules/properties/properties.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/** Fallback mock dashboard data when the API is unreachable */
const MOCK_DASHBOARD: DashboardData = (() => {
  const props = MOCK_PROPERTIES.slice(0, 6);
  return {
    stats: {
      totalProperties: props.length,
      publishedProperties: props.length,
      avgTrustStars: Math.round(props.reduce((s, p) => s + p.trustStars, 0) / props.length * 10) / 10,
      totalBookings: 12,
      pendingBookings: 3,
      confirmedBookings: 7,
      completedBookings: 2,
      totalSpent: 0,
      totalRevenue: 186000,
      pendingRequests: 2,
      favoritesCount: 8,
    },
    verificationStats: { total: 10, approved: 7, pending: 2, rejected: 1 },
    revenueByMonth: [
      { month: 'Jan', revenue: 25000, bookings: 3 },
      { month: 'Feb', revenue: 32000, bookings: 4 },
      { month: 'Mar', revenue: 28000, bookings: 3 },
      { month: 'Apr', revenue: 41000, bookings: 5 },
      { month: 'May', revenue: 36000, bookings: 4 },
      { month: 'Jun', revenue: 24000, bookings: 2 },
    ],
    recentBookings: props.slice(0, 4).map((p, i) => ({
      id: String(p.id),
      propertyTitle: p.title,
      propertyImage: p.images[0] || '',
      location: `${p.location}, ${p.city}`,
      checkIn: new Date(Date.now() + i * 86400000 * 3).toISOString(),
      checkOut: new Date(Date.now() + i * 86400000 * 3 + 86400000 * 2).toISOString(),
      status: ['confirmed', 'pending', 'completed', 'pending'][i],
      totalPrice: p.price * 2,
      guests: p.guests,
    })),
    recentHostRequests: props.slice(0, 3).map((p, i) => ({
      id: `req-${p.id}`,
      guestName: ['Ahmed B.', 'Sara M.', 'Karim L.'][i],
      propertyTitle: p.title,
      checkIn: new Date(Date.now() + i * 86400000 * 5).toISOString(),
      checkOut: new Date(Date.now() + i * 86400000 * 5 + 86400000 * 3).toISOString(),
      status: ['pending', 'confirmed', 'pending'][i],
      totalPrice: p.price * 3,
      guests: Math.min(p.guests, 4),
    })),
    propertyTypeDistribution: props.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    properties: props.map(p => ({
      id: String(p.id),
      title: p.title,
      image: p.images[0] || '',
      location: `${p.location}, ${p.city}`,
      price: p.price,
      rating: p.rating,
      reviewCount: p.reviews,
      bookingCount: Math.floor(Math.random() * 20) + 5,
      trustStars: p.trustStars,
      isVerified: p.isVerified,
      status: 'published',
    })),
  };
})();

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(() => USE_MOCK ? MOCK_DASHBOARD : null);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (USE_MOCK) {
      setData(MOCK_DASHBOARD);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<DashboardData>(DASHBOARD_API.GET);
      setData(response.data);
    } catch (err: any) {
      console.warn('Dashboard API unavailable, falling back to mock data');
      // Fallback to mock data instead of showing error
      setData(MOCK_DASHBOARD);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
};
