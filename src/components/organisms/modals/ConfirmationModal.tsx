/**
 * ConfirmationModal Component
 * Migrated from old_app/src/components/organisms/modals/ConfirmationModal.tsx
 * Modern implementation using shadcn Dialog
 */

import React from 'react';
import { useIntl } from 'react-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useConfirmationModal } from '@/hooks/modals/useConfirmationModal';

interface ConfirmationModalProps {
  onAccept: (data: unknown) => void;
  onClose?: () => void;
  question?: string;
  confirmLabel?: string;
  denyLabel?: string;
  onAcceptArgs?: string;
  showCloseButton?: boolean;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  denyVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * Reusable confirmation modal with customizable labels and actions
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onAccept,
  onClose,
  question = 'confirmation.label.are.you.sure',
  confirmLabel = 'confirmation.cta.yes',
  denyLabel = 'confirmation.cta.no',
  onAcceptArgs = 'selectedId',
  showCloseButton = true,
  confirmVariant = 'default',
  denyVariant = 'destructive',
}) => {
  const { formatMessage } = useIntl();
  const { isOpen, data, onConfirm, onClose: handleClose } = useConfirmationModal({
    onAccept,
    onAcceptArgs,
    onClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {formatMessage({ id: question }, data as Record<string, string>)}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant={confirmVariant} onClick={onConfirm}>
            {formatMessage({ id: confirmLabel })}
          </Button>
          {showCloseButton && (
            <Button variant={denyVariant} onClick={handleClose}>
              {formatMessage({ id: denyLabel })}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
