// -----------------------------------------------------------------------------
// DeleteAccountModal Component
// Migrated from old_app/src/components/organisms/modals/DeleteAccountModal.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { AlertTriangle } from 'lucide-react';

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

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * Modal for confirming account deletion
 */
const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <AlertDialogTitle>
              <FormattedMessage id="form.delete.account.title" defaultMessage="Delete Account" />
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            <FormattedMessage 
              id="form.delete.confirm" 
              defaultMessage="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed." 
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            <FormattedMessage id="form.delete.cancel" defaultMessage="Cancel" />
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <FormattedMessage id="common.deleting" defaultMessage="Deleting..." />
            ) : (
              <FormattedMessage id="form.delete.account" defaultMessage="Delete Account" />
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountModal;
