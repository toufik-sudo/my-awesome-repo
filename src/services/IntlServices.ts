import { createElement, ReactNode } from 'react';
import Cookies from 'js-cookie';

import { 
  CR_COOKIE_LABEL, 
  DEFAULT_LANGUAGE, 
  EN_VALUE, 
  ILanguageOption, 
  LANGUAGE_OPTIONS 
} from '@/constants/i18n';

// Extended navigator interface for cross-browser compatibility
interface ExtendedNavigator extends Navigator {
  userLanguage?: string;
}

/**
 * Get browser language and return a trimmed version of it
 * 'en-US' is returned as 'en'
 */
export const getBrowserLanguage = (): string => {
  const currentLanguage = 
    window.navigator.language || 
    (window.navigator as ExtendedNavigator).userLanguage || 
    EN_VALUE;
  
  return currentLanguage.split('-')[0];
};

/**
 * Get current language from cookie or browser preference
 * Returns a matching language option or the default language
 */
export const getCurrentBrowserLanguage = (
  browserLanguage: string, 
  languageOptions: ILanguageOption[] = LANGUAGE_OPTIONS
): ILanguageOption => {
  const currentLanguage = Cookies.get(CR_COOKIE_LABEL) || browserLanguage;
  let selectedBrowserLanguage = languageOptions.find(
    language => language.value === currentLanguage
  );

  if (!selectedBrowserLanguage) {
    selectedBrowserLanguage = DEFAULT_LANGUAGE;
  }

  return selectedBrowserLanguage;
};

/**
 * Set language preference in cookie
 */
export const setLanguageCookie = (language: ILanguageOption): void => {
  Cookies.set(CR_COOKIE_LABEL, language.value, { expires: 365 });
};

/**
 * Get initial language based on cookie or browser detection
 */
export const getInitialLanguage = (): ILanguageOption => {
  return getCurrentBrowserLanguage(getBrowserLanguage());
};

/**
 * Build embedded HTML parts for react-intl messages
 * Allows rendering of HTML tags within translated strings
 */
export const buildEmbeddedHtmlPart = (props: { 
  tag: keyof JSX.IntrinsicElements; 
  [key: string]: unknown 
}) => {
  const { tag, ...parentProps } = props;
  return (...chunks: ReactNode[]) => createElement(tag, { ...parentProps }, chunks);
};
