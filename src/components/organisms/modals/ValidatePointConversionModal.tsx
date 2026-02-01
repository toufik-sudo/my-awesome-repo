/**
 * ValidatePointConversionModal Component
 * Migrated from old_app/src/components/organisms/modals/ValidatePointConversionModal.tsx
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
import { useValidatePointConversionModal } from '@/hooks/modals/useValidatePointConversionModal';
import { ArrowRightLeft } from 'lucide-react';

interface ValidatePointConversionModalProps {
  onSuccess?: (data: { id: number }) => void;
}

/**
 * Modal for validating point conversions
 */
export const ValidatePointConversionModal: React.FC<ValidatePointConversionModalProps> = ({
  onSuccess,
}) => {
  const { formatMessage } = useIntl();
  const { isOpen, onConfirm, onClose } = useValidatePointConversionModal({
    onSuccess,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ArrowRightLeft className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">
            {formatMessage({ id: 'pointsConversions.modal.validate' })}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={onConfirm} variant="default">
            {formatMessage({ id: 'confirmation.cta.yes' })}
          </Button>
          <Button variant="destructive" onClick={onClose}>
            {formatMessage({ id: 'confirmation.cta.no' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ValidatePointConversionModal;
