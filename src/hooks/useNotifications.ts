// -----------------------------------------------------------------------------
// useNotifications Hook
// Manages notification list with infinite scroll and category filtering
// Migrated from old_app/src/hooks/notifications/useNotificationsData.ts
// -----------------------------------------------------------------------------

import { useCallback, useMemo } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';
import { NOTIFICATION_CATEGORY } from '@/constants/notifications';
import { notificationsApi } from '@/api/NotificationsApi';
import { VIEW_TYPE } from '@/constants/api';
import type { NotificationData } from '@/components/library/organisms/NotificationItem';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationCriteria {
  category: NOTIFICATION_CATEGORY;
}

export interface UseNotificationsConfig {
  /** Initial category filter */
  initialCategory?: NOTIFICATION_CATEGORY;
  
  /** Number of notifications per page */
  pageSize?: number;
  
  /** Platform ID for super users */
  platformId?: number | null;
  
  /** Whether user has super role */
  isSuperUser?: boolean;
}

export interface UseNotificationsResult {
  notifications: NotificationData[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  category: NOTIFICATION_CATEGORY;
  setCategory: (category: NOTIFICATION_CATEGORY) => void;
  reset: () => void;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useNotifications({
  initialCategory = NOTIFICATION_CATEGORY.ALL,
  pageSize = 20,
  platformId = null,
  isSuperUser = false
}: UseNotificationsConfig = {}): UseNotificationsResult {
  
  // Load function for infinite scroll
  const loadNotifications = useCallback(async (criteria: NotificationCriteria & { offset: number; size: number }) => {
    const viewType = isSuperUser ? VIEW_TYPE.PLATFORM : VIEW_TYPE.LIST;
    
    const { data } = await notificationsApi.getNotifications(
      criteria,
      viewType,
      isSuperUser ? platformId : null
    );
    
    const { notifications: entries, total } = data.length > 0 
      ? data[0] 
      : { notifications: [], total: 0 };
    
    // Transform to NotificationData format
    const transformedEntries: NotificationData[] = entries.map((n: any) => ({
      id: n.id?.toString() || Math.random().toString(),
      title: n.title || n.message || '',
      message: n.description,
      username: n.createdBy?.firstName 
        ? `${n.createdBy.firstName} ${n.createdBy.lastName || ''}`.trim()
        : undefined,
      avatarUrl: n.createdBy?.croppedPicture,
      date: n.createdAt || new Date(),
      isNew: n.isNew || false,
      isRead: n.status === 2, // NOTIFICATION_STATUS.READ
      type: n.type?.toString(),
      onClick: undefined // Can be set by consumer
    }));
    
    return { entries: transformedEntries, total };
  }, [isSuperUser, platformId]);

  const {
    entries,
    hasMore,
    isLoading,
    loadMore,
    setCriteria,
    criteria,
    reset
  } = useInfiniteScroll<NotificationData, NotificationCriteria>({
    loadMore: loadNotifications,
    initialCriteria: { category: initialCategory },
    pageSize
  });

  // Set category (only when not loading)
  const setCategory = useCallback((category: NOTIFICATION_CATEGORY) => {
    if (!isLoading) {
      setCriteria(prev => ({ ...prev, category }));
    }
  }, [isLoading, setCriteria]);

  return {
    notifications: entries,
    isLoading,
    hasMore,
    loadMore,
    category: criteria.category,
    setCategory,
    reset
  };
}

export default useNotifications;
