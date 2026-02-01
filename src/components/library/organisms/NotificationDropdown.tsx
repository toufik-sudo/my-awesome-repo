// -----------------------------------------------------------------------------
// NotificationDropdown Component
// Bell icon with dropdown showing recent notifications
// -----------------------------------------------------------------------------

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NotificationItem, NotificationData } from './NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { NOTIFICATIONS_DROPDOWN_LIMIT } from '@/constants/notifications';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationDropdownProps {
  notifications: NotificationData[];
  unreadCount?: number;
  totalCount?: number;
  isLoading?: boolean;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onToggle?: () => void;
  viewAllPath?: string;
  viewAllLabel?: string;
  emptyMessage?: string;
  className?: string;
  icon?: React.ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount = 0,
  totalCount,
  isLoading = false,
  isOpen: controlledIsOpen,
  onOpen,
  onClose,
  onToggle,
  viewAllPath = '/notifications',
  viewAllLabel = 'View all notifications',
  emptyMessage = 'No notifications yet',
  className,
  icon
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else if (isControlled) {
      isOpen ? onClose?.() : onOpen?.();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalIsOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const displayedNotifications = notifications.slice(0, NOTIFICATIONS_DROPDOWN_LIMIT);
  const remainingCount = totalCount 
    ? totalCount - NOTIFICATIONS_DROPDOWN_LIMIT 
    : notifications.length - NOTIFICATIONS_DROPDOWN_LIMIT;

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Bell Icon Button */}
      <button
        onClick={handleToggle}
        className={cn(
          'relative p-2 rounded-full transition-colors',
          'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
        )}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon || <Bell className="h-5 w-5 text-foreground" />}
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-0.5 -right-0.5 h-5 min-w-5 flex items-center justify-center text-[10px] px-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/40 z-40" 
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dropdown Content */}
          <div
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'w-80 sm:w-96 max-w-[calc(100vw-2rem)]',
              'bg-background border border-border rounded-lg shadow-lg',
              'animate-in fade-in-0 zoom-in-95'
            )}
            role="menu"
            aria-orientation="vertical"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <Link
                to={viewAllPath}
                onClick={handleClose}
                className="text-xs text-secondary hover:underline"
              >
                {viewAllLabel}
              </Link>
            </div>

            {/* Notification List */}
            <ScrollArea className="max-h-80">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : displayedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {displayedNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      variant="dropdown"
                    />
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer with remaining count */}
            {remainingCount > 0 && (
              <div className="px-4 py-2 border-t border-border text-center">
                <span className="text-xs text-muted-foreground">
                  +{remainingCount} more notifications
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Convenience export with hook integration placeholder
// -----------------------------------------------------------------------------

export const NotificationBell = NotificationDropdown;

export default NotificationDropdown;
