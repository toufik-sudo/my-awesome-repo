// Language labels
export const EN_LABEL = 'English';
export const FR_LABEL = 'Français';
export const DE_LABEL = 'Deutsch';
export const ES_LABEL = 'Español';

// Language values
export const EN_VALUE = 'en';
export const FR_VALUE = 'fr';
export const DE_VALUE = 'de';
export const ES_VALUE = 'es';

// Cookie label for storing language preference
export const CR_COOKIE_LABEL = 'crLanguage';

// Language option interface
export interface ILanguageOption {
  value: string;
  label: string;
  description?: string;
  shortLabel?: string;
}

// Alias for cleaner imports
export type LanguageOption = ILanguageOption;

// Default language
export const DEFAULT_LANGUAGE: ILanguageOption = { 
  value: EN_VALUE, 
  label: EN_LABEL,
  description: 'English (US)',
  shortLabel: 'EN',
};

// Available language options
export const LANGUAGE_OPTIONS: ILanguageOption[] = [
  DEFAULT_LANGUAGE,
  { value: FR_VALUE, label: FR_LABEL, description: 'French', shortLabel: 'FR' },
  { value: DE_VALUE, label: DE_LABEL, description: 'German', shortLabel: 'DE' },
  { value: ES_VALUE, label: ES_LABEL, description: 'Spanish', shortLabel: 'ES' },
];

// Zone constants
export const ZONE_EUROPE = 'Europe';
export const ZONE_US = 'US';

export const ZONE_OPTIONS = [
  { value: ZONE_EUROPE, label: ZONE_EUROPE },
  { value: ZONE_US, label: ZONE_US }
];
