// -----------------------------------------------------------------------------
// LogOutModal Organism Component
// Migrated from old_app/src/components/organisms/modals/LogOutModal.tsx
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

export interface LogOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogOutModal: React.FC<LogOutModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <FormattedMessage id="logout.label.title" defaultMessage="Logout" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <FormattedMessage 
              id="logout.label.are.you.sure" 
              defaultMessage="Are you sure you want to logout?" 
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            <FormattedMessage id="logout.cta.no" defaultMessage="No" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            <FormattedMessage id="logout.cta.yes" defaultMessage="Yes" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { LogOutModal };
export default LogOutModal;
