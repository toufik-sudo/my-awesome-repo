import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/constants/api.constants';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const deviceLang = Localization?.getLocales?.()?.[0]?.languageCode || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  longitude: deviceLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

/**
 * Load the persisted language from storage and apply it.
 * Call this once on app startup before rendering.
 */
export async function loadSavedLanguage(): Promise<void> {
  try {
    const saved = await SecureStore.getItemAsync(STORAGE_KEYS.LANGUAGE);
    if (saved && saved !== i18n.language) {
      await i18n.changeLanguage(saved);
    }
  } catch {
    // Storage unavailable — keep device default
  }
}

/**
 * Persist a language choice and switch i18next to it.
 */
export async function saveLanguage(langCode: string): Promise<void> {
  await i18n.changeLanguage(langCode);
  await SecureStore.setItemAsync(STORAGE_KEYS.LANGUAGE, langCode);
}

export default i18n;
