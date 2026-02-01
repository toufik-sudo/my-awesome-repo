// -----------------------------------------------------------------------------
// useNotificationDropdown Hook
// Manages notification dropdown state with unread count
// Migrated from old_app/src/hooks/notifications/useNotificationsDropdownData.ts
// -----------------------------------------------------------------------------

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { notificationsApi } from '@/api/NotificationsApi';
import { VIEW_TYPE } from '@/constants/api';
import { NOTIFICATIONS_ROUTE, WALL_ROUTE } from '@/constants/routes';
import type { NotificationData } from '@/components/library/organisms/NotificationItem';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UseNotificationDropdownConfig {
  /** Platform ID for super users */
  platformId?: number | null;
  
  /** Whether user has super role */
  isSuperUser?: boolean;
  
  /** Polling interval for unread count (ms), 0 to disable */
  pollingInterval?: number;
}

export interface UseNotificationDropdownResult {
  /** Whether dropdown is open */
  isOpen: boolean;
  
  /** Whether loading notifications */
  isLoading: boolean;
  
  /** Open the dropdown and load preview notifications */
  open: () => Promise<void>;
  
  /** Close the dropdown */
  close: () => void;
  
  /** Toggle dropdown */
  toggle: () => void;
  
  /** List of preview notifications */
  notifications: NotificationData[];
  
  /** Current unread count */
  unreadCount: number;
  
  /** Total notification count (last fetched) */
  totalCount: number;
  
  /** Manually refresh unread count */
  refreshUnreadCount: () => Promise<void>;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useNotificationDropdown({
  platformId = null,
  isSuperUser = false,
  pollingInterval = 0
}: UseNotificationDropdownConfig = {}): UseNotificationDropdownResult {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const location = useLocation();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if we're on the notifications page
  const isOnNotificationsPage = location.pathname === `${WALL_ROUTE}${NOTIFICATIONS_ROUTE}` ||
    location.pathname === NOTIFICATIONS_ROUTE;

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (isOnNotificationsPage) return;

    try {
      const { data } = await notificationsApi.countUnreadNotifications(
        isSuperUser ? platformId : null
      );
      setUnreadCount(data.total || 0);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, [isSuperUser, platformId, isOnNotificationsPage]);

  // Initial fetch of unread count
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Polling for unread count
  useEffect(() => {
    if (pollingInterval <= 0 || isOnNotificationsPage) return;

    const interval = setInterval(fetchUnreadCount, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval, fetchUnreadCount, isOnNotificationsPage]);

  // Open dropdown and load preview notifications
  const open = useCallback(async () => {
    setIsOpen(true);
    setIsLoading(true);

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const viewType = isSuperUser ? VIEW_TYPE.PLATFORM : VIEW_TYPE.PREVIEW;
      const { data } = await notificationsApi.getPreviewNotifications(
        viewType,
        isSuperUser ? platformId : null
      );

      // Transform notifications
      const transformedNotifications: NotificationData[] = (data.notifications || []).map((n: any) => ({
        id: n.id?.toString() || Math.random().toString(),
        title: n.title || n.message || '',
        message: n.description,
        username: n.createdBy?.firstName 
          ? `${n.createdBy.firstName} ${n.createdBy.lastName || ''}`.trim()
          : undefined,
        avatarUrl: n.createdBy?.croppedPicture,
        date: n.createdAt || new Date(),
        isNew: n.isNew || false,
        isRead: n.status === 2,
        type: n.type?.toString()
      }));

      setNotifications(transformedNotifications);
      setUnreadCount(0); // Mark as read when opened
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to load notifications:', error);
        toast.error('Failed to load notifications');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSuperUser, platformId]);

  // Close dropdown
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Toggle dropdown
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    isOpen,
    isLoading,
    open,
    close,
    toggle,
    notifications,
    unreadCount,
    totalCount,
    refreshUnreadCount: fetchUnreadCount
  };
}

export default useNotificationDropdown;
