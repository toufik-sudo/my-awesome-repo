// -----------------------------------------------------------------------------
// TopNavigation Molecule Component
// Migrated from old_app/src/components/molecules/wall/WallTopNavigation.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { Bell, Settings, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '../atoms/Avatar';

interface TopNavigationProps {
  user?: {
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  onMenuToggle?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  notificationCount?: number;
  showMobileMenu?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  user,
  onMenuToggle,
  onNotificationsClick,
  onSettingsClick,
  onProfileClick,
  onLogout,
  notificationCount = 0,
  showMobileMenu = true,
  className,
  children,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4',
        className
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        {showMobileMenu && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {children}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={onNotificationsClick}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" onClick={onSettingsClick}>
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar
                  src={user.avatarUrl}
                  fallback={user.name}
                  size="sm"
                />
                <span className="hidden md:inline-block">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export { TopNavigation };
export default TopNavigation;
