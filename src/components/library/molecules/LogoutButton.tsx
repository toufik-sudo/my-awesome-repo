// -----------------------------------------------------------------------------
// LogoutButton Molecule Component
// Button to trigger logout action
// -----------------------------------------------------------------------------

import React from 'react';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormattedMessage } from 'react-intl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface LogoutButtonProps {
  onLogout?: () => void;
  isCollapsed?: boolean;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  isCollapsed = false,
  className = ''
}) => {
  const buttonContent = (
    <Button
      variant="ghost"
      onClick={onLogout}
      className={cn(
        'w-full justify-start gap-2 text-muted-foreground hover:text-foreground',
        isCollapsed && 'justify-center px-2',
        className
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {!isCollapsed && (
        <span>
          <FormattedMessage id="navigation.logout" defaultMessage="Logout" />
        </span>
      )}
    </Button>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p><FormattedMessage id="navigation.logout" defaultMessage="Logout" /></p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
};

export { LogoutButton };
export default LogoutButton;
