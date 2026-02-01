// -----------------------------------------------------------------------------
// NotificationItem Component
// Consolidated from NotificationsListItem and NotificationsDropdownItem
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationData {
  id: string;
  title: string;
  message?: string;
  username?: string;
  avatarUrl?: string;
  date: Date | string;
  isNew?: boolean;
  isRead?: boolean;
  type?: string;
  onClick?: () => void;
}

export interface NotificationItemProps {
  notification: NotificationData;
  variant?: 'list' | 'dropdown';
  showAvatar?: boolean;
  showTimestamp?: boolean;
  dateFormat?: 'relative' | 'absolute';
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  variant = 'list',
  showAvatar = true,
  showTimestamp = true,
  dateFormat = 'relative',
  className
}) => {
  const {
    id,
    title,
    message,
    username,
    avatarUrl,
    date,
    isNew,
    isRead,
    onClick
  } = notification;

  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
  const formattedDate = dateFormat === 'relative' 
    ? formatDistanceToNow(parsedDate, { addSuffix: true })
    : format(parsedDate, 'dd/MM/yy HH:mm');

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isDropdown = variant === 'dropdown';

  return (
    <div
      className={cn(
        'flex gap-3 p-3 transition-colors cursor-pointer',
        isDropdown ? 'hover:bg-muted/50' : 'hover:bg-muted/30 border-b border-border',
        !isRead && 'bg-primary/5',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Avatar */}
      {showAvatar && (
        <Avatar className={cn(isDropdown ? 'h-8 w-8' : 'h-10 w-10', 'flex-shrink-0')}>
          <AvatarImage src={avatarUrl} alt={username || 'User'} />
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            {getInitials(username)}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Header with username and new badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {username && (
            <span className="font-semibold text-sm text-foreground">
              {username}
            </span>
          )}
          {isNew && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
              New
            </Badge>
          )}
        </div>

        {/* Title */}
        <p className={cn(
          'text-secondary hover:underline',
          isDropdown ? 'text-xs' : 'text-sm',
          'line-clamp-2'
        )}>
          {title}
        </p>

        {/* Message (optional) */}
        {message && !isDropdown && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {message}
          </p>
        )}

        {/* Timestamp */}
        {showTimestamp && (
          <p className="text-xs text-muted-foreground">
            {formattedDate}
          </p>
        )}
      </div>

      {/* Unread indicator */}
      {!isRead && (
        <div className="flex-shrink-0 self-center">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Preset Variants
// -----------------------------------------------------------------------------

export const NotificationListItem: React.FC<Omit<NotificationItemProps, 'variant'>> = (props) => (
  <NotificationItem {...props} variant="list" />
);

export const NotificationDropdownItem: React.FC<Omit<NotificationItemProps, 'variant'>> = (props) => (
  <NotificationItem {...props} variant="dropdown" />
);

export default NotificationItem;
