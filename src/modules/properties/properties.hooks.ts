import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { propertiesApi, type PropertyFilters } from './properties.api';
import { MOCK_PROPERTIES, type MockProperty } from './properties.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Normalises API response items to the same shape as MOCK_PROPERTIES
 * so the rest of the UI stays unchanged.
 */
const apiToMockShape = (p: any): MockProperty => ({
  id: p.id,
  title: p.title ?? '',
  location: p.location?.address ?? p.address ?? p.location ?? '',
  city: p.location?.city ?? p.city ?? '',
  price: p.pricePerNight ?? p.price ?? 0,
  rating: p.averageRating ?? p.rating ?? 0,
  reviews: p.reviewCount ?? p.reviews ?? 0,
  type: p.propertyType ?? p.type ?? 'apartment',
  country: p.location?.country ?? p.country ?? 'Algeria',
  guests: p.maxGuests ?? p.guests ?? 0,
  bedrooms: p.bedrooms ?? 0,
  bathrooms: p.bathrooms ?? 0,
  amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : (p.amenities ?? []),
  images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images ?? []),
  badge: p.badge ?? null,
  superhost: p.superhost ?? false,
  latitude: p.latitude ?? p.location?.latitude ?? 0,
  longitude: p.longitude ?? p.location?.longitude ?? 0,
  trustStars: p.trustStars ?? 0,
  isVerified: p.isVerified ?? false,
  weeklyDiscount: p.weeklyDiscount ?? 0,
  monthlyDiscount: p.monthlyDiscount ?? 0,
});

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      if (USE_MOCK) {
        console.info('[properties] Using mock data (VITE_USE_MOCK_DATA=true)');
        return MOCK_PROPERTIES;
      }
      try {
        const res = await propertiesApi.getAll(filters);
        if (res.data && res.data.length > 0) {
          return res.data.map(apiToMockShape);
        }
        console.info('[properties] API returned empty');
        return [];
      } catch {
        console.info('[properties] API unavailable');
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

/**
 * Infinite-scroll variant of useProperties.
 * Loads pages from the server (page=1,2,3...) and exposes a flat array
 * of normalized MockProperty items so the existing UI can keep filtering
 * and sorting client-side.
 */
export function usePropertiesInfinite(
  filters: Omit<PropertyFilters, 'page'> = {},
  pageSize = 20,
) {
  const query = useInfiniteQuery({
    queryKey: ['properties', 'infinite', { ...filters, limit: pageSize }],
    queryFn: async ({ pageParam = 1 }) => {
      if (USE_MOCK) {
        const start = (pageParam - 1) * pageSize;
        const slice = MOCK_PROPERTIES.slice(start, start + pageSize);
        return {
          data: slice,
          total: MOCK_PROPERTIES.length,
          page: pageParam,
          limit: pageSize,
          totalPages: Math.max(1, Math.ceil(MOCK_PROPERTIES.length / pageSize)),
        };
      }
      try {
        const res = await propertiesApi.getAll({ ...filters, page: pageParam, limit: pageSize });
        const items = (res?.data ?? []).map(apiToMockShape);
        const total = (res as any)?.total ?? items.length;
        const totalPages = (res as any)?.totalPages ?? Math.max(1, Math.ceil(total / pageSize));
        return { data: items, total, page: pageParam, limit: pageSize, totalPages };
      } catch {
        return { data: [], total: 0, page: pageParam, limit: pageSize, totalPages: 1 };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const items = useMemo<MockProperty[]>(
    () => (query.data?.pages ?? []).flatMap((p: any) => p.data),
    [query.data],
  );
  const total = query.data?.pages?.[0]?.total ?? items.length;

  return { ...query, items, total };
}
