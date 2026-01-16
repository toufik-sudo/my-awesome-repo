import { EN_VALUE, LANGUAGE_OPTIONS } from 'constants/i18n';
import { ILanguageReducer } from 'interfaces/store/IStore';
import { getBrowserLanguage, getCurrentBrowserLanguage } from 'services/IntlServices';

const currentLanguage = getCurrentBrowserLanguage(getBrowserLanguage(), LANGUAGE_OPTIONS);

export const initialLanguage: ILanguageReducer = {
  selectedLanguage: currentLanguage,
  messages: require(`../../intl/languages/${currentLanguage.value || EN_VALUE}`)
};
