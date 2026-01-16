import { PRICING_BLOCK_TYPES, PRICING_DATA_ANIMATION_CONFIG } from 'constants/landing';
import { useState } from 'react';
import { scroller } from 'react-scroll/modules';

/**
 * Hook used to toggle additional toggle and animate scroll based on the current target
 */
export const useAdditionalToggle = () => {
  const [additionalVisible, setAdditional] = useState(false);

  const setAdditionalPromise = () =>
    new Promise(res => {
      setAdditional(!additionalVisible);
      res({});
    });

  const toggleAdditionalPricing = async () => {
    let target = PRICING_BLOCK_TYPES.ADDITIONAL;
    if (additionalVisible) {
      target = PRICING_BLOCK_TYPES.BASE;
    }
    await setAdditionalPromise();

    scroller.scrollTo(target, PRICING_DATA_ANIMATION_CONFIG);
  };

  return { toggleAdditionalPricing, additionalVisible };
};
