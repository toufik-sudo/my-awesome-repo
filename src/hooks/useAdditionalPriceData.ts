import { PRICE_ORDER_ADDITIONAL } from 'constants/landing';
import { IArrayKey } from 'interfaces/IGeneral';
import { IStore } from 'interfaces/store/IStore';
import { useSelector } from 'react-redux';
import { mapPriceObjectToArray, processPriceDetailObject } from 'services/PriceServices';
import { processAdditionalPricingFields } from 'services/SectionsServices';

/**
 * Hook used to retrieve additional price data
 *
 * @Example INPUT: void, OUTPUT: [ { className: 'id', content: '2'}, { className: 'cta', content: 'international'} ]
 */
export const useAdditionalPriceData = () => {
  const priceData = useSelector(state => (state as IStore).landingReducer.pricingData);
  const processedFields = processAdditionalPricingFields(priceData);
  const priceAdditionalFields = processedFields.map(element => element.additionalOptions);
  const transformedPriceDetail = mapPriceObjectToArray<IArrayKey<any>[]>(priceAdditionalFields, PRICE_ORDER_ADDITIONAL);

  return transformedPriceDetail.map(priceData => priceData.map(priceDetail => processPriceDetailObject(priceDetail)));
};
