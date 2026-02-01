// -----------------------------------------------------------------------------
// Create Program Modal
// Modal for selecting a platform before creating a new program
// Now supports superplatform hierarchy with sub-platform selection
// Role-based: Admin/Super Admin/Hyper Admin must select platform first
// -----------------------------------------------------------------------------

import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, ChevronRight, Plus, Layers, ChevronDown, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { ROLE, ALL_ADMIN_ROLES } from '@/constants/security/access';
import { useUserRole } from '@/hooks/auth';
import { useParentPlatformSelection } from '@/hooks/programs';
import { isSuperPlatform, canCreateProgramUnder } from '@/services/HyperProgramService';
import { IPlatform } from '../types';

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  platforms: IPlatform[];
  isLoading?: boolean;
  onCreateSuperplatform?: () => void;
  onCreateSubplatform?: (parentPlatform: IPlatform) => void;
  onInviteSuperAdmin?: (platform: IPlatform) => void;
}

/**
 * Check if user role is any kind of admin
 */
const isAdminRole = (role: ROLE | null): boolean => {
  if (!role) return false;
  return ALL_ADMIN_ROLES.includes(role);
};

/**
 * Check if user is Hyper Admin or Hyper Community Manager
 */
const isHyperRole = (role: ROLE | null): boolean => {
  return role === ROLE.HYPER_ADMIN || role === ROLE.HYPER_COMMUNITY_MANAGER;
};

/**
 * Check if user is Super Admin or Super Community Manager
 */
const isSuperRole = (role: ROLE | null): boolean => {
  return role === ROLE.SUPER_ADMIN || role === ROLE.SUPER_COMMUNITY_MANAGER;
};

