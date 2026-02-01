// -----------------------------------------------------------------------------
// FormModal Organism Component
// Consolidated from CreatePlatformModal, AssignRole, and similar form modals
// Generic modal wrapper for form content
// -----------------------------------------------------------------------------

import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  titleId?: string;
  description?: string;
  descriptionId?: string;
  submitLabel?: string;
  submitLabelId?: string;
  cancelLabel?: string;
  cancelLabelId?: string;
  isSubmitting?: boolean;
  isValid?: boolean;
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCancelButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  titleId,
  description,
  descriptionId,
  submitLabel,
  submitLabelId = 'label.button.validate',
  cancelLabel,
  cancelLabelId = 'form.delete.cancel',
  isSubmitting = false,
  isValid = true,
  children,
  className,
  size = 'md',
  showCancelButton = true,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader>
          {(title || titleId) && (
            <DialogTitle>
              {title || <FormattedMessage id={titleId} defaultMessage="" />}
            </DialogTitle>
          )}
          {(description || descriptionId) && (
            <DialogDescription>
              {description || <FormattedMessage id={descriptionId} defaultMessage="" />}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="py-4">
            {children}
          </div>

          <DialogFooter className="gap-2">
            {showCancelButton && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {cancelLabel || <FormattedMessage id={cancelLabelId} defaultMessage="Cancel" />}
              </Button>
            )}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <FormattedMessage id="label.loading" defaultMessage="Loading..." />
                </span>
              ) : (
                submitLabel || <FormattedMessage id={submitLabelId} defaultMessage="Submit" />
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { FormModal };
export default FormModal;
