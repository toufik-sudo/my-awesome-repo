export interface UserPreferences {
  language: string;
  theme: string;
  dateFormat: string;
  timezone: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  weeklyDigest: boolean;
  commentReplies: boolean;
  commentRepliesPush: boolean;
  rankingUpdates: boolean;
  rankingUpdatesPush: boolean;
  newFollowers: boolean;
  newFollowersPush: boolean;
  systemAnnouncements: boolean;
  systemAnnouncementsPush: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  [key: string]: boolean | string;
}

export interface AccountSettings {
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface AccountProfile {
  id?: string;
  userId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneNbr?: string;
  bio?: string;
  avatar?: string;
  [key: string]: any;
}

export interface SettingsResponse {
  preferences: UserPreferences;
  notifications: NotificationSettings;
  account: AccountProfile;
}
