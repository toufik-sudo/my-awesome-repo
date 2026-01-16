import { BOOLEAN, NAME } from 'constants/general';
import { ID } from 'constants/landing';
import { FREEMIUM } from 'constants/routes';
import { IPriceObject } from 'interfaces/containers/ILandingPricingContainer';
import { IArrayKey, TDynamicObject, TDynamicType } from 'interfaces/IGeneral';
import { getObjectKey, getObjectValue } from 'utils/general';

/**
 * Method returns the element if the index is on the order price
 *
 * @param priceOrder
 * @param pricingElement
 * NOTE: tested
 */
export const transformPriceObjectInArray = (priceOrder: string[], pricingElement: IPriceObject) => {
  return priceOrder.map((label: string) => ({ [label]: (pricingElement as any)[label] }));
};

/**
 * Method maps all price into an array of object to be used to map into Slider
 *
 * @param pricingData
 * @param types
 * NOTE: tested
 */
export const mapPriceObjectToArray: <Type>(pricingData: Type, types) => TDynamicObject[] = (pricingData, types) => {
  // @ts-ignore - Used because the Type is not recognized as Array type
  return pricingData.map((pricingElement: IPriceObject) => transformPriceObjectInArray(types, pricingElement));
};

/**
 * Method transform detail object based on it's value and output a value and a className
 *
 * @param detail
 * NOTE: tested
 */
export const processPriceDetailObject = (detail: IArrayKey<string>) => {
  const detailKey = getObjectKey(detail);
  const detailValue = getObjectValue(detail);
  const priceDetailOutput = { className: detailKey };

  return { ...priceDetailOutput, content: checkPricingDataValue(detail, detailValue) };
};

/**
 * Method returns a string based on the value type (boolean | null)
 *
 * @param detail
 * @param detailValue
 */
export const checkPricingDataValue = (detail: IArrayKey<string>, detailValue: TDynamicType) => {
  let content: TDynamicType = detailValue;

  if (typeof detailValue === BOOLEAN) {
    if (detailValue) {
      content = 'CHECKED';
    } else {
      content = 'UNCHECKED';
    }
  }

  if (detailValue === null) {
    content = '-';
  }

  return content;
};

/**
 * Method returns the pricing plan type
 *
 * @param pricingElement
 */
export const getPlanType = pricingElement => {
  const platform = {};

  pricingElement.forEach(element => {
    if (element.className === NAME) {
      platform[NAME] = element.content;
    }

    if (element.className === ID) {
      platform[ID] = element.content;
    }
  });

  return platform;
};

/**
 * Filter a plan and return data
 *
 * @param data
 */
export const filterPlan = data => {
  return data;
};

/**
 * Returns the id of the freemium pricing plan, if found in given pricing data.
 *
 * @param pricingData
 */
export const getFreemiumPlanId = (pricingData: Array<any> = []): number | undefined => {
  const freemiumPlan = pricingData.find(data => data.name === FREEMIUM);

  if (freemiumPlan) {
    return freemiumPlan.id;
  }
};
