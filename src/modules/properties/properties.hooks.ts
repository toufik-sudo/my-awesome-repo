import { useQuery } from '@tanstack/react-query';
import { propertiesApi, type PropertyFilters } from './properties.api';
import { MOCK_PROPERTIES, type MockProperty } from './properties.mock';

/**
 * Normalises API response items to the same shape as MOCK_PROPERTIES
 * so the rest of the UI stays unchanged.
 */
const apiToMockShape = (p: any): MockProperty => ({
  id: Number(p.id) || 0,
  title: p.title ?? '',
  location: p.location?.address ?? p.location ?? '',
  city: p.location?.city ?? p.city ?? '',
  price: p.price ?? 0,
  rating: p.rating ?? 0,
  reviews: p.reviewCount ?? p.reviews ?? 0,
  type: p.propertyType ?? p.type ?? 'apartment',
  guests: p.guests ?? 0,
  bedrooms: p.bedrooms ?? 0,
  bathrooms: p.bathrooms ?? 0,
  amenities: p.amenities ?? [],
  images: p.images ?? [],
  badge: p.badge ?? null,
  superhost: p.superhost ?? false,
  lat: p.location?.lat ?? p.lat ?? 0,
  lng: p.location?.lng ?? p.lng ?? 0,
  trustStars: p.trustStars ?? 0,
  isVerified: p.isVerified ?? false,
  weeklyDiscount: p.weeklyDiscount ?? 0,
  monthlyDiscount: p.monthlyDiscount ?? 0,
});

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      try {
        const res = await propertiesApi.getAll(filters);
        if (res.data && res.data.length > 0) {
          return res.data.map(apiToMockShape);
        }
        // API returned empty — fall back to mock
        console.info('[properties] API returned empty, using mock data');
        return MOCK_PROPERTIES;
      } catch {
        console.info('[properties] API unavailable, using mock data');
        return MOCK_PROPERTIES;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 min
    retry: false, // don't retry — fall back immediately
  });
}
