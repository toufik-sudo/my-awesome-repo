import {
  DETAIL_NAME_NULL,
  DETAIL_NAME_VALUE,
  pricingObjectMock,
  processedPricingMock,
  transformPricingDifference
} from '__mocks__/pricingMocks';
import { CHECKED_LABEL, PRICE_ORDER, PRICE_ORDER_COLUMN_ORDER, UNCHECKED_LABEL } from 'constants/landing';
import {
  checkPricingDataValue,
  mapPriceObjectToArray,
  processPriceDetailObject,
  transformPriceObjectInArray
} from 'services/PriceServices';

describe('test transformPriceObjectInArray service function', () => {
  test('passing pricing object to transformPriceObjectInArray function should transform data accordingly', () => {
    const transformedMockedPricingData = transformPriceObjectInArray(PRICE_ORDER_COLUMN_ORDER, pricingObjectMock);
    expect(transformedMockedPricingData).toStrictEqual([
      ...transformPricingDifference,
      ...processedPricingMock,
      { cta: 5 },
      { id: '1' }
    ]);
  });
  test('passing pricing object without cta, pricing and name to transformPriceObjectInArray function should transform data accordingly', () => {
    const transformedMockedPricingData = transformPriceObjectInArray(PRICE_ORDER, pricingObjectMock);
    expect(transformedMockedPricingData).toStrictEqual(processedPricingMock);
  });
});

describe('test mapPriceObjectToArray service function', () => {
  test('passing pricing object to transformPriceObjectInArray function should transform data accordingly', () => {
    const mappedObjectToArray = mapPriceObjectToArray([pricingObjectMock], PRICE_ORDER_COLUMN_ORDER);
    expect(mappedObjectToArray).toStrictEqual([
      [...transformPricingDifference, ...processedPricingMock, { cta: 5 }, { id: '1' }]
    ]);
  });
});

describe('test processPriceDetailObject service function', () => {
  test('passing object detail as a boolean should output a className of a key and a value of available or unavailable', () => {
    const processedPricedDetailAvailable = processPriceDetailObject({ name: true });
    const processedPricedDetailUnavailable = processPriceDetailObject({ name: false });

    expect(processedPricedDetailAvailable).toStrictEqual({ className: 'name', content: CHECKED_LABEL });
    expect(processedPricedDetailUnavailable).toStrictEqual({ className: 'name', content: UNCHECKED_LABEL });
  });

  test('passing object detail as a null should output a className of a key and a value of "-"', () => {
    const processedPricedDetailNull = processPriceDetailObject({ name: null });

    expect(processedPricedDetailNull).toStrictEqual(DETAIL_NAME_NULL);
  });

  test('passing object detail as a null should output a className of a key and a value of "-"', () => {
    const processedPricedDetailNull = processPriceDetailObject({ name: null });

    expect(processedPricedDetailNull).toStrictEqual(DETAIL_NAME_NULL);
  });

  test('passing object detail as a value should output a className of a key and a value', () => {
    const processedPricedDetailNull = processPriceDetailObject({ name: 'name' });

    expect(processedPricedDetailNull).toStrictEqual(DETAIL_NAME_VALUE);
  });
});

describe('test checkPricingDataValue service function', () => {
  test('passing an boolean value to checkPricingDataValue should return the corresponding value', () => {
    const processedTruthyBooleanValue = checkPricingDataValue({}, true);

    expect(processedTruthyBooleanValue).toBe(CHECKED_LABEL);
  });
});
