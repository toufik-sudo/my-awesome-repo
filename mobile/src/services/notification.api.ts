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

export interface PaginatedNotifications {
  data: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const notificationApi = {
  /**
   * Get all notifications (legacy non-paginated; kept for backward compat).
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
   * Server-side paginated list. Defaults: page=1, limit=20, max=100.
   */
  async getAllPaginated(params: { page?: number; limit?: number } = {}): Promise<PaginatedNotifications> {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const qs = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    const response = await api.get<PaginatedNotifications | NotificationItem[]>(
      `${API_BASE.NOTIFICATIONS}?${qs}`,
    );
    // Backwards-compatible: if backend returns a flat array, wrap it.
    const body: any = response.data;
    if (Array.isArray(body)) {
      return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }
    return body;
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
