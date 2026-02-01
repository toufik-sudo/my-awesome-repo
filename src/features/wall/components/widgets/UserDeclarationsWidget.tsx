// -----------------------------------------------------------------------------
// UserDeclarationsWidget Component
// Displays user declarations/statements summary
// Migrated from old_app/src/components/molecules/wall/widgets/UserDeclarationsWidget.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { FileText, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WidgetCard } from './WidgetCard';
import { Loading } from '@/components/library/atoms/Loading';
import { Button } from '@/components/ui/button';
import { 
  USER_DECLARATIONS_ROUTE, 
  WALL_BENEFICIARY_DECLARATIONS_ROUTE,
  LAUNCH_BASE 
} from '@/constants/routes';
import { useDeclarationsWidget } from '@/api/hooks/useWidgetApi';
import { useWallSelection } from '@/hooks/wall';
import { useUserRole } from '@/hooks/auth';
import { isUserBeneficiary, isAnyKindOfManager } from '@/services/security/accessServices';

interface Declaration {
  id: number;
  label: string;
  value: string | number;
}

interface UserDeclarationsWidgetProps {
  className?: string;
  declarations?: Declaration[];
  isLoading?: boolean;
  isBeneficiary?: boolean;
  isFreemium?: boolean;
  isManager?: boolean;
  colorMainButtons?: string;
  colorWidgetTitle?: string;
  showImage?: boolean;
  imageUrl?: string;
  customTitle?: string;
  customDescription?: string;
  platformId?: number;
  programId?: number;
}

const UserDeclarationsWidget: React.FC<UserDeclarationsWidgetProps> = ({
  className,
  declarations: externalDeclarations,
  isLoading: externalLoading,
  isBeneficiary: externalIsBeneficiary,
  isFreemium = false,
  isManager: externalIsManager,
  colorMainButtons,
  colorWidgetTitle,
  showImage = false,
  imageUrl,
  customTitle,
  customDescription,
  platformId: propPlatformId,
  programId: propProgramId,
}) => {
  // Get context values
  const wallSelection = useWallSelection();
  const role = useUserRole();
  const platformId = propPlatformId ?? wallSelection?.selectedPlatform?.id;
  const programId = propProgramId ?? wallSelection?.selectedProgramId;
  
  // Use API hook for declarations
  const { data: apiDeclarations, isLoading: apiLoading } = useDeclarationsWidget(platformId, programId);
  
  // Compute role-based values
  const isBeneficiary = externalIsBeneficiary ?? isUserBeneficiary(role);
  const isManager = externalIsManager ?? isAnyKindOfManager(role);
  
  // Use external values if provided, otherwise use API data
  const declarations = externalDeclarations ?? (apiDeclarations || []);
  const isLoading = externalLoading ?? apiLoading;
  // Determine the link route
  const getLinkRoute = () => {
    if (isBeneficiary) return WALL_BENEFICIARY_DECLARATIONS_ROUTE;
    if (isFreemium && !isManager) return LAUNCH_BASE;
    return USER_DECLARATIONS_ROUTE;
  };

  // Determine the link text
  const getLinkTextId = () => {
    if (isBeneficiary) return 'wall.userDeclarations.block.allBeneficiary';
    if (isFreemium && !isManager) return 'wall.freemium.launch';
    return 'wall.userDeclarations.block.all';
  };

  return (
    <WidgetCard
      title={
        customTitle ? (
          <span style={colorWidgetTitle ? { color: colorWidgetTitle } : undefined}>
            {customTitle}
          </span>
        ) : (
          <FormattedMessage 
            id="wall.userDeclarations.block.userStatements" 
            defaultMessage="Your Declarations" 
          />
        )
      }
      className={cn('min-h-[200px]', className)}
      accentColor="accent"
      hideOnMobile
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {isLoading ? (
          <Loading type="local" size="sm" />
        ) : showImage && imageUrl ? (
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
            {/* Icon */}
            <div className="p-3 rounded-full bg-accent/10">
              <ClipboardList className="h-6 w-6 text-accent-foreground" />
            </div>

            {/* Freemium CTA */}
            {isFreemium && !isBeneficiary && !isManager && (
              <p className="text-2xl font-bold uppercase text-secondary text-center">
                <FormattedMessage 
                  id="wall.dashboard.block.freemium.start" 
                  defaultMessage="START" 
                />
              </p>
            )}

            {/* No Declarations */}
            {(!declarations.length || isFreemium) && !isLoading && (
              <p className="text-sm text-muted-foreground text-center">
                <FormattedMessage 
                  id="wall.userDeclarations.block.none" 
                  defaultMessage="No declarations yet" 
                />
              </p>
            )}

            {/* Declarations List */}
            {declarations.length > 0 && !isFreemium && (
              <div className="w-full space-y-1">
                {declarations.slice(0, 3).map((declaration) => (
                  <div 
                    key={declaration.id} 
                    className="flex justify-between items-center text-sm py-1 border-b border-border/50 last:border-0"
                  >
                    <span className="text-muted-foreground truncate max-w-[60%]">
                      {declaration.label}
                    </span>
                    <span className="font-medium">{declaration.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Link */}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium"
              asChild
              style={colorMainButtons ? { color: colorMainButtons } : undefined}
            >
              <Link to={getLinkRoute()}>
                <FormattedMessage 
                  id={getLinkTextId()} 
                  defaultMessage="View all declarations" 
                />
              </Link>
            </Button>
          </>
        )}
      </div>
    </WidgetCard>
  );
};

export { UserDeclarationsWidget };
export default UserDeclarationsWidget;