export const CreateProgramModal: React.FC<CreateProgramModalProps> = ({
  isOpen,
  onClose,
  platforms,
  isLoading = false,
  onCreateSuperplatform,
  onCreateSubplatform,
  onInviteSuperAdmin,
}) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const userRole = useUserRole();
  const isAdmin = isAdminRole(userRole);
  const isHyper = isHyperRole(userRole);
  const isSuper = isSuperRole(userRole);
  
  const { setParentPlatform } = useParentPlatformSelection();

  const [selectedPlatformId, setSelectedPlatformId] = useState<number | null>(null);
  const [expandedSuperPlatformId, setExpandedSuperPlatformId] = useState<number | null>(null);

  // Separate platforms by type
  const superPlatforms = useMemo(() => 
    platforms.filter(p => p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM),
    [platforms]
  );
  
  const independentPlatforms = useMemo(() => 
    platforms.filter(p => 
      p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT || 
      (!p.hierarchicType && p.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM)
    ),
    [platforms]
  );

  // Get sub-platforms for a super platform
  const getSubPlatforms = (superPlatformId: number): IPlatform[] => {
    const superPlatform = platforms.find(p => p.id === superPlatformId);
    if (superPlatform?.subPlatforms) {
      return superPlatform.subPlatforms;
    }
    return platforms.filter(p => 
      p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM
    );
  };

  const handleSelectPlatform = (platform: IPlatform) => {
    // Only allow selection of platforms that can have programs
    if (canCreateProgramUnder(platform)) {
      setSelectedPlatformId(platform.id);
    }
  };

  const handleExpandSuperPlatform = (platformId: number) => {
    setExpandedSuperPlatformId(
      expandedSuperPlatformId === platformId ? null : platformId
    );
  };

  const handleStartCreation = () => {
    if (selectedPlatformId) {
      const selectedPlatform = platforms.find(p => p.id === selectedPlatformId) ||
        platforms.flatMap(p => p.subPlatforms || []).find(sp => sp.id === selectedPlatformId);
      
      if (selectedPlatform) {
        setParentPlatform(selectedPlatform);
      }
      
      navigate(`/launch?platformId=${selectedPlatformId}`);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedPlatformId(null);
    setExpandedSuperPlatformId(null);
    onClose();
  };

  // Check if selected platform can have programs
  const selectedPlatform = platforms.find(p => p.id === selectedPlatformId) ||
    platforms.flatMap(p => p.subPlatforms || []).find(sp => sp.id === selectedPlatformId);
  const isSuperPlatformSelected = selectedPlatform && isSuperPlatform(selectedPlatform.hierarchicType);
  const canContinue = selectedPlatformId && !isSuperPlatformSelected;

  // Determine what the user can do based on role
  const canCreateSuperPlatform = isHyper || isSuper;
  const canInviteSuperAdmin = isHyper;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {formatMessage({ 
              id: 'programs.createModal.title', 
              defaultMessage: 'Create New Program' 
            })}
          </DialogTitle>
          <DialogDescription>
            {formatMessage({ 
              id: 'programs.createModal.description', 
              defaultMessage: 'Select a platform to create your new program under.' 
            })}
            {(isHyper || isSuper) && (
              <span className="block mt-1 text-xs text-muted-foreground">
                {formatMessage({
                  id: 'programs.createModal.adminHint',
                  defaultMessage: 'As an admin, you can also create new platforms or invite super admins.'
                })}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : platforms.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {formatMessage({ 
                  id: 'programs.createModal.noPlatforms', 
                  defaultMessage: 'No platforms available.' 
                })}
              </p>
              {canCreateSuperPlatform && onCreateSuperplatform && (
                <Button onClick={onCreateSuperplatform}>
                  <Plus className="h-4 w-4 mr-2" />
                  {formatMessage({ 
                    id: 'superplatform.createFirst', 
                    defaultMessage: 'Create Platform' 
                  })}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Super Platforms */}
              {superPlatforms.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {formatMessage({ 
                        id: 'superplatform.title', 
                        defaultMessage: 'Super Platforms' 
                      })}
                    </h3>
                    {canCreateSuperPlatform && onCreateSuperplatform && (
                      <Button variant="ghost" size="sm" onClick={onCreateSuperplatform}>
                        <Plus className="h-4 w-4 mr-1" />
                        {formatMessage({ id: 'common.add', defaultMessage: 'Add' })}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {superPlatforms.map((platform) => {
                      const isExpanded = expandedSuperPlatformId === platform.id;
                      const subPlatforms = getSubPlatforms(platform.id);

                      return (
                        <div key={platform.id} className="space-y-2">
                          <Card
                            className={cn(
                              'cursor-pointer transition-all hover:border-primary',
                              isExpanded && 'border-primary ring-1 ring-primary/20'
                            )}
                            onClick={() => handleExpandSuperPlatform(platform.id)}
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
                                  {isExpanded ? (
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Sub-platforms */}
                          {isExpanded && (
                            <div className="pl-6 space-y-2">
                              {subPlatforms.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-2 text-center">
                                  {formatMessage({ 
                                    id: 'superplatform.noSubplatforms', 
                                    defaultMessage: 'No sub-platforms yet' 
                                  })}
                                </p>
                              ) : (
                                subPlatforms.map((subPlatform) => (
                                  <Card
                                    key={subPlatform.id}
                                    className={cn(
                                      'cursor-pointer transition-all hover:border-primary',
                                      selectedPlatformId === subPlatform.id && 
                                        'border-primary ring-2 ring-primary/20 bg-primary/5'
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectPlatform(subPlatform);
                                    }}
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
                                        {selectedPlatformId === subPlatform.id && (
                                          <Badge variant="default" className="text-xs">
                                            {formatMessage({ id: 'common.selected', defaultMessage: 'Selected' })}
                                          </Badge>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))
                              )}

                              {/* Add sub-platform button */}
                              {onCreateSubplatform && isAdmin && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full border-dashed"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onCreateSubplatform(platform);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  {formatMessage({ 
                                    id: 'superplatform.addSubplatform', 
                                    defaultMessage: 'Add Sub-Platform' 
                                  })}
                                </Button>
                              )}

                              {/* Invite Super Admin button (only for Hyper Admin) */}
                              {canInviteSuperAdmin && onInviteSuperAdmin && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full border-dashed"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onInviteSuperAdmin(platform);
                                  }}
                                >
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  {formatMessage({ 
                                    id: 'superplatform.inviteSuperAdmin', 
                                    defaultMessage: 'Invite Super Admin' 
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

              {/* Independent Platforms */}
              {independentPlatforms.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {superPlatforms.length > 0 
                      ? formatMessage({ 
                          id: 'superplatform.independentTitle', 
                          defaultMessage: 'Independent Platforms' 
                        })
                      : formatMessage({ 
                          id: 'programs.platforms', 
                          defaultMessage: 'Platforms' 
                        })
                    }
                  </h3>

                  <div className="space-y-2">
                    {independentPlatforms.map((platform) => (
                      <Card
                        key={platform.id}
                        className={cn(
                          'cursor-pointer transition-all hover:border-primary',
                          selectedPlatformId === platform.id && 
                            'border-primary ring-2 ring-primary/20 bg-primary/5'
                        )}
                        onClick={() => handleSelectPlatform(platform)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{platform.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {platform.nrOfPrograms || platform.programs?.length || 0}{' '}
                                  {formatMessage({ id: 'programs.programCount', defaultMessage: 'programs' })}
                                </p>
                              </div>
                            </div>
                            {selectedPlatformId === platform.id ? (
                              <Badge variant="default">
                                {formatMessage({ id: 'common.selected', defaultMessage: 'Selected' })}
                              </Badge>
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            {formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
          </Button>
          <Button 
            onClick={handleStartCreation} 
            disabled={!canContinue}
          >
            {formatMessage({ id: 'programs.createModal.continue', defaultMessage: 'Continue' })}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProgramModal;
