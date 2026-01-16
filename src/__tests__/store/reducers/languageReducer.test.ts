import { SET_LANGUAGE } from 'store/actions/actionTypes';
import { DEFAULT_LANGUAGE } from 'constants/i18n';
import languageReducer from 'store/reducers/languageReducer';
import { initialLanguage } from 'store/initialState/intitialLanguageState';
import { FR_LANGUAGE, languageStateMock } from '__mocks__/intlMocks';

describe('language reducer test cases', () => {
  test('dispatching set language with the default language should make the language the default one', () => {
    const action = { type: SET_LANGUAGE, payload: DEFAULT_LANGUAGE };

    expect(languageReducer(initialLanguage, action)).toEqual(initialLanguage);
  });

  test('dispatching set language with a mocked language should make the language the corresponding one', () => {
    const action = { type: SET_LANGUAGE, payload: FR_LANGUAGE };

    expect(languageReducer(initialLanguage, action)).toEqual(languageStateMock);
  });
});
