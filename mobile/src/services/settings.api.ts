import { api } from '@/lib/axios';
import { API_BASE, AUTH_API } from '@/constants/api.constants';

// Types
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
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface AccountSettings {
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface SettingsResponse {
  preferences: UserPreferences;
  notifications: NotificationSettings;
  account: { email: string };
}

const SETTINGS_ENDPOINTS = {
  GET: API_BASE.API_SETTINGS,
  PREFERENCES: `${API_BASE.API_SETTINGS}/preferences`,
  NOTIFICATIONS: `${API_BASE.API_SETTINGS}/notifications`,
  ACCOUNT: `${API_BASE.API_SETTINGS}/account`,
  PASSWORD: `${API_BASE.API_SETTINGS}/password`,
} as const;

export const settingsApi = {
  async getSettings(): Promise<SettingsResponse> {
    const response = await api.get<SettingsResponse>(SETTINGS_ENDPOINTS.GET);
    return response.data;
  },

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    await api.put(SETTINGS_ENDPOINTS.PREFERENCES, preferences);
  },

  async updateNotifications(notifications: Partial<NotificationSettings>): Promise<void> {
    await api.put(SETTINGS_ENDPOINTS.NOTIFICATIONS, notifications);
  },

  async updateAccount(account: AccountSettings): Promise<void> {
    await api.put(SETTINGS_ENDPOINTS.ACCOUNT, account);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put(SETTINGS_ENDPOINTS.PASSWORD, { currentPassword, newPassword });
  },

  async updateLanguage(language: string): Promise<void> {
    await api.put(AUTH_API.USER_LANGUAGE, { language });
  },

  async uploadAvatar(userId: string, fileUri: string, fileName: string): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', {
      uri: fileUri,
      name: fileName || 'avatar.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('userId', userId);
    const response = await api.post<{ url: string }>(AUTH_API.USER_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  },

  async deleteAvatar(): Promise<void> {
    await api.delete(AUTH_API.USER_AVATAR);
  },

  async completeProfile(userId: string, profileData: Record<string, any>): Promise<void> {
    await api.post(AUTH_API.USER_PROFILE_COMPLETE, { userId, ...profileData });
  },
};
