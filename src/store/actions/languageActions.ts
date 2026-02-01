import { ILanguageOption } from '@/constants/i18n';
import { setLanguageCookie } from '@/services/IntlServices';
import { SET_LANGUAGE } from './actionTypes';

export interface ILanguageAction {
  type: typeof SET_LANGUAGE;
  payload: ILanguageOption;
}

/**
 * Action to set the current language
 * Also saves the preference to cookie
 */
export const setLanguage = (language: ILanguageOption): ILanguageAction => {
  setLanguageCookie(language);

  return {
    type: SET_LANGUAGE,
    payload: language
  };
};
