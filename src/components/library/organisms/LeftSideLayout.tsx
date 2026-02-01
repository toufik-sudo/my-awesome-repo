// -----------------------------------------------------------------------------
// LeftSideLayout Organism Component
// Migrated from old_app/src/components/organisms/layouts/LeftSideLayout.tsx
// -----------------------------------------------------------------------------

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LogoImageLink } from '../atoms/LogoImageLink';
import { UserInfo } from '../molecules/UserInfo';
import { NavbarBurger } from '../molecules/NavbarBurger';
import { LogoutButton } from '../molecules/LogoutButton';
import { SidebarCollapseToggle } from '../molecules/SidebarCollapseToggle';
import { useSidebarState } from '@/hooks/useSidebarState';

export interface LeftSideLayoutProps {
  children: ReactNode;
  hasUserIcon?: boolean;
  theme?: 'primary' | 'wall' | 'default';
  optionalClass?: string;
  navigation?: ReactNode;
  logo?: string;
  menuBackground?: string;
  backgroundColor?: string;
  userData?: {
    firstName?: string;
    lastName?: string;
    companyRole?: string;
    croppedPicturePath?: string;
  };
  onLogout?: () => void;
  showCollapseToggle?: boolean;
}

const LeftSideLayout: React.FC<LeftSideLayoutProps> = ({
  children,
  hasUserIcon = false,
  theme = 'default',
  optionalClass = '',
  navigation,
  logo,
  menuBackground = '',
  backgroundColor = '',
  userData,
  onLogout,
  showCollapseToggle = true
}) => {
  const {
    isCollapsed,
    isVisuallyCollapsed,
    isHoverExpanded,
    isMobileOpen,
    toggleCollapse,
    toggleMobile,
    handleMouseEnter,
    handleMouseLeave
  } = useSidebarState();

  const isWallTheme = theme === 'wall';

  return (
    <div
      className={cn(
        'flex min-h-screen w-full',
        optionalClass
      )}
      style={{ backgroundColor: backgroundColor || undefined }}
    >
      {/* Mobile burger */}
      {isWallTheme && (
        <NavbarBurger
          toggleClass={toggleMobile}
          isChecked={isMobileOpen}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen',
          'flex flex-col border-r bg-card',
          'transition-all duration-300 ease-in-out',
          // Width states
          isVisuallyCollapsed ? 'w-16' : 'w-64',
          isHoverExpanded && 'w-64 shadow-xl',
          // Mobile states
          'max-md:-translate-x-full max-md:w-64',
          isMobileOpen && 'max-md:translate-x-0'
        )}
        style={{ 
          backgroundColor: menuBackground || undefined
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center border-b p-4',
          isVisuallyCollapsed && !isHoverExpanded && 'justify-center p-2'
        )}>
          <LogoImageLink 
            logo={logo} 
            isCollapsed={isVisuallyCollapsed && !isHoverExpanded}
          />
        </div>

        {/* User info */}
        {hasUserIcon && userData && (
          <div className="border-b p-2">
            <UserInfo
              {...userData}
              isCollapsed={isVisuallyCollapsed && !isHoverExpanded}
            />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {navigation}
        </nav>

        {/* Footer with logout */}
        <div className="border-t p-2">
          <LogoutButton
            onLogout={onLogout}
            isCollapsed={isVisuallyCollapsed && !isHoverExpanded}
          />
        </div>

        {/* Collapse toggle */}
        {showCollapseToggle && (
          <SidebarCollapseToggle
            isCollapsed={isCollapsed}
            onToggle={toggleCollapse}
            isHoverExpanded={isHoverExpanded}
          />
        )}
      </aside>

      {/* Main content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          isVisuallyCollapsed ? 'md:ml-16' : 'md:ml-64'
        )}
      >
        {children}
      </main>
    </div>
  );
};

export { LeftSideLayout };
export default LeftSideLayout;
