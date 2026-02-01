// -----------------------------------------------------------------------------
// UserInfo Molecule Component
// Migrated from old_app/src/components/molecules/wall/UserInfo.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Loading } from '../atoms/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WALL, SETTINGS } from '@/constants/routes';

export interface UserInfoProps {
  firstName?: string;
  lastName?: string;
  companyRole?: string;
  croppedPicturePath?: string;
  isLoading?: boolean;
  isCollapsed?: boolean;
  className?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({
  firstName = '',
  lastName = '',
  companyRole = '',
  croppedPicturePath = '',
  isLoading = false,
  isCollapsed = false,
  className = ''
}) => {
  if (isLoading || (!firstName && !croppedPicturePath)) {
    return <Loading type="local" size="sm" />;
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <Link 
      to={`/${WALL}${SETTINGS}/profile`}
      className={cn(
        'flex items-center gap-3 p-2 rounded-lg transition-colors',
        'hover:bg-accent/10 cursor-pointer',
        isCollapsed && 'justify-center',
        className
      )}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={croppedPicturePath} alt={`${firstName} ${lastName}`} />
        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {!isCollapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate">
            {firstName} {lastName}
          </span>
          {companyRole && (
            <span className="text-xs text-muted-foreground truncate">
              {companyRole}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export { UserInfo };
export default UserInfo;
