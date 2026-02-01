// -----------------------------------------------------------------------------
// NotificationList Component
// Consolidated notification list with filtering and infinite scroll support
// -----------------------------------------------------------------------------

import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { NotificationItem, NotificationData } from './NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Bell, BellOff } from 'lucide-react';
import { NOTIFICATION_GROUPS, NOTIFICATION_CATEGORY, type NotificationGroup } from '@/constants/notifications';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationListProps {
  notifications: NotificationData[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onCategoryChange?: (category: NOTIFICATION_CATEGORY) => void;
  activeCategory?: NOTIFICATION_CATEGORY;
  showFilters?: boolean;
  emptyMessage?: string;
  className?: string;
  maxHeight?: string;
}

// -----------------------------------------------------------------------------
// Filter Header Component
// -----------------------------------------------------------------------------

interface NotificationFilterProps {
  groups: Record<string, NotificationGroup>;
  activeCategory: NOTIFICATION_CATEGORY;
  onCategoryChange: (category: NOTIFICATION_CATEGORY) => void;
  disabled?: boolean;
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({
  groups,
  activeCategory,
  onCategoryChange,
  disabled
}) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-border">
      {Object.values(groups).map((group) => (
        <button
          key={group.id}
          onClick={() => !disabled && onCategoryChange(group.id)}
          disabled={disabled}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
            'hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed',
            activeCategory === group.id
              ? 'text-foreground border-b-2 border-secondary bg-muted/50'
              : 'text-muted-foreground'
          )}
        >
          {group.value.charAt(0).toUpperCase() + group.value.slice(1)}
        </button>
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onCategoryChange,
  activeCategory = NOTIFICATION_CATEGORY.ALL,
  showFilters = true,
  emptyMessage = 'No notifications',
  className,
  maxHeight = '500px'
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Infinite scroll callback
  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <div className={cn('flex flex-col bg-background rounded-lg', className)}>
      {/* Filter Header */}
      {showFilters && onCategoryChange && (
        <div className="px-4 pt-4">
          <NotificationFilter
            groups={NOTIFICATION_GROUPS}
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Notification List */}
      <ScrollArea style={{ maxHeight }} className="flex-1">
        <div className="divide-y divide-border">
          {notifications.map((notification, index) => {
            const isLast = index === notifications.length - 1;
            return (
              <div 
                key={notification.id} 
                ref={isLast ? lastItemRef : undefined}
              >
                <NotificationItem
                  notification={notification}
                  variant="list"
                />
              </div>
            );
          })}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationList;
