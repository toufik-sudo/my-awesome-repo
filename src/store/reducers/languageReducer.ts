import { AnyAction } from 'redux';
import { SET_LANGUAGE } from '../actions/actionTypes';
import { 
  ILanguageReducer, 
  initialLanguageState, 
  getMessagesForLanguage 
} from '../initialState/initialLanguageState';

/**
 * Language reducer - manages i18n translations
 */
const languageReducer = (
  state: ILanguageReducer = initialLanguageState, 
  action: AnyAction
): ILanguageReducer => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        selectedLanguage: action.payload,
        messages: getMessagesForLanguage(action.payload.value)
      };
    default:
      return state;
  }
};

export default languageReducer;
