import { filterPlan, mapPriceObjectToArray, processPriceDetailObject } from 'services/PriceServices';
import { IPriceObject } from 'interfaces/containers/ILandingPricingContainer';
import { PRICE_ORDER_COLUMN_ORDER } from 'constants/landing';

/**
 * Method returns the frequencies of payment data of the current plan
 *
 * @param initialSlide
 * @param pricingData
 * @param className
 */
export const getCurrentFrequenciesOfPayment = (initialSlide, pricingData, className) => {
  let frequenciesData = [];

  if (pricingData.length && initialSlide) {
    frequenciesData = pricingData[initialSlide].find(element => element.className === className).content;
  }

  return frequenciesData;
};

/**
 * Method returns the processed pricing data
 */
export const getTransformedPricingData: (data, shouldFilter) => any = data => {
  const filteredPriceDetail = filterPlan(data);
  const transformedPriceDetail = mapPriceObjectToArray<IPriceObject>(filteredPriceDetail, PRICE_ORDER_COLUMN_ORDER);

  return transformedPriceDetail.map(priceData => priceData.map(priceDetail => processPriceDetailObject(priceDetail)));
};
