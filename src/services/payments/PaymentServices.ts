// -----------------------------------------------------------------------------
// Payment Services
// Migrated from old_app/src/services/PaymentServices.ts
// -----------------------------------------------------------------------------

import { getUserCookie } from '@/utils/general';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const INITIAL_SLIDE = 0;
const ID_CLASS_NAME = 'id';
const USER_COOKIE_PLATFORM_TYPE_ID = 'platformTypeId';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PricingSlideElement {
  className: string;
  content: string | number;
  [key: string]: unknown;
}

export interface SelectedPlatform {
  id?: string | number;
  platformType?: {
    id?: string | number;
  };
  [key: string]: unknown;
}

// -----------------------------------------------------------------------------
// Translation Processing
// -----------------------------------------------------------------------------

/**
 * Filters i18n messages by key prefix
 * 
 * @param messages - Object containing all i18n messages
 * @param prefix - Key prefix to filter by
 * @returns Array of matching message keys
 * 
 * @example
 * ```ts
 * const pricingKeys = filterMessagesByPrefix(messages, 'pricing.');
 * // Returns: ['pricing.basic', 'pricing.pro', 'pricing.enterprise']
 * ```
 */
export const filterMessagesByPrefix = (
  messages: Record<string, string>,
  prefix: string
): string[] => {
  return Object.keys(messages).filter((key) => key.startsWith(prefix));
};

/**
 * @deprecated Use filterMessagesByPrefix instead
 */
export const processTranslations = filterMessagesByPrefix;

// -----------------------------------------------------------------------------
// Pricing Slide Selection
// -----------------------------------------------------------------------------

/**
 * Determines the initial slide index for pricing carousel
 * Based on user's platform type from cookie or selected platform
 * 
 * @param pricingData - Array of pricing slide data
 * @param selectedPlatform - Currently selected platform (optional)
 * @returns Index of the slide to show initially
 * 
 * @example
 * ```ts
 * const initialIndex = getInitialPricingSlide(pricingData, currentPlatform);
 * ```
 */
export const getInitialPricingSlide = (
  pricingData: PricingSlideElement[][],
  selectedPlatform?: SelectedPlatform
): number => {
  let currentIndex = INITIAL_SLIDE;

  // Try to get platform type ID from cookie first, then from selected platform
  let platformTypeId: string | number | null = getUserCookie(USER_COOKIE_PLATFORM_TYPE_ID);
  
  if (!platformTypeId && selectedPlatform?.platformType?.id) {
    platformTypeId = selectedPlatform.platformType.id;
  }

  if (!pricingData?.length || !platformTypeId) {
    return currentIndex;
  }

  // Find the slide matching the platform type
  pricingData.forEach((slideData, index) => {
    slideData.forEach((element) => {
      if (element.className === ID_CLASS_NAME && element.content === platformTypeId) {
        currentIndex = index;
      }
    });
  });

  return currentIndex;
};

/**
 * @deprecated Use getInitialPricingSlide instead
 */
export const getInitialSlide = getInitialPricingSlide;

// -----------------------------------------------------------------------------
// Price Formatting
// -----------------------------------------------------------------------------

/**
 * Formats a price value with currency symbol
 * 
 * @param amount - Numeric price amount
 * @param currency - Currency code (EUR, USD, etc.)
 * @param locale - Locale for formatting (default: 'fr-FR')
 * @returns Formatted price string
 */
export const formatPrice = (
  amount: number,
  currency: string = 'EUR',
  locale: string = 'fr-FR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculates discounted price
 * 
 * @param originalPrice - Original price
 * @param discountPercent - Discount percentage (0-100)
 * @returns Discounted price
 */
export const calculateDiscount = (
  originalPrice: number,
  discountPercent: number
): number => {
  return originalPrice * (1 - discountPercent / 100);
};

/**
 * Converts monthly price to annual with optional discount
 * 
 * @param monthlyPrice - Price per month
 * @param annualDiscount - Discount percentage for annual billing
 * @returns Annual price with discount applied
 */
export const getAnnualPrice = (
  monthlyPrice: number,
  annualDiscount: number = 0
): number => {
  const annualTotal = monthlyPrice * 12;
  return calculateDiscount(annualTotal, annualDiscount);
};
