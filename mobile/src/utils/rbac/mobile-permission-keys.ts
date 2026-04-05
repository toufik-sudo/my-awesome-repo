/**
 * Mobile Permission Registry — mirrors src/utils/rbac/ui-permission-keys.ts
 *
 * All mobile UI permission keys generated via generateMobileUiPermissionKey().
 */

export function generateMobileUiPermissionKey(
  screenName: string,
  section?: string,
  elementType?: string,
  actionName?: string,
): string {
  const parts = ['mobile', screenName];
  if (section) parts.push(section);
  if (elementType) parts.push(elementType);
  if (actionName) parts.push(actionName);
  return parts.join('.');
}

export const MOBILE_UI_PERM = {
  // Properties
  PROPERTY_VIEW: generateMobileUiPermissionKey('PropertyList', undefined, 'Screen', 'View'),
  PROPERTY_ADD: generateMobileUiPermissionKey('PropertyList', 'Header', 'Button', 'Add'),
  PROPERTY_DETAIL: generateMobileUiPermissionKey('PropertyDetail', undefined, 'Screen', 'View'),
  PROPERTY_SHARE: generateMobileUiPermissionKey('PropertyDetail', 'Actions', 'Button', 'Share'),

  // Services
  SERVICE_VIEW: generateMobileUiPermissionKey('ServiceList', undefined, 'Screen', 'View'),
  SERVICE_ADD: generateMobileUiPermissionKey('ServiceList', 'Header', 'Button', 'Add'),

  // Bookings
  BOOKINGS_TAB: generateMobileUiPermissionKey('Bookings', undefined, 'Tab', 'View'),
  BOOKING_ACCEPT: generateMobileUiPermissionKey('BookingDetail', 'Actions', 'Button', 'Accept'),
  BOOKING_REJECT: generateMobileUiPermissionKey('BookingDetail', 'Actions', 'Button', 'Reject'),

  // Dashboard
  ANALYTICS_TAB: generateMobileUiPermissionKey('Dashboard', 'Analytics', 'Tab', 'View'),
  PAYMENTS_TAB: generateMobileUiPermissionKey('Dashboard', 'Payments', 'Tab', 'View'),

  // Rewards
  REWARDS_VIEW: generateMobileUiPermissionKey('Rewards', undefined, 'Screen', 'View'),
  REWARD_REDEEM: generateMobileUiPermissionKey('RewardDetail', 'Actions', 'Button', 'Redeem'),

  // Chat
  CHAT_REPLY: generateMobileUiPermissionKey('Chat', undefined, 'Screen', 'Reply'),
} as const;

export type MobileUiPermissionKey = (typeof MOBILE_UI_PERM)[keyof typeof MOBILE_UI_PERM];
