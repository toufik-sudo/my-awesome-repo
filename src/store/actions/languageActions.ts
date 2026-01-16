import { CR_COOKIE_LABEL } from 'constants/i18n';
import { ILanguageOption } from 'interfaces/store/actions/ILanguageActions';
import { IAction } from 'interfaces/store/IStore';
import { SET_LANGUAGE } from './actionTypes';
import Cookies from 'js-cookie';

export const setLanguage: (value: ILanguageOption) => IAction<ILanguageOption> = language => {
  Cookies.set(CR_COOKIE_LABEL, language.value);

  return {
    type: SET_LANGUAGE,
    payload: language
  };
};
