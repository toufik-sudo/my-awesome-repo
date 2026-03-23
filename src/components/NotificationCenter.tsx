import React, { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification } from '@/modules/notifications/notifications.types';
import { VirtualList } from '@/modules/shared/components/VirtualList';

const NotificationItem = memo<{
  notification: Notification;
  onMarkAsRead: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick: (notification: Notification) => void;
  getRelativeTime: (timestamp: string) => string;
  getTypeStyles: (type: Notification['type']) => string;
}>(({ notification, onMarkAsRead, onDelete, onClick, getRelativeTime, getTypeStyles }) => (
  <div
    className={cn(
      'p-4 hover:bg-accent cursor-pointer transition-colors group border-b border-border',
      !notification.read && 'bg-accent/50'
    )}
    onClick={(e) => {
      if (!notification.read) onMarkAsRead(notification.id, e);
      onClick(notification);
    }}
  >
    <div className="flex items-start gap-3">
      <div
        className={cn(
          'mt-1.5 h-2 w-2 rounded-full flex-shrink-0',
          getTypeStyles(notification.type)
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm text-foreground">
            {notification.title}
          </p>
          <div className="flex items-center gap-1">
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => onDelete(notification.id, e)}
            >
              <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {getRelativeTime(notification.timestamp)}
        </p>
      </div>
    </div>
  </div>
));

NotificationItem.displayName = 'NotificationItem';

export const NotificationCenter: React.FC = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  } = useNotifications();

  const getRelativeTime = useCallback((timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return t('notifications.daysAgo', { count: days });
    if (hours > 0) return t('notifications.hoursAgo', { count: hours });
    if (minutes > 0) return t('notifications.minutesAgo', { count: minutes });
    return t('notifications.justNow');
  }, [t]);

  const getTypeStyles = useCallback((type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-destructive';
      default: return 'bg-primary';
    }
  }, []);

  const handleMarkAsRead = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { await markAsRead(id); } catch (error) { console.error('Failed to mark as read:', error); }
  }, [markAsRead]);

  const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { await deleteNotification(id); } catch (error) { console.error('Failed to delete notification:', error); }
  }, [deleteNotification]);

  const handleMarkAllAsRead = useCallback(async () => {
    try { await markAllAsRead(); } catch (error) { console.error('Failed to mark all as read:', error); }
  }, [markAllAsRead]);

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  }, [navigate]);

  const renderNotification = useCallback((notification: Notification) => (
    <NotificationItem
      notification={notification}
      onMarkAsRead={handleMarkAsRead}
      onDelete={handleDelete}
      onClick={handleNotificationClick}
      getRelativeTime={getRelativeTime}
      getTypeStyles={getTypeStyles}
    />
  ), [handleMarkAsRead, handleDelete, handleNotificationClick, getRelativeTime, getTypeStyles]);

  const getItemKey = useCallback((index: number) => notifications[index]?.id ?? index, [notifications]);

  const useVirtual = notifications.length > 20;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-popover border-border" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{t('notifications.title')}</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={refreshNotifications} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs text-muted-foreground hover:text-foreground">
                {t('notifications.markAllRead')}
              </Button>
            )}
          </div>
        </div>
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {t('notifications.empty')}
          </div>
        ) : useVirtual ? (
          <VirtualList
            items={notifications}
            estimateSize={100}
            height="400px"
            overscan={3}
            getItemKey={getItemKey}
            renderItem={renderNotification}
          />
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onClick={handleNotificationClick}
                getRelativeTime={getRelativeTime}
                getTypeStyles={getTypeStyles}
              />
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
});

NotificationCenter.displayName = 'NotificationCenter';
