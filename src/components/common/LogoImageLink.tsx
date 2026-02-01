// -----------------------------------------------------------------------------
// Logo Image Link Component
// Migrated from old_app/src/components/atoms/ui/LogoImageLink.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import { CLOUD_REWARDS_LOGO_ALT } from '@/constants/general';
import { ROOT } from '@/constants/routes';
import { cn } from '@/lib/utils';

// TODO: Replace with actual logo when assets are migrated
const defaultLogo = '/placeholder.svg';

interface LogoImageLinkProps {
  className?: string;
  logo?: string;
  disabled?: boolean;
  isCollapsed?: boolean;
}

/**
 * Component used to render a link with a logo image
 */
const LogoImageLink: React.FC<LogoImageLinkProps> = ({ 
  className, 
  logo = defaultLogo, 
  disabled = false,
  isCollapsed = false
}) => {
  const logoElement = (
    <div className="flex items-center justify-center">
      <img 
        src={logo} 
        alt={CLOUD_REWARDS_LOGO_ALT} 
        className={cn('h-10 w-auto transition-all', className, {
          'h-8': isCollapsed
        })}
      />
    </div>
  );

  if (disabled) {
    return logoElement;
  }

  return (
    <Link to={ROOT} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      {logoElement}
    </Link>
  );
};

export default LogoImageLink;
