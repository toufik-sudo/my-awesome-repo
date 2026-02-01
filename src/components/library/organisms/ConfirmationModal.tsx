// -----------------------------------------------------------------------------
// ConfirmationModal Organism Component
// Consolidated from old_app confirmation modals (Confirmation, Delete, Block, etc.)
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ConfirmationVariant = 'default' | 'danger' | 'warning';

type FormatValues = Record<string, string | number | boolean | Date | React.ReactNode>;

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  titleId?: string;
  description?: string;
  descriptionId?: string;
  confirmLabel?: string;
  confirmLabelId?: string;
  cancelLabel?: string;
  cancelLabelId?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
  showCancelButton?: boolean;
  values?: FormatValues;
}

const variantStyles: Record<ConfirmationVariant, string> = {
  default: '',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  titleId = 'confirmation.label.are.you.sure',
  description,
  descriptionId,
  confirmLabel,
  confirmLabelId = 'confirmation.cta.yes',
  cancelLabel,
  cancelLabelId = 'confirmation.cta.no',
  variant = 'default',
  isLoading = false,
  showCancelButton = true,
  values,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || <FormattedMessage id={titleId} defaultMessage="Are you sure?" values={values} />}
          </AlertDialogTitle>
          {(description || descriptionId) && (
            <AlertDialogDescription>
              {description || <FormattedMessage id={descriptionId} defaultMessage="" />}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {showCancelButton && (
            <AlertDialogCancel onClick={onClose} disabled={isLoading}>
              {cancelLabel || <FormattedMessage id={cancelLabelId} defaultMessage="No" />}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(variantStyles[variant])}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <FormattedMessage id="label.loading" defaultMessage="Loading..." />
              </span>
            ) : (
              confirmLabel || <FormattedMessage id={confirmLabelId} defaultMessage="Yes" />
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Preset variants for common use cases
export const DeleteConfirmationModal: React.FC<Omit<ConfirmationModalProps, 'variant' | 'titleId' | 'confirmLabelId'>> = (props) => (
  <ConfirmationModal
    {...props}
    variant="danger"
    titleId="form.delete.confirm"
    confirmLabelId="form.delete.account"
  />
);

export const BlockUserModal: React.FC<Omit<ConfirmationModalProps, 'variant'> & { status?: string }> = ({ 
  status, 
  ...props 
}) => (
  <ConfirmationModal
    {...props}
    variant="warning"
    titleId={status ? `wall.user.details.programs.${status}` : 'confirmation.label.are.you.sure'}
  />
);

export const LeaveConfirmationModal: React.FC<Omit<ConfirmationModalProps, 'confirmLabelId' | 'cancelLabelId'>> = (props) => (
  <ConfirmationModal
    {...props}
    confirmLabelId="modal.exit.quit"
    cancelLabelId="modal.exit.resume"
    variant="danger"
  />
);

export { ConfirmationModal };
export default ConfirmationModal;
