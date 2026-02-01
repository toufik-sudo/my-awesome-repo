import { filterPlan, mapPriceObjectToArray, processPriceDetailObject, IPriceObject as BasePriceObject } from '@/services/PriceServices';
import { PRICE_ORDER_COLUMN_ORDER } from '@/constants/landing';

export interface IPriceObject extends BasePriceObject {
  price?: number;
  cta?: string;
  className?: string;
  content?: any[];
  [key: string]: any;
}

/**
 * Method returns the frequencies of payment data of the current plan
 *
 * @param initialSlide
 * @param pricingData
 * @param className
 */
export const getCurrentFrequenciesOfPayment = (
  initialSlide: number,
  pricingData: any[][],
  className: string
): any[] => {
  let frequenciesData: any[] = [];

  if (pricingData.length && initialSlide !== undefined) {
    const slideData = pricingData[initialSlide];
    if (slideData) {
      const element = slideData.find(element => element.className === className);
      if (element) {
        frequenciesData = element.content || [];
      }
    }
  }

  return frequenciesData;
};

/**
 * Method returns the processed pricing data
 * @param data - Raw pricing data
 */
export const getTransformedPricingData = (data: any): any[][] => {
  const filteredPriceDetail = filterPlan(data);
  const transformedPriceDetail = mapPriceObjectToArray<IPriceObject>(filteredPriceDetail, PRICE_ORDER_COLUMN_ORDER);

  return transformedPriceDetail.map(priceData => 
    priceData.map(priceDetail => processPriceDetailObject(priceDetail))
  );
};

/**
 * Method to get pricing plan by id
 * @param pricingData - Array of pricing plans
 * @param planId - ID of the plan to find
 */
export const getPricingPlanById = (pricingData: any[], planId: number): any | undefined => {
  return pricingData.find(plan => plan.id === planId);
};

/**
 * Method to calculate plan price based on frequency
 * @param basePrice - Base price of the plan
 * @param frequency - Payment frequency (monthly, yearly, etc.)
 */
export const calculatePlanPrice = (basePrice: number, frequency: string): number => {
  const frequencyMultipliers: Record<string, number> = {
    monthly: 1,
    quarterly: 3,
    yearly: 12
  };

  const multiplier = frequencyMultipliers[frequency] || 1;
  return basePrice * multiplier;
};
