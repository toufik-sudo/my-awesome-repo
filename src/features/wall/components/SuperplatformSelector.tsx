// -----------------------------------------------------------------------------
// Superplatform Selector Component
// Dropdown/card selector for choosing superplatform and sub-platforms
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  ChevronRight, 
  ChevronDown,
  Plus,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { IPlatform } from '../types';

interface SuperplatformSelectorProps {
  superPlatforms: IPlatform[];
  allPlatforms: IPlatform[];
  selectedSuperPlatform: IPlatform | null;
  selectedPlatform: IPlatform | null;
  onSelectSuperPlatform: (platform: IPlatform | null) => void;
  onSelectPlatform: (platform: IPlatform | null) => void;
  onCreateSuperPlatform?: () => void;
  onCreateSubPlatform?: (parentPlatform: IPlatform) => void;
  showCreateButtons?: boolean;
  isLoading?: boolean;
}

export const SuperplatformSelector: React.FC<SuperplatformSelectorProps> = ({
  superPlatforms,
  allPlatforms,
  selectedSuperPlatform,
  selectedPlatform,
  onSelectSuperPlatform,
  onSelectPlatform,
  onCreateSuperPlatform,
  onCreateSubPlatform,
  showCreateButtons = false,
  isLoading = false
}) => {
  const { formatMessage } = useIntl();

  // Get sub-platforms for a super platform
  const getSubPlatforms = (superPlatformId: number): IPlatform[] => {
    const superPlatform = allPlatforms.find(p => p.id === superPlatformId);
    if (superPlatform?.subPlatforms) {
      return superPlatform.subPlatforms;
    }
    return allPlatforms.filter(p => 
      p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM
    );
  };

  // Get independent platforms (not super or sub)
  const independentPlatforms = allPlatforms.filter(p => 
    p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT || !p.hierarchicType
  );

  const handleSuperPlatformClick = (platform: IPlatform) => {
    if (selectedSuperPlatform?.id === platform.id) {
      onSelectSuperPlatform(null);
    } else {
      onSelectSuperPlatform(platform);
    }
  };

  if (superPlatforms.length === 0 && independentPlatforms.length === 0) {
    return (
      <div className="text-center py-8">
        <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">
          {formatMessage({ 
            id: 'superplatform.noPlatforms', 
            defaultMessage: 'No platforms available' 
          })}
        </p>
        {showCreateButtons && onCreateSuperPlatform && (
          <Button onClick={onCreateSuperPlatform}>
            <Plus className="h-4 w-4 mr-2" />
            {formatMessage({ 
              id: 'superplatform.createFirst', 
              defaultMessage: 'Create Your First Platform' 
            })}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Super Platforms Section */}
      {superPlatforms.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {formatMessage({ 
                id: 'superplatform.title', 
                defaultMessage: 'Super Platforms' 
              })}
            </h3>
            {showCreateButtons && onCreateSuperPlatform && (
              <Button variant="ghost" size="sm" onClick={onCreateSuperPlatform}>
                <Plus className="h-4 w-4 mr-1" />
                {formatMessage({ id: 'common.add', defaultMessage: 'Add' })}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {superPlatforms.map((platform) => {
              const isSelected = selectedSuperPlatform?.id === platform.id;
              const subPlatforms = getSubPlatforms(platform.id);

              return (
                <div key={platform.id} className="space-y-2">
                  <Card
                    className={cn(
                      'cursor-pointer transition-all hover:border-primary',
                      isSelected && 'border-primary ring-2 ring-primary/20 bg-primary/5'
                    )}
                    onClick={() => handleSuperPlatformClick(platform)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{platform.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {subPlatforms.length}{' '}
                              {formatMessage({ 
                                id: 'superplatform.subplatformCount', 
                                defaultMessage: 'sub-platforms' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {formatMessage({ 
                              id: 'platform.type.super', 
                              defaultMessage: 'Super' 
                            })}
                          </Badge>
                          {isSelected ? (
                            <ChevronDown className="h-5 w-5 text-primary" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sub-platforms (shown when super platform is selected) */}
                  {isSelected && (
                    <div className="pl-6 space-y-2">
                      {subPlatforms.map((subPlatform) => (
                        <Card
                          key={subPlatform.id}
                          className={cn(
                            'cursor-pointer transition-all hover:border-primary',
                            selectedPlatform?.id === subPlatform.id && 
                              'border-primary ring-2 ring-primary/20 bg-primary/5'
                          )}
                          onClick={() => onSelectPlatform(subPlatform)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                                  <Building2 className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{subPlatform.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {subPlatform.nrOfPrograms || subPlatform.programs?.length || 0}{' '}
                                    {formatMessage({ id: 'programs.programCount', defaultMessage: 'programs' })}
                                  </p>
                                </div>
                              </div>
                              {selectedPlatform?.id === subPlatform.id && (
                                <Badge variant="default" className="text-xs">
                                  {formatMessage({ id: 'common.selected', defaultMessage: 'Selected' })}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {/* Add sub-platform button */}
                      {showCreateButtons && onCreateSubPlatform && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-dashed"
                          onClick={() => onCreateSubPlatform(platform)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {formatMessage({ 
                            id: 'superplatform.addSubplatform', 
                            defaultMessage: 'Add Sub-Platform' 
                          })}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Independent Platforms Section */}
      {independentPlatforms.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {formatMessage({ 
              id: 'superplatform.independentTitle', 
              defaultMessage: 'Independent Platforms' 
            })}
          </h3>

          <div className="space-y-2">
            {independentPlatforms.map((platform) => (
              <Card
                key={platform.id}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary',
                  selectedPlatform?.id === platform.id && 
                    'border-primary ring-2 ring-primary/20 bg-primary/5'
                )}
                onClick={() => onSelectPlatform(platform)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{platform.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {platform.nrOfPrograms || platform.programs?.length || 0}{' '}
                          {formatMessage({ id: 'programs.programCount', defaultMessage: 'programs' })}
                        </p>
                      </div>
                    </div>
                    {selectedPlatform?.id === platform.id && (
                      <Badge variant="default">
                        {formatMessage({ id: 'common.selected', defaultMessage: 'Selected' })}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperplatformSelector;
