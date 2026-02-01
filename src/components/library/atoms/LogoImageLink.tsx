// -----------------------------------------------------------------------------
// LogoImageLink Atom Component
// Migrated from old_app/src/components/atoms/ui/LogoImageLink.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cn } from '@/lib/utils';
import { ROOT } from '@/constants/routes';
import { forceActiveProgram } from '@/store/actions/wallActions';

// Default logo - can be replaced with actual logo import
const DEFAULT_LOGO = '/logo.png';
const LOGO_ALT = 'Cloud Rewards';

export interface LogoImageLinkProps {
  className?: string;
  logo?: string;
  disabled?: boolean;
  isCollapsed?: boolean;
  forcedPlatformId?: number | null;
}

const LogoImageLink: React.FC<LogoImageLinkProps> = ({ 
  className = '', 
  logo = DEFAULT_LOGO, 
  disabled = false,
  isCollapsed = false,
  forcedPlatformId = null
}) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (forcedPlatformId) {
      dispatch(forceActiveProgram({ forcedPlatformId, unlockSelection: true }));
    }
  };

  const imgElement = (
    <img 
      src={logo} 
      alt={LOGO_ALT} 
      className={cn(
        'transition-all duration-300',
        isCollapsed ? 'w-8 h-8' : 'max-h-12',
        className
      )} 
    />
  );

  if (disabled) {
    return (
      <div className="flex items-center justify-center">
        {imgElement}
      </div>
    );
  }

  return (
    <Link 
      to={ROOT} 
      onClick={handleClick}
      className="flex items-center justify-center hover:opacity-80 transition-opacity"
    >
      {imgElement}
    </Link>
  );
};

export { LogoImageLink };
export default LogoImageLink;
