/**
 * SuccessModal Component
 * Migrated from old_app/src/components/organisms/modals/SuccessModal.tsx
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
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSuccessModal } from '@/hooks/modals/useSuccessModal';
import { CheckCircle2 } from 'lucide-react';

interface SuccessModalProps {
  closeButtonHidden?: boolean;
  isOnboardingFlow?: boolean;
}

/**
 * Generic success modal for form submissions
 */
export const SuccessModal: React.FC<SuccessModalProps> = ({
  closeButtonHidden = false,
  isOnboardingFlow = false,
}) => {
  const { formatMessage } = useIntl();
  const { isOpen, data, onClose } = useSuccessModal();

  const title = data?.title || 'success.modal.title';
  const message = data?.message || 'success.modal.message';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {formatMessage({ id: title })}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {formatMessage({ id: message })}
          </DialogDescription>
        </DialogHeader>

        {!closeButtonHidden && (
          <DialogFooter className="sm:justify-center">
            <Button onClick={onClose} className="min-w-[120px]">
              {formatMessage({ 
                id: isOnboardingFlow ? 'onboarding.continue' : 'label.close.modal' 
              })}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
