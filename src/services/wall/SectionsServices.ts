import { OBJECT } from '@/constants/validation';

type IReactIntl = Record<string, string>;

/**
 * Method filters messages based on a start/end
 *
 * @param messages
 * @param start
 * @param end
 */
export const processTranslations = (messages: IReactIntl, start: string, end?: string): string[] => {
  return Object.keys(messages).filter(key => {
    if (!end) return key.startsWith(start);

    return key.startsWith(start) && !key.endsWith(end);
  });
};

/**
 * Method remove empty spaces on content from pricing element
 *
 * @param pricingElement
 */
export const processPricingClass = (pricingElement: any[]): void => {
  if (typeof pricingElement[0] === OBJECT) {
    pricingElement[0].content.replace(/\s/g, '');
  }
};

/**
 * Method used to add to additional options object cta and name
 *
 * @param priceData
 */
export const processAdditionalPricingFields = (priceData: any[]): any[] =>
  priceData.map(element => {
    const { additionalOptions, name, cta, id } = element;

    return { ...element, additionalOptions: { ...additionalOptions, name, cta, id } };
  });
