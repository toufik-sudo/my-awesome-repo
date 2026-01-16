import { getBrowserLanguage, getCurrentBrowserLanguage } from 'services/IntlServices';
import { DEFAULT_LANGUAGE, EN_VALUE } from 'constants/i18n';

describe('getBrowserLanguage function test', () => {
  test('if no browser language is present a default en language is selected', () => {
    const defaultLanguage = getBrowserLanguage();

    expect(defaultLanguage).toBe(EN_VALUE);
  });
});

describe('getCurrentBrowserLanguage function test', () => {
  test("if the selected language isn't available in the languageOptions object, a default en is chosen", () => {
    const selectedLanguage = getCurrentBrowserLanguage('md', []);

    expect(selectedLanguage).toBe(DEFAULT_LANGUAGE);
  });

  test('if the selected language is present in the languageOptions object, the language is returned', () => {
    const selectedLanguage = getCurrentBrowserLanguage(EN_VALUE, [DEFAULT_LANGUAGE]);

    expect(selectedLanguage).toBe(DEFAULT_LANGUAGE);
  });
});
