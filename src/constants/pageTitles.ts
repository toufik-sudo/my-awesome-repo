// -----------------------------------------------------------------------------
// Page Titles Constants
// Migrated from old_app/src/constants/pageTitles.ts
// -----------------------------------------------------------------------------

export const PAGE_TITLES = {
  DEFAULT: 'Settings',
  PROFILE: 'Profile',
  ACCOUNT: 'Account',
  SECURITY: 'Security',
  NOTIFICATIONS: 'Notifications',
  PRIVACY: 'Privacy',
  BILLING: 'Billing',
  USERS: 'Users',
  PROGRAM: 'Program',
  DESIGN: 'Design',
  DASHBOARD: 'Dashboard'
} as const;

export const SETTINGS_PAGE_TITLES = [
  PAGE_TITLES.PROFILE,
  PAGE_TITLES.ACCOUNT,
  PAGE_TITLES.SECURITY,
  PAGE_TITLES.NOTIFICATIONS,
  PAGE_TITLES.PRIVACY,
  PAGE_TITLES.BILLING
];

export type PageTitleKey = keyof typeof PAGE_TITLES;
