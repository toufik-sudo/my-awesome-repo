import { EN_VALUE, ILanguageOption } from '@/constants/i18n';
import { getInitialLanguage } from '@/services/IntlServices';

// Import language files
import enMessages from '@/intl/languages/en.json';
import frMessages from '@/intl/languages/fr.json';
import deMessages from '@/intl/languages/de.json';
import esMessages from '@/intl/languages/es.json';

export interface ILanguageReducer {
  selectedLanguage: ILanguageOption;
  messages: Record<string, string>;
}

// Map of language values to message objects
const messageMap: Record<string, Record<string, string>> = {
  en: enMessages,
  fr: frMessages,
  de: deMessages,
  es: esMessages
};

/**
 * Get messages for a given language
 */
export const getMessagesForLanguage = (languageValue: string): Record<string, string> => {
  return messageMap[languageValue] || messageMap[EN_VALUE];
};

const currentLanguage = getInitialLanguage();

export const initialLanguageState: ILanguageReducer = {
  selectedLanguage: currentLanguage,
  messages: getMessagesForLanguage(currentLanguage.value)
};
