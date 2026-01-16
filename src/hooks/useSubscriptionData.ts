import { useEffect, useState } from 'react';

import { usePriceData } from 'hooks/usePriceData';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { getInitialSlide } from 'services/PaymentServices';

/**
 * Hook used to set the data for the subscription section
 */
export const useSubscriptionData = () => {
  const { pricingData, isLoading } = usePriceData(true);
  const [initialSlide, setActiveSlide] = useState<any>(false);
  const { selectedPlatform } = useWallSelection();

  useEffect(() => {
    if (pricingData.length) setActiveSlide(getInitialSlide(pricingData, selectedPlatform));
  }, [pricingData]);

  return { isLoading, initialSlide, pricingData, setActiveSlide };
};
