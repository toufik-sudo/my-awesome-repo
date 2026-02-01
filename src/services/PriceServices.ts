// -----------------------------------------------------------------------------
// Price Services
// Migrated from old_app/src/services/PriceServices.ts
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface IPriceObject {
  id: number;
  name: string;
  price?: number;
  [key: string]: unknown;
}

export type TDynamicType = string | number | boolean | null | undefined;

export interface ProcessedPriceDetail {
  className: string;
  content: TDynamicType;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const BOOLEAN = 'boolean';
const NAME = 'name';
const ID = 'id';
const FREEMIUM = 'freemium';

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Get first key from object
 */
const getObjectKey = (obj: Record<string, unknown>): string => {
  return Object.keys(obj)[0] || '';
};

/**
 * Get first value from object
 */
const getObjectValue = (obj: Record<string, unknown>): unknown => {
  return Object.values(obj)[0];
};

// -----------------------------------------------------------------------------
// Exported Functions
// -----------------------------------------------------------------------------

/**
 * Transform price object to array format
 */
export const transformPriceObjectInArray = (
  priceOrder: string[], 
  pricingElement: IPriceObject
): Record<string, unknown>[] => {
  return priceOrder.map((label: string) => ({ [label]: pricingElement[label] }));
};

/**
 * Map all prices into array of objects for slider
 */
export const mapPriceObjectToArray = <T extends IPriceObject>(
  pricingData: T[], 
  types: string[]
): Record<string, unknown>[][] => {
  return pricingData.map(pricingElement => transformPriceObjectInArray(types, pricingElement));
};

/**
 * Check pricing data value and return formatted content
 */
export const checkPricingDataValue = (
  detail: Record<string, unknown>, 
  detailValue: unknown
): TDynamicType => {
  if (typeof detailValue === BOOLEAN) {
    return detailValue ? 'CHECKED' : 'UNCHECKED';
  }

  if (detailValue === null) {
    return '-';
  }

  return detailValue as TDynamicType;
};

/**
 * Process price detail object
 */
export const processPriceDetailObject = (
  detail: Record<string, unknown>
): ProcessedPriceDetail => {
  const detailKey = getObjectKey(detail);
  const detailValue = getObjectValue(detail);

  return { 
    className: detailKey, 
    content: checkPricingDataValue(detail, detailValue) 
  };
};

/**
 * Get pricing plan type from element
 */
export const getPlanType = (
  pricingElement: Array<{ className: string; content: unknown }>
): { name?: unknown; id?: unknown } => {
  const platform: { name?: unknown; id?: unknown } = {};

  pricingElement.forEach(element => {
    if (element.className === NAME) {
      platform.name = element.content;
    }

    if (element.className === ID) {
      platform.id = element.content;
    }
  });

  return platform;
};

/**
 * Filter a plan (placeholder - extend as needed)
 */
export const filterPlan = <T>(data: T): T => {
  return data;
};

/**
 * Get freemium plan ID from pricing data
 */
export const getFreemiumPlanId = (pricingData: IPriceObject[] = []): number | undefined => {
  const freemiumPlan = pricingData.find(data => data.name === FREEMIUM);
  return freemiumPlan?.id;
};
