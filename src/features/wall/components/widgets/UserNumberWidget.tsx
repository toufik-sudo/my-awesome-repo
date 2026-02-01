// -----------------------------------------------------------------------------
// UserNumberWidget Component
// Displays user count/statistics for the program
// Migrated from old_app/src/components/molecules/wall/widgets/UserNumberWidget.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WidgetCard } from './WidgetCard';
import { Loading } from '@/components/library/atoms/Loading';
import { Button } from '@/components/ui/button';
import { USERS_ROUTE } from '@/constants/routes';
import { numberWithSpaces } from '@/utils/general';
import { useUserCount } from '@/api/hooks/useWidgetApi';
import { useWallSelection } from '@/hooks/wall';

interface UserNumberWidgetProps {
  className?: string;
  userCount?: number;
  isLoading?: boolean;
  colorTitle?: string;
  colorMainButtons?: string;
  colorWidgetTitle?: string;
  showImage?: boolean;
  imageUrl?: string;
  customTitle?: string;
  customDescription?: string;
  // Optional: pass platformId/programId or let the hook fetch from context
  platformId?: number;
  programId?: number;
}

const UserNumberWidget: React.FC<UserNumberWidgetProps> = ({
  className,
  userCount: externalUserCount,
  isLoading: externalLoading,
  colorTitle,
  colorMainButtons,
  colorWidgetTitle,
  showImage = false,
  imageUrl,
  customTitle,
  customDescription,
  platformId: propPlatformId,
  programId: propProgramId,
}) => {
  // Get context values if props not provided
  const wallSelection = useWallSelection();
  const platformId = propPlatformId ?? wallSelection?.selectedPlatform?.id;
  const programId = propProgramId ?? wallSelection?.selectedProgramId;
  
  // Use API hook for fetching user count
  const { data, isLoading: apiLoading } = useUserCount(platformId, programId);
  
  // Use external values if provided, otherwise use API data
  const userCount = externalUserCount ?? (data?.total || 0);
  const isLoading = externalLoading ?? apiLoading;
  const displayCount = numberWithSpaces ? numberWithSpaces(userCount) : userCount.toLocaleString();

  return (
    <WidgetCard
      title={
        customTitle ? (
          <span style={colorWidgetTitle ? { color: colorWidgetTitle } : undefined}>
            {customTitle}
          </span>
        ) : (
          <FormattedMessage id="wall.user.block.user" defaultMessage="Users" />
        )
      }
      className={cn('min-h-[180px]', className)}
      accentColor="secondary"
      hideOnMobile
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {isLoading ? (
          <Loading type="local" size="sm" />
        ) : (
          <>
            {showImage && imageUrl ? (
              <>
                <div className="w-full max-h-32 overflow-hidden rounded-lg">
                  <img 
                    src={imageUrl} 
                    alt="Widget" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {customDescription && (
                  <div 
                    className="text-sm text-muted-foreground text-center"
                    dangerouslySetInnerHTML={{ __html: customDescription }}
                  />
                )}
              </>
            ) : (
              <>
                {/* User Icon */}
                <div className="p-3 rounded-full bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>

                {/* User Count */}
                <div 
                  className="text-4xl font-bold bg-gradient-to-br from-secondary to-secondary/60 bg-clip-text text-transparent"
                  style={colorTitle ? { color: colorTitle } : undefined}
                >
                  {displayCount}
                </div>

                {/* Link to Users */}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-medium"
                  asChild
                  style={colorMainButtons ? { color: colorMainButtons } : undefined}
                >
                  <Link to={USERS_ROUTE}>
                    <FormattedMessage 
                      id="wall.user.see.all" 
                      defaultMessage="See all users" 
                    />
                  </Link>
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </WidgetCard>
  );
};

export { UserNumberWidget };
export default UserNumberWidget;
