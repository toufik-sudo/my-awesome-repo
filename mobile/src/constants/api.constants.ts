export const API_BASE = {
  AUTH: '/auth',
  API_AUTH: '/auth',
  API_USER: '/user',
  API_SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  PROPERTIES: '/properties',
  DOCUMENTS: '/documents',
  BOOKINGS: '/bookings',
  SERVICES: '/services',
} as const;

export const STORAGE_KEYS = {
  JWT_TOKEN: 'jwt_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export const AUTH_API = {
  LOGIN: `${API_BASE.AUTH}/login`,
  LOGOUT: `${API_BASE.API_AUTH}/logout`,
  REGISTER: `${API_BASE.API_AUTH}/register`,
  REFRESH: `${API_BASE.API_AUTH}/refresh`,
  CHECK: `${API_BASE.API_AUTH}/login`,
  SEND_OTP: `${API_BASE.API_AUTH}/send-otp`,
  VERIFY_OTP: `${API_BASE.API_AUTH}/verify-otp`,
  SOCIAL: (provider: string) => `${API_BASE.API_AUTH}/social/${provider}`,
  PASSWORD_RESET_SEND: `${API_BASE.API_AUTH}/password-reset/send`,
  PASSWORD_RESET_VERIFY: `${API_BASE.API_AUTH}/password-reset/verify`,
  PASSWORD_RESET_COMPLETE: `${API_BASE.API_AUTH}/password-reset/complete`,
  VERIFICATION_EMAIL_SEND: `${API_BASE.API_AUTH}/verification/email/send`,
  VERIFICATION_EMAIL_RESEND: `${API_BASE.API_AUTH}/verification/email/resend`,
  VERIFICATION_EMAIL_VERIFY: `${API_BASE.API_AUTH}/verification/email/verify`,
  VERIFICATION_PHONE_SEND: `${API_BASE.API_AUTH}/verification/phone/send`,
  VERIFICATION_PHONE_RESEND: `${API_BASE.API_AUTH}/verification/phone/resend`,
  VERIFICATION_PHONE_VERIFY: `${API_BASE.API_AUTH}/verification/phone/verify`,
  USER_LANGUAGE: `${API_BASE.API_USER}/language`,
  USER_AVATAR: `${API_BASE.API_USER}/avatar`,
  USER_PROFILE_COMPLETE: `${API_BASE.API_USER}/profile/complete`,
} as const;

export const PROPERTIES_API = {
  LIST: API_BASE.PROPERTIES,
  DETAIL: (id: string) => `${API_BASE.PROPERTIES}/${id}`,
  CREATE: API_BASE.PROPERTIES,
  UPDATE: (id: string) => `${API_BASE.PROPERTIES}/${id}`,
  DELETE: (id: string) => `${API_BASE.PROPERTIES}/${id}`,
  RECALCULATE_TRUST: (id: string) => `${API_BASE.PROPERTIES}/${id}/recalculate-trust`,
  DOCUMENTS: (id: string) => `${API_BASE.PROPERTIES}/${id}/documents`,
} as const;

export const DOCUMENTS_API = {
  PENDING: `${API_BASE.DOCUMENTS}/pending`,
  VALIDATE: (id: string) => `${API_BASE.DOCUMENTS}/${id}/validate`,
  APPROVE: (id: string) => `${API_BASE.DOCUMENTS}/${id}/approve`,
  REJECT: (id: string) => `${API_BASE.DOCUMENTS}/${id}/reject`,
  UPLOAD: `${API_BASE.DOCUMENTS}/upload`,
} as const;
