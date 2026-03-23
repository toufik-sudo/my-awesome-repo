import { api } from '@/lib/axios';
import { API_BASE } from '@/constants/api.constants';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const notificationApi = {
  /**
   * Get all notifications
   */
  async getAll(): Promise<NotificationItem[]> {
    try {
      const response = await api.get<NotificationItem[]>(API_BASE.NOTIFICATIONS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  },

  /**
   * Get new/unread notifications
   */
  async getNew(): Promise<NotificationItem[]> {
    try {
      const response = await api.get<NotificationItem[]>(`${API_BASE.NOTIFICATIONS}/new`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch new notifications:', error);
      return [];
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<void> {
    try {
      await api.put(`${API_BASE.NOTIFICATIONS}/${id}/read`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await api.put(`${API_BASE.NOTIFICATIONS}/read-all`);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete notification
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${API_BASE.NOTIFICATIONS}/${id}`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  },
};
