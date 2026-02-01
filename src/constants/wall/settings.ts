// -----------------------------------------------------------------------------
// Wall Settings Constants
// Migrated from old_app/src/constants/wall/settings.ts
// -----------------------------------------------------------------------------

export const ACCOUNT = 'account';
export const CHANGE_PASSWORD = 'changepassword';
export const ADMINISTRATORS = 'administrators';
export const PAYMENT = 'payment';
export const GDPR = 'gdpr';

export const FIRST_SETTINGS_TAB = ACCOUNT;
export const SETTINGS = 'settings';

export const PLATFORM_SETTINGS_TABS = [ADMINISTRATORS, PAYMENT, GDPR];

// Settings tab type
export type SettingsTab = 
  | typeof ACCOUNT 
  | typeof CHANGE_PASSWORD 
  | typeof ADMINISTRATORS 
  | typeof PAYMENT 
  | typeof GDPR;
