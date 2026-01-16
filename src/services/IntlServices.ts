import { createElement } from 'react';
import Cookies from 'js-cookie';

import { CR_COOKIE_LABEL, DEFAULT_LANGUAGE, EN_VALUE } from 'constants/i18n';
import { ILanguageOption } from 'interfaces/store/actions/ILanguageActions';
import { ExtendedNavigator } from 'interfaces/IGeneral';

/**
 * Method get browser language and return a trimmed version of it 'en-US' is returned 'en'
 *
 * NOTE: tested
 */
export const getBrowserLanguage = () => {
  const currentLanguage = window.navigator.language || (window.navigator as ExtendedNavigator).userLanguage || EN_VALUE;
  const trimmedLanguage = currentLanguage.split('-')[0];

  return trimmedLanguage;
};

/**
 * Method returns true if the browser language is available in the possible language options
 *
 * NOTE: tested
 */
export const getCurrentBrowserLanguage = (browserLanguage: string, languageOptions: ILanguageOption[]) => {
  const currentLanguage = Cookies.get(CR_COOKIE_LABEL) || browserLanguage;
  let selectedBrowserLanguage = languageOptions.find(language => language.value === currentLanguage);

  if (!selectedBrowserLanguage) {
    selectedBrowserLanguage = DEFAULT_LANGUAGE;
  }

  return selectedBrowserLanguage;
};

export const buildEmbbededHtmlPart = props => {
  const { tag, ...parentProps } = props;

  return (...chunks) => createElement(tag, { ...parentProps }, chunks);
};
