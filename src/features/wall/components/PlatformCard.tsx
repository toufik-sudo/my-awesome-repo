// -----------------------------------------------------------------------------
// Platform Card Component
// Enhanced card design for displaying platform information
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Layers, 
  ChevronDown, 
  ChevronRight, 
  Plus,
  FolderOpen
} from 'lucide-react';
import { IPlatform } from '../types';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { cn } from '@/lib/utils';

interface PlatformCardProps {
  platform: IPlatform;
  isExpanded?: boolean;
  isSelected?: boolean;
  onSelect: () => void;
  onExpand?: () => void;
  onAddSubPlatform?: () => void;
  showAddButton?: boolean;
  variant?: 'super' | 'sub' | 'independent';
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  isExpanded = false,
  isSelected = false,
  onSelect,
  onExpand,
  onAddSubPlatform,
  showAddButton = false,
  variant = 'independent',
}) => {
  const { formatMessage } = useIntl();

  const isSuperPlatform = variant === 'super' || 
    platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM ||
    platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM;

  const programCount = platform.nrOfPrograms || platform.programs?.length || 0;
  const subPlatformCount = platform.subPlatforms?.length || 0;

  const getVariantStyles = () => {
    switch (variant) {
      case 'super':
        return {
          card: 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40',
          icon: 'bg-primary/20 text-primary',
          badge: 'bg-primary/10 text-primary border-primary/20'
        };
      case 'sub':
        return {
          card: 'bg-gradient-to-br from-secondary/30 to-secondary/50 border-secondary hover:border-primary/40',
          icon: 'bg-secondary text-secondary-foreground',
          badge: 'bg-secondary text-secondary-foreground'
        };
      default:
        return {
          card: 'bg-card hover:border-primary/40',
          icon: 'bg-muted text-muted-foreground',
          badge: 'bg-muted text-muted-foreground'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:shadow-primary/5",
        styles.card,
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        isExpanded && isSuperPlatform && "border-primary shadow-md"
      )}
      onClick={isSuperPlatform && onExpand ? onExpand : onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Platform Icon */}
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
              styles.icon,
              "group-hover:scale-105"
            )}>
              {isSuperPlatform ? (
                <Layers className="h-5 w-5" />
              ) : variant === 'sub' ? (
                <FolderOpen className="h-5 w-5" />
              ) : (
                <Building2 className="h-5 w-5" />
              )}
            </div>

            {/* Platform Info */}
            <div>
              <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                {platform.name}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {isSuperPlatform && subPlatformCount > 0 && (
                  <span className="mr-2">
                    {subPlatformCount} {formatMessage({ 
                      id: 'platform.subPlatforms', 
                      defaultMessage: 'sub-platforms' 
                    })}
                  </span>
                )}
                <span>
                  {programCount} {formatMessage({ 
                    id: 'programs.count', 
                    defaultMessage: 'programs' 
                  })}
                </span>
              </CardDescription>
            </div>
          </div>

          {/* Actions/Status */}
          <div className="flex items-center gap-2">
            {isSuperPlatform && (
              <Badge variant="outline" className={styles.badge}>
                {formatMessage({ id: 'platform.type.super', defaultMessage: 'Super' })}
              </Badge>
            )}
            
            {isSelected && !isSuperPlatform && (
              <Badge variant="default" className="text-xs">
                {formatMessage({ id: 'platform.selected', defaultMessage: 'Selected' })}
              </Badge>
            )}

            {isSuperPlatform && onExpand && (
              <div className={cn(
                "transition-transform duration-200",
                isExpanded && "rotate-180"
              )}>
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </div>
            )}

            {!isSuperPlatform && (
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            )}
          </div>
        </div>
      </CardHeader>

      {/* Quick Add Button for Super Platforms */}
      {showAddButton && isSuperPlatform && onAddSubPlatform && (
        <CardContent className="pt-0 pb-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onAddSubPlatform();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {formatMessage({ id: 'platform.addSubPlatform', defaultMessage: 'Add Sub-Platform' })}
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default PlatformCard;
