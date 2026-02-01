// -----------------------------------------------------------------------------
// UI Constants
// Migrated from old_app/src/constants/ui.ts
// -----------------------------------------------------------------------------

export const BUTTON_MAIN_TYPE = {
  PRIMARY: 'primary',
  PRIMARY_INVERTED: 'primaryInverted',
  SECONDARY: 'secondary',
  SECONDARY_INVERTED: 'secondaryInverted',
  THIRD: 'third',
  THIRD_INVERTED: 'thirdInverted',
  DANGER: 'danger',
  ALT: 'alt',
  TEXT_ONLY: 'textOnly',
  TEXT_ONLY_INVERTED: 'textOnlyInverted',
  WITH_ICON: 'withIcon',
  WITH_ICON_DISABLED: 'withIconDisabled',
  DISABLED: 'disabled',
} as const;

export type ButtonMainType = typeof BUTTON_MAIN_TYPE[keyof typeof BUTTON_MAIN_TYPE];

export const HTML_TAGS = {
  DIV: 'div',
  SPAN: 'span',
  P: 'p',
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
  LABEL: 'label',
  BUTTON: 'button',
  A: 'a',
  UL: 'ul',
  LI: 'li',
  SECTION: 'section',
  ARTICLE: 'article',
  HEADER: 'header',
  FOOTER: 'footer',
  NAV: 'nav',
  FORM: 'form',
} as const;

export type HtmlTag = typeof HTML_TAGS[keyof typeof HTML_TAGS];

export const HEADING_SIZES = {
  H1: '1',
  H2: '2',
  H3: '3',
  H4: '4',
  H5: '5',
  H6: '6',
} as const;

export const INPUT_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEL: 'tel',
  URL: 'url',
  SEARCH: 'search',
  DATE: 'date',
  TIME: 'time',
  DATETIME_LOCAL: 'datetime-local',
  FILE: 'file',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  HIDDEN: 'hidden',
} as const;

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;
