/**
 * Centralized route path constants
 * All route paths must reference these constants — no hardcoded strings.
 */

// ─── Public Routes ──────────────────────────────────────────────────────────

export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  NOT_FOUND: '*',
} as const;

// ─── Property & Service Routes ──────────────────────────────────────────────

export const PROPERTY_ROUTES = {
  LIST: '/properties',
  DETAIL: '/property/:id',
  NEW: '/properties/new',
  EDIT: '/properties/:id/edit',
} as const;

export const SERVICE_ROUTES = {
  LIST: '/services',
  DETAIL: '/services/:id',
  NEW: '/services/new',
} as const;

// ─── Booking Routes ─────────────────────────────────────────────────────────

export const BOOKING_ROUTES = {
  LIST: '/bookings',
  HOST: '/bookings/host',
  HISTORY: '/bookings/history',
  CHAT: '/chat/:bookingId',
  CALENDAR: '/booking-calendar',
} as const;

// ─── Support Routes ─────────────────────────────────────────────────────────

export const SUPPORT_ROUTES = {
  INBOX: '/support',
  THREAD: '/support/:threadId',
  REVIEW: '/support/review/:reviewId',
} as const;

// ─── Dashboard Routes ───────────────────────────────────────────────────────

export const DASHBOARD_ROUTES = {
  ROOT: '/dashboard',
  HYPER: '/dashboard/hyper',
  ADMIN: '/dashboard/admin',
  POINTS: '/points',
  REWARDS: '/rewards',
  SETTINGS: '/settings',
} as const;

// ─── Admin Routes ───────────────────────────────────────────────────────────

export const ADMIN_ROUTES = {
  VERIFICATION_REVIEW: '/admin/verification-review',
  DOCUMENT_VALIDATION: '/admin/document-validation',
  PAYMENT_VALIDATION: '/admin/payment-validation',
  EMAIL_ANALYTICS: '/admin/email-analytics',
  FEE_ABSORPTION: '/admin/fee-absorption',
  CANCELLATION_RULES: '/admin/cancellation-rules',
  API_DOCS: '/admin/api-docs',
} as const;

// ─── Legacy Redirects ───────────────────────────────────────────────────────

export const LEGACY_ROUTES = {
  HYPER_ADMIN: '/hyper-admin',
  ADMIN: '/admin',
  MANAGER: '/manager',
} as const;

// ─── Demo Routes ────────────────────────────────────────────────────────────

export const DEMO_ROUTES = {
  ROOT: '/demo',
  FILTERS: '/demo/filters',
  GRID: '/demo/grid',
  TABS: '/demo/tabs',
  COMBOBOX: '/demo/combobox',
  CHARTS: '/demo/charts',
} as const;
