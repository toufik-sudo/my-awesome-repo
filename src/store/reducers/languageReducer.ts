import { ILanguageReducer } from 'interfaces/store/IStore';
import { AnyAction } from 'redux';
import { SET_LANGUAGE } from '../actions/actionTypes';
import { initialLanguage } from '../initialState/intitialLanguageState';

/**
 * Language reducer -> manages i18n translations
 *
 * @param state
 * @param action
 */
export default (state: ILanguageReducer = initialLanguage, action: AnyAction) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        selectedLanguage: action.payload,
        messages: require(`../../intl/languages/${action.payload.value}`)
      };
    default:
      return state;
  }
};
