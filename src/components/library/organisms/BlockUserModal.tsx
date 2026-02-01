// -----------------------------------------------------------------------------
// BlockUserModal Component
// Migrated from old_app/src/components/organisms/modals/BlockUserModal.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Ban, UserCheck } from 'lucide-react';

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

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type UserBlockStatus = 'block' | 'unblock';

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  status: UserBlockStatus;
  isLoading?: boolean;
}

/**
 * Modal for confirming user block/unblock action
 */
const BlockUserModal: React.FC<BlockUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName = 'this user',
  status,
  isLoading = false
}) => {
  const isBlocking = status === 'block';
  const Icon = isBlocking ? Ban : UserCheck;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className={`flex items-center gap-3 ${isBlocking ? 'text-destructive' : 'text-primary'}`}>
            <Icon className="h-6 w-6" />
            <AlertDialogTitle>
              {isBlocking ? (
                <FormattedMessage id="wall.user.block.title" defaultMessage="Block User" />
              ) : (
                <FormattedMessage id="wall.user.unblock.title" defaultMessage="Unblock User" />
              )}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {isBlocking ? (
              <FormattedMessage 
                id="wall.user.block.confirm" 
                defaultMessage="Are you sure you want to block {userName}? They will no longer be able to access the platform."
                values={{ userName }}
              />
            ) : (
              <FormattedMessage 
                id="wall.user.unblock.confirm" 
                defaultMessage="Are you sure you want to unblock {userName}? They will regain access to the platform."
                values={{ userName }}
              />
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            <FormattedMessage id="confirmation.cta.no" defaultMessage="No" />
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={isBlocking ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            <FormattedMessage id="confirmation.cta.yes" defaultMessage="Yes" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlockUserModal;
