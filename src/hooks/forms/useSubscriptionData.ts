import { useEffect, useState, useMemo } from 'react';
import { platformsApi } from '@/api/PlatformsApi';
import type { IPlatformType } from '@/api/types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  stripePriceId?: string;
}

export interface SubscriptionDataResult {
  /** Whether pricing data is loading */
  isLoading: boolean;
  /** Array of available pricing plans */
  pricingData: PricingPlan[];
  /** Index of the initially selected/active slide */
  initialSlide: number;
  /** Function to set the active slide index */
  setActiveSlide: (index: number) => void;
  /** Currently selected plan based on active slide */
  selectedPlan: PricingPlan | null;
}

export interface UseSubscriptionDataOptions {
  /** Whether to fetch pricing data on mount */
  autoFetch?: boolean;
  /** Platform ID to filter pricing for */
  platformId?: string;
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Determines the initial slide index based on platform or default logic
 */
const getInitialSlide = (
  plans: PricingPlan[],
  platformId?: string
): number => {
  if (!plans.length) return 0;

  // Find popular plan first
  const popularIndex = plans.findIndex((plan) => plan.isPopular);
  if (popularIndex >= 0) return popularIndex;

  // Default to middle plan for better UX
  return Math.floor(plans.length / 2);
};

/**
 * Transform API platform types to PricingPlan format
 * The API may return additional fields beyond the TypeScript interface
 */
const transformPlatformTypeToPricingPlan = (platformType: IPlatformType & Record<string, unknown>): PricingPlan => {
  return {
    id: String(platformType.id),
    name: platformType.name || (platformType as any).label || 'Unknown Plan',
    price: platformType.price || 0,
    currency: (platformType as any).currency || 'EUR',
    interval: 'month',
    features: platformType.features || [],
    isPopular: (platformType as any).isPopular || (platformType as any).recommended || false,
    stripePriceId: (platformType as any).stripePriceId,
  };
};

// -----------------------------------------------------------------------------
// Hook Implementation
// -----------------------------------------------------------------------------

/**
 * Hook to manage subscription pricing data and selection state
 * 
 * @example
 * ```tsx
 * const { pricingData, selectedPlan, setActiveSlide } = useSubscriptionData({
 *   autoFetch: true,
 *   platformId: currentPlatform.id
 * });
 * ```
 */
export const useSubscriptionData = ({
  autoFetch = true,
  platformId,
}: UseSubscriptionDataOptions = {}): SubscriptionDataResult => {
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [pricingData, setPricingData] = useState<PricingPlan[]>([]);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Fetch pricing data
  useEffect(() => {
    if (!autoFetch) return;

    const fetchPricing = async () => {
      setIsLoading(true);
      try {
        const platformTypes = await platformsApi.getPlatformTypes();
        const transformedPlans = platformTypes.map(transformPlatformTypeToPricingPlan);
        setPricingData(transformedPlans);
      } catch (error) {
        console.error('Failed to fetch pricing data:', error);
        setPricingData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, [autoFetch, platformId]);

  // Set initial slide when pricing data loads
  useEffect(() => {
    if (pricingData.length > 0) {
      const initialIndex = getInitialSlide(pricingData, platformId);
      setActiveSlide(initialIndex);
    }
  }, [pricingData, platformId]);

  // Memoize selected plan
  const selectedPlan = useMemo(() => {
    if (!pricingData.length || activeSlide < 0 || activeSlide >= pricingData.length) {
      return null;
    }
    return pricingData[activeSlide];
  }, [pricingData, activeSlide]);

  return {
    isLoading,
    pricingData,
    initialSlide: activeSlide,
    setActiveSlide,
    selectedPlan,
  };
};

export default useSubscriptionData;
