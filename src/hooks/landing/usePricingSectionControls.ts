import { usePriceData } from 'hooks/usePriceData';
import { useAdditionalPriceData } from 'hooks/useAdditionalPriceData';
import { useAdditionalToggle } from 'hooks/useAdditionalToggle';
import { useDispatch } from 'react-redux';
import { setModalState } from 'store/actions/modalActions';
import { RESELLER_MODAL } from 'constants/modal';

/**
 * Hook used to bootstrap all pricing section logic
 */
export const usePricingSectionControls = () => {
  const { pricingData, isLoading } = usePriceData();
  const pricingAdditionalData = useAdditionalPriceData();
  const { additionalVisible, toggleAdditionalPricing } = useAdditionalToggle();
  const dispatch = useDispatch();
  const openResellerModal = () => dispatch(setModalState(true, RESELLER_MODAL));

  return {
    pricingData,
    isLoading,
    pricingAdditionalData,
    additionalVisible,
    toggleAdditionalPricing,
    openResellerModal
  };
};
