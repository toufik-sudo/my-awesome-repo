import { ZONE_EUROPE, ZONE_US } from 'constants/general';

export const CR_COOKIE_LABEL = 'crLanguage';
export const EN_LABEL = 'English';
export const FR_LABEL = 'Français';
export const IT_LABEL = 'Italiano';
export const GERMAN = 'Deutsch';
export const SPANISH = 'Español';
export const ROMANIAN = 'Română';
export const PORTUGUESE = 'Português';

export const EN_VALUE = 'en';
export const FR_VALUE = 'fr';
export const IT_VALUE = 'it';
export const DE_VALUE = 'de';
export const ES_VALUE = 'es';
export const RO_VALUE = 'ro';
export const POR_VALUE = 'por';

export const DEFAULT_LANGUAGE = { value: EN_VALUE, label: EN_LABEL };

export const LANGUAGE_OPTIONS = [
  DEFAULT_LANGUAGE,
  { value: FR_VALUE, label: FR_LABEL }
  // { value: IT_VALUE, label: IT_LABEL },
  // { value: DE_VALUE, label: GERMAN },
  // { value: ES_VALUE, label: SPANISH }
  // { value: RO_VALUE, label: ROMANIAN },
  // { value: POR_VALUE, label: PORTUGUESE }
];

export const ZONE_OPTIONS = [
  { value: ZONE_EUROPE, label: ZONE_EUROPE },
  { value: ZONE_US, label: ZONE_US }
];
