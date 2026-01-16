import { USER_COOKIE_FIELDS } from 'constants/general';
import { ID, INITIAL_SLIDE } from 'constants/landing';
import { IReactIntl } from 'interfaces/IGeneral';
import { getUserCookie } from 'utils/general';

/**
 * Method filters messages based on a start
 *
 * @param messages
 * @param start
 */
export const processTranslations = (messages: IReactIntl, start: string) => {
  return Object.keys(messages).filter(key => key.startsWith(start));
};

/**
 * Method returns current active slide from cookie
 *
 * @param pricingData
 * @param selectedPlatform
 */
export const getInitialSlide = (pricingData, selectedPlatform?) => {
  let currentIndex = INITIAL_SLIDE;
  let platformTypeId = getUserCookie(USER_COOKIE_FIELDS.PLATFORM_TYPE_ID);
  if (!platformTypeId) {
    platformTypeId = (selectedPlatform && selectedPlatform.platformType && selectedPlatform.platformType.id) || null;
  }

  if (!pricingData.length) {
    return currentIndex;
  }

  pricingData.forEach((data, index) => {
    data.forEach(element => {
      if (element.className === ID && element.content === platformTypeId) {
        currentIndex = index;

        return;
      }
    });
  });

  return currentIndex;
};
