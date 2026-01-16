import { setLanguage } from 'store/actions/languageActions';
import { DEFAULT_LANGUAGE } from 'constants/i18n';
import { setLanguageActionReturn } from '__mocks__/intlMocks';

describe('language actions test cases', () => {
  test('calling setLanguage with a language should return the corresponding action + payload', () => {
    const actionResult = setLanguage(DEFAULT_LANGUAGE);
    expect(actionResult).toStrictEqual(setLanguageActionReturn);
  });
});
