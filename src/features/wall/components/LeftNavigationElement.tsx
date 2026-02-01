// -----------------------------------------------------------------------------
// LeftNavigationElement Component
// Migrated from old_app/src/components/atoms/wall/LeftNavigationElement.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface LeftNavigationElementProps {
  title: string;
  icon?: React.ReactNode;
  url: string;
  closeNav?: () => void;
  className?: string;
  isDisabled?: boolean;
  external?: boolean;
  isCollapsed?: boolean;
  menuColor?: string;
}

const LeftNavigationElement: React.FC<LeftNavigationElementProps> = ({
  title,
  icon = null,
  url,
  closeNav,
  className = '',
  isDisabled = false,
  external = false,
  isCollapsed = false,
  menuColor
}) => {
  const { formatMessage } = useIntl();
  const location = useLocation();
  const isActive = location.pathname === url || location.pathname.startsWith(`${url}/`);
  const tooltipText = formatMessage({ id: title, defaultMessage: title });

  const handleClick = () => {
    if (!isDisabled && closeNav) {
      closeNav();
    }
  };

  const linkContent = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
        'hover:bg-accent/10 cursor-pointer',
        isActive && 'bg-accent/20 text-primary font-medium',
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        isCollapsed && 'justify-center px-2',
        className
      )}
      onClick={handleClick}
    >
      {icon && (
        <span 
          className="shrink-0 w-5 h-5 flex items-center justify-center"
          style={{ color: menuColor }}
        >
          {icon}
        </span>
      )}
      {!isCollapsed && (
        <span 
          className="text-sm truncate"
          style={{ color: menuColor }}
        >
          <FormattedMessage id={title} defaultMessage={title} />
        </span>
      )}
    </div>
  );

  const wrappedLink = external ? (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block"
    >
      {linkContent}
    </a>
  ) : (
    <NavLink to={url} className="block">
      {linkContent}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <li className="list-none">{wrappedLink}</li>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <li className="list-none">{wrappedLink}</li>;
};

export { LeftNavigationElement };
export default LeftNavigationElement;
