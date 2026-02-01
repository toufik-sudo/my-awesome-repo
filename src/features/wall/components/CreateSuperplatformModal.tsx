// -----------------------------------------------------------------------------
// Create Superplatform Modal
// Modal for creating a new superplatform or sub-platform
// For Hyper/Super Admin roles when creating platform hierarchy
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Building2, Plus, Layers } from 'lucide-react';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { useSuperplatformManagement } from '../hooks/useSuperplatformManagement';
import { useParentPlatformSelection } from '@/hooks/programs';
import { isValidPlatformName } from '@/services/HyperProgramService';
import { IPlatform } from '../types';

interface CreateSuperplatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (platform: any) => void;
  hierarchicType?: PLATFORM_HIERARCHIC_TYPE;
  parentPlatform?: IPlatform | null;
}

export const CreateSuperplatformModal: React.FC<CreateSuperplatformModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  hierarchicType = PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM,
  parentPlatform
}) => {
  const { formatMessage } = useIntl();
  const [platformName, setPlatformName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { createPlatform, isCreating, error } = useSuperplatformManagement();
  const { setEnableOnly } = useParentPlatformSelection();

  const isSubPlatform = hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM;
  const isSuperPlatformType = hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM;

  const handleSubmit = async () => {
    if (!isValidPlatformName(platformName)) {
      setValidationError(formatMessage({ 
        id: 'platform.name.error.minLength', 
        defaultMessage: 'Platform name must be at least 3 characters' 
      }));
      return;
    }

    try {
      const newPlatform = await createPlatform(
        platformName.trim(),
        hierarchicType,
        parentPlatform?.id
      );
      
      setPlatformName('');
      setValidationError(null);
      onCreated?.(newPlatform);
      onClose();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleClose = () => {
    setPlatformName('');
    setValidationError(null);
    onClose();
  };

  // For Hyper admin creating super platform, allow creating directly
  const handleCreateForHyperAdmin = () => {
    if (isSuperPlatformType) {
      // Trigger the creation flow via the parent platform selection hook
      setEnableOnly([PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM]);
    }
  };

  const getTitle = () => {
    if (isSubPlatform) {
      return formatMessage({ 
        id: 'create.new.subplatform', 
        defaultMessage: 'Create Sub-Platform' 
      });
    }
    return formatMessage({ 
      id: 'create.new.superplatform', 
      defaultMessage: 'Create Super Platform' 
    });
  };

  const getDescription = () => {
    if (isSubPlatform && parentPlatform) {
      return formatMessage(
        { 
          id: 'create.subplatform.description', 
          defaultMessage: 'Create a new sub-platform under {parentName}' 
        },
        { parentName: parentPlatform.name }
      );
    }
    return formatMessage({ 
      id: 'create.superplatform.description', 
      defaultMessage: 'Create a new super platform to organize multiple platforms' 
    });
  };

  const getIcon = () => {
    if (isSubPlatform) {
      return <Building2 className="h-6 w-6 text-primary" />;
    }
    return <Layers className="h-6 w-6 text-primary" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            {getIcon()}
          </div>
          <DialogTitle className="text-center">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-center">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="platform-name">
              {formatMessage({ id: 'platform.name.label', defaultMessage: 'Platform Name' })}
            </Label>
            <Input
              id="platform-name"
              value={platformName}
              onChange={(e) => {
                setPlatformName(e.target.value);
                setValidationError(null);
              }}
              placeholder={formatMessage({ 
                id: 'platform.name.placeholder', 
                defaultMessage: 'Enter platform name' 
              })}
              className={validationError || error ? 'border-destructive' : ''}
              disabled={isCreating}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isCreating && isValidPlatformName(platformName)) {
                  handleSubmit();
                }
              }}
            />
            {(validationError || error) && (
              <p className="text-sm text-destructive">
                {validationError || error}
              </p>
            )}
          </div>

          {/* Show parent platform info if creating sub-platform */}
          {isSubPlatform && parentPlatform && (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">
                {formatMessage({ id: 'platform.parent', defaultMessage: 'Parent Platform' })}
              </p>
              <p className="text-sm font-medium">{parentPlatform.name}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            {formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isCreating || !isValidPlatformName(platformName)}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {formatMessage({ id: 'label.button.validate', defaultMessage: 'Create' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSuperplatformModal;
