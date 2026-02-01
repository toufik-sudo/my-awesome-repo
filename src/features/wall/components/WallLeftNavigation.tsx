// -----------------------------------------------------------------------------
// WallLeftNavigation Component
// Migrated from old_app/src/components/molecules/wall/WallLeftNavigation.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { cn } from '@/lib/utils';
import { LeftNavigationElement } from './LeftNavigationElement';
import { LogoutButton } from '@/components/library/molecules/LogoutButton';
import { Separator } from '@/components/ui/separator';
import { ExternalLink } from 'lucide-react';

export interface NavItem {
  title: string;
  icon?: React.ReactNode;
  url: string;
  external?: boolean;
  isDisabled?: boolean;
}

export interface WallLeftNavigationProps {
  closeNav?: () => void;
  showCompanyLogo?: boolean;
  isCollapsed?: boolean;
  navItems?: NavItem[];
  widgetItems?: NavItem[];
  legalDocUrl?: string;
  menuColor?: string;
  onLogout?: () => void;
  showWidgets?: boolean;
}

const WallLeftNavigation: React.FC<WallLeftNavigationProps> = ({
  closeNav,
  showCompanyLogo = false,
  isCollapsed = false,
  navItems = [],
  widgetItems = [],
  legalDocUrl,
  menuColor,
  onLogout,
  showWidgets = false
}) => {
  const openLegalDoc = (e: React.MouseEvent) => {
    e.preventDefault();
    if (legalDocUrl) {
      window.open(legalDocUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main navigation */}
      <nav className={cn('flex-1 py-2', !showCompanyLogo && 'mt-4')}>
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <LeftNavigationElement
              key={item.title}
              title={item.title}
              icon={item.icon}
              url={item.url}
              closeNav={closeNav}
              external={item.external}
              isDisabled={item.isDisabled}
              isCollapsed={isCollapsed}
              menuColor={menuColor}
            />
          ))}
        </ul>

        {/* Widgets section (shown on mobile/tablet) */}
        {showWidgets && widgetItems.length > 0 && (
          <>
            <Separator className="my-4" />
            <ul className="space-y-1 px-2">
              {widgetItems.map((item) => (
                <LeftNavigationElement
                  key={item.title}
                  title={item.title}
                  url={item.url}
                  closeNav={closeNav}
                  isCollapsed={isCollapsed}
                  menuColor={menuColor}
                  className="text-muted-foreground"
                />
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* Footer section */}
      <div className="mt-auto py-2 px-2">
        <Separator className="mb-4" />
        
        {/* Legal link */}
        {!isCollapsed && legalDocUrl && (
          <a
            href={legalDocUrl}
            onClick={openLegalDoc}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground',
              'hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors'
            )}
          >
            <FormattedMessage id="onboarding.menu.legal" defaultMessage="Legal" />
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {/* Logout button */}
        <LogoutButton
          onLogout={onLogout}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
};

export { WallLeftNavigation };
export default WallLeftNavigation;
