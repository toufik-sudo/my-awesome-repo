/**
 * CreatePlatformModal Component
 * Migrated from old_app/src/components/organisms/modals/CreatePlatformModal.tsx
 * Modern implementation using shadcn Dialog
 */

import React from 'react';
import { useIntl } from 'react-intl';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreatePlatformModal } from '@/hooks/modals/useCreatePlatformModal';
import { Plus, Building2 } from 'lucide-react';

interface CreatePlatformModalProps {
  onPlatformCreated?: (wasCreated: boolean) => void;
}

/**
 * Modal for creating a new platform or sub-platform
 */
export const CreatePlatformModal: React.FC<CreatePlatformModalProps> = ({
  onPlatformCreated,
}) => {
  const { formatMessage } = useIntl();
  const {
    isOpen,
    platformName,
    error,
    isLoading,
    canSubmit,
    isSuperPlatform,
    onNameChange,
    onSubmit,
    onClose,
  } = useCreatePlatformModal({ onPlatformCreated });

  const handleClose = () => onClose(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">
            {formatMessage({
              id: isSuperPlatform ? 'create.new.superplatform' : 'create.new.platform',
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="platform-name">
              {formatMessage({ id: 'platform.name.label' })}
            </Label>
            <Input
              id="platform-name"
              value={platformName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={formatMessage({ id: 'platform.name.placeholder' })}
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-sm text-destructive">
                {formatMessage({ id: error })}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="gap-2"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {formatMessage({ id: 'label.button.validate' })}
          </Button>
          <Button variant="destructive" onClick={handleClose}>
            {formatMessage({ id: 'form.delete.cancel' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlatformModal;
